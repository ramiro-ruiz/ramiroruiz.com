import { registerEffect } from './registry.js';

const fragmentShader = `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform sampler2D u_logo;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_cursor;
uniform vec3 u_metalColor;
uniform float u_rippleSpeed;
uniform float u_rippleScale;
uniform float u_fresnelPower;
uniform float u_distortion;

float luminance(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

// Simplex-like noise
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1, 0)), f.x),
    mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = rot * p * 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 texel = 1.0 / u_resolution;
  vec4 logo = texture(u_logo, v_uv);
  float logoLum = luminance(logo.rgb);

  // Animated noise normal map
  vec2 noiseUV = v_uv * u_rippleScale + u_time * u_rippleSpeed * 0.1;

  // Cursor ripple
  vec2 cursorNorm = u_cursor / u_resolution;
  float cursorDist = length(v_uv - cursorNorm);
  float ripple = sin(cursorDist * 30.0 - u_time * 4.0) * exp(-cursorDist * 5.0) * 0.3;

  float nx = fbm(noiseUV + vec2(0.1, 0.0)) - fbm(noiseUV - vec2(0.1, 0.0)) + ripple;
  float ny = fbm(noiseUV + vec2(0.0, 0.1)) - fbm(noiseUV - vec2(0.0, 0.1)) + ripple;

  vec3 normal = normalize(vec3(nx * u_distortion, ny * u_distortion, 1.0));
  vec3 viewDir = vec3(0.0, 0.0, 1.0);

  // Environment reflection
  vec3 reflectDir = reflect(-viewDir, normal);
  float env = 0.3 + 0.5 * smoothstep(0.3, 0.7, sin(reflectDir.x * 5.0) * cos(reflectDir.y * 3.0));
  env += 0.2 * smoothstep(0.4, 0.6, sin(reflectDir.x * 2.0 + reflectDir.y * 7.0));

  // Fresnel
  float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), u_fresnelPower);

  // Combine
  vec3 color = u_metalColor * env * (0.8 + fresnel * 0.5);
  color *= logoLum;
  color += u_metalColor * fresnel * logoLum * 0.2;

  fragColor = vec4(color, logo.a);
}
`;

registerEffect({
  id: 'liquid-metal',
  name: 'Liquid Metal',
  fragmentShader,
  uniforms: ['u_logo', 'u_resolution', 'u_time', 'u_cursor', 'u_metalColor', 'u_rippleSpeed', 'u_rippleScale', 'u_fresnelPower', 'u_distortion'],
  schema: {
    metalColor: { type: 'color', label: 'Metal Color', default: '#a8c8e8', group: 'Material' },
    rippleSpeed: { type: 'range', label: 'Ripple Speed', min: 0.1, max: 2.0, step: 0.05, default: 0.5, group: 'Animation' },
    rippleScale: { type: 'range', label: 'Ripple Scale', min: 2, max: 20, default: 8, group: 'Animation' },
    fresnelPower: { type: 'range', label: 'Fresnel Power', min: 1, max: 5, step: 0.1, default: 2.5, group: 'Material' },
    distortion: { type: 'range', label: 'Distortion', min: 0.5, max: 5.0, step: 0.1, default: 2.0, group: 'Animation' },
  },
  setUniforms(gl, loc, props, hexToVec3) {
    gl.uniform3fv(loc.u_metalColor, hexToVec3(props.metalColor));
    gl.uniform1f(loc.u_rippleSpeed, props.rippleSpeed);
    gl.uniform1f(loc.u_rippleScale, props.rippleScale);
    gl.uniform1f(loc.u_fresnelPower, props.fresnelPower);
    gl.uniform1f(loc.u_distortion, props.distortion);
  },
});
