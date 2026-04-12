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
uniform float u_bevelWidth;

float luminance(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = rot * p * 2.0; a *= 0.5; }
  return v;
}

vec3 metalEnv(vec3 dir, vec3 col, float bright) {
  float b1 = pow(max(0.0, sin(dir.x * 4.0 + dir.y * 2.0)), 3.0) * 1.0;
  float b2 = pow(max(0.0, sin(dir.x * 2.0 - dir.y * 5.0 + 1.2)), 4.0) * 0.7;
  float b3 = pow(max(0.0, cos(dir.y * 6.0 + dir.x * 2.0)), 2.0) * 0.3;
  float env = (b1 + b2 + b3) * bright;
  return mix(col * 0.15, col * 1.5 + vec3(0.1), clamp(env, 0.0, 1.0));
}

void main() {
  vec2 texel = 1.0 / u_resolution;
  vec4 logo = texture(u_logo, v_uv);
  if (logo.a < 0.01) { fragColor = vec4(0.0); return; }

  // Animated noise normals (rippling surface)
  vec2 noiseUV = v_uv * u_rippleScale + u_time * u_rippleSpeed * 0.1;

  // Cursor ripple
  vec2 cursorNorm = u_cursor / u_resolution;
  float cursorDist = length(v_uv - cursorNorm);
  float ripple = sin(cursorDist * 30.0 - u_time * 4.0) * exp(-cursorDist * 5.0) * 0.3;

  float noisX = fbm(noiseUV + vec2(0.1, 0.0)) - fbm(noiseUV - vec2(0.1, 0.0)) + ripple;
  float noisY = fbm(noiseUV + vec2(0.0, 0.1)) - fbm(noiseUV - vec2(0.0, 0.1)) + ripple;

  // === MULTI-RADIUS EDGE BEVEL ===
  float bevelX = 0.0;
  float bevelY = 0.0;
  for (int r = 1; r <= 8; r++) {
    float radius = float(r) * u_bevelWidth;
    float aL = texture(u_logo, v_uv + vec2(-radius * texel.x, 0.0)).a;
    float aR = texture(u_logo, v_uv + vec2( radius * texel.x, 0.0)).a;
    float aU = texture(u_logo, v_uv + vec2(0.0, -radius * texel.y)).a;
    float aD = texture(u_logo, v_uv + vec2(0.0,  radius * texel.y)).a;
    float weight = 1.0 / float(r);
    bevelX += (aL - aR) * weight;
    bevelY += (aU - aD) * weight;
  }

  float bevelMag = length(vec2(bevelX, bevelY));
  float bevelIntensity = smoothstep(0.0, 0.5, bevelMag) * 3.5;

  // Edge rim light
  float rimLight = smoothstep(0.2, 0.4, bevelMag) * (1.0 - smoothstep(0.4, 0.7, bevelMag));
  rimLight *= 0.35;

  float nx = noisX * u_distortion + bevelX * bevelIntensity + (v_uv.x - 0.5) * 0.3;
  float ny = noisY * u_distortion + bevelY * bevelIntensity + (v_uv.y - 0.5) * 0.3;

  vec3 normal = normalize(vec3(nx, ny, 1.0));
  vec3 viewDir = vec3(0.0, 0.0, 1.0);
  vec3 lightDir = normalize(vec3((cursorNorm - 0.5) * 2.0, 0.5));

  // Environment reflection
  vec3 reflectDir = reflect(-viewDir, normal);
  vec3 envColor = metalEnv(reflectDir + lightDir * 0.4, u_metalColor, 1.5);

  // Fresnel
  float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), u_fresnelPower);

  // Specular
  vec3 halfDir = normalize(lightDir + viewDir);
  float spec = pow(max(dot(normal, halfDir), 0.0), 50.0) * 0.7;

  vec3 color = envColor * 1.2;
  color += vec3(1.0) * spec;
  color += u_metalColor * fresnel * 0.4;
  color += vec3(1.0) * rimLight;
  color += u_metalColor * 0.05;

  fragColor = vec4(color, logo.a);
}
`;

registerEffect({
  id: 'liquid-metal',
  name: 'Liquid Metal',
  fragmentShader,
  uniforms: ['u_logo', 'u_resolution', 'u_time', 'u_cursor', 'u_metalColor', 'u_rippleSpeed', 'u_rippleScale', 'u_fresnelPower', 'u_distortion', 'u_bevelWidth'],
  schema: {
    metalColor: { type: 'color', label: 'Metal Color', default: '#a8c8e8', group: 'Material' },
    bevelWidth: { type: 'range', label: 'Bevel Width', min: 1, max: 6, step: 0.1, default: 2.5, group: 'Material' },
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
    gl.uniform1f(loc.u_bevelWidth, props.bevelWidth);
  },
});
