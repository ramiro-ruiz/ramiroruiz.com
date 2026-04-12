import { registerEffect } from './registry.js';

const fragmentShader = `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform sampler2D u_logo;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_cursor;
uniform vec3 u_steelTint;
uniform float u_brushAngle;
uniform float u_highlightWidth;
uniform float u_noiseIntensity;
uniform float u_embossDepth;

float luminance(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

// Directional brush noise — stretched along brush angle
float brushNoise(vec2 p, float angle) {
  float c = cos(angle), s = sin(angle);
  vec2 rotated = vec2(c * p.x - s * p.y, s * p.x + c * p.y);
  return hash(vec2(floor(rotated.x * 300.0), floor(rotated.y * 1.5)));
}

vec3 steelEnv(vec3 dir, vec3 col, float angle) {
  // Anisotropic env — stretched bands along brush direction
  float c = cos(angle), s = sin(angle);
  float oriented = dir.x * c + dir.y * s;
  float b1 = pow(max(0.0, sin(oriented * 6.0)), 2.0) * 0.8;
  float b2 = pow(max(0.0, sin(oriented * 3.0 + 1.5)), 3.0) * 0.5;
  float b3 = smoothstep(0.3, 0.7, sin(dir.y * 4.0)) * 0.3;
  float env = (b1 + b2 + b3) * 0.7;
  return mix(col * 0.2, col * 1.3, env);
}

void main() {
  vec2 texel = 1.0 / u_resolution;
  vec4 logo = texture(u_logo, v_uv);
  if (logo.a < 0.01) { fragColor = vec4(0.0); return; }

  // Edge bevel + dome
  float lumL = luminance(texture(u_logo, v_uv + vec2(-texel.x * 2.0, 0)).rgb);
  float lumR = luminance(texture(u_logo, v_uv + vec2(texel.x * 2.0, 0)).rgb);
  float lumU = luminance(texture(u_logo, v_uv + vec2(0, -texel.y * 2.0)).rgb);
  float lumD = luminance(texture(u_logo, v_uv + vec2(0, texel.y * 2.0)).rgb);
  float aL = texture(u_logo, v_uv + vec2(-texel.x * 3.0, 0)).a;
  float aR = texture(u_logo, v_uv + vec2(texel.x * 3.0, 0)).a;
  float aU = texture(u_logo, v_uv + vec2(0, -texel.y * 3.0)).a;
  float aD = texture(u_logo, v_uv + vec2(0, texel.y * 3.0)).a;

  float nx = (aL - aR) * 3.5 + (lumL - lumR) * u_embossDepth + (v_uv.x - 0.5) * 0.3;
  float ny = (aU - aD) * 3.5 + (lumU - lumD) * u_embossDepth + (v_uv.y - 0.5) * 0.3;
  vec3 normal = normalize(vec3(nx, ny, 1.0));

  // Lighting
  vec2 lightPos = u_cursor / u_resolution;
  vec3 lightDir = normalize(vec3((lightPos - 0.5) * 2.0, 0.5));
  vec3 viewDir = vec3(0.0, 0.0, 1.0);

  // Anisotropic environment
  vec3 reflectDir = reflect(-viewDir, normal);
  vec3 envColor = steelEnv(reflectDir + lightDir * 0.4, u_steelTint, u_brushAngle);

  // Anisotropic specular
  vec3 halfDir = normalize(lightDir + viewDir);
  float c = cos(u_brushAngle), s = sin(u_brushAngle);
  vec3 tangent = normalize(vec3(c, s, 0.0));
  float dotTH = dot(tangent, halfDir);
  float anisoSpec = pow(sqrt(max(1.0 - dotTH * dotTH, 0.0)), 8.0 / u_highlightWidth);

  // Brush texture
  float brush = brushNoise(v_uv * u_resolution, u_brushAngle);

  // Diffuse
  float diff = max(dot(normal, lightDir), 0.0) * 0.4 + 0.6;

  // Fresnel
  float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.5);

  // Compose
  vec3 color = envColor * 0.6;
  color += u_steelTint * diff * 0.4;
  color += vec3(0.95) * anisoSpec * 0.6;
  color += u_steelTint * fresnel * 0.3;
  color += vec3(brush * u_noiseIntensity * 0.04);
  color += u_steelTint * 0.05;

  fragColor = vec4(color, logo.a);
}
`;

registerEffect({
  id: 'brushed-steel',
  name: 'Brushed Steel',
  fragmentShader,
  uniforms: ['u_logo', 'u_resolution', 'u_time', 'u_cursor', 'u_steelTint', 'u_brushAngle', 'u_highlightWidth', 'u_noiseIntensity', 'u_embossDepth'],
  schema: {
    steelTint: { type: 'color', label: 'Steel Tint', default: '#b0b8c0', group: 'Material' },
    brushAngle: { type: 'range', label: 'Brush Angle', min: 0, max: 3.14, step: 0.01, default: 0, group: 'Material' },
    highlightWidth: { type: 'range', label: 'Highlight Width', min: 0.2, max: 3.0, step: 0.1, default: 1.0, group: 'Lighting' },
    noiseIntensity: { type: 'range', label: 'Brush Noise', min: 0, max: 1.0, step: 0.05, default: 0.5, group: 'Material' },
    embossDepth: { type: 'range', label: 'Emboss Depth', min: 0.5, max: 5.0, step: 0.1, default: 2.5, group: 'Material' },
  },
  setUniforms(gl, loc, props, hexToVec3) {
    gl.uniform3fv(loc.u_steelTint, hexToVec3(props.steelTint));
    gl.uniform1f(loc.u_brushAngle, props.brushAngle);
    gl.uniform1f(loc.u_highlightWidth, props.highlightWidth);
    gl.uniform1f(loc.u_noiseIntensity, props.noiseIntensity);
    gl.uniform1f(loc.u_embossDepth, props.embossDepth);
  },
});
