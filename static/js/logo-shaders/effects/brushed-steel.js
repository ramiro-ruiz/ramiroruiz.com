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

float brushNoise(vec2 p, float angle) {
  float c = cos(angle), s = sin(angle);
  vec2 rotated = vec2(c * p.x - s * p.y, s * p.x + c * p.y);
  // Stretched noise along brush direction
  return hash(vec2(floor(rotated.x * 200.0), floor(rotated.y * 2.0)));
}

void main() {
  vec2 texel = 1.0 / u_resolution;
  vec4 logo = texture(u_logo, v_uv);
  // Alpha clip
  if (logo.a < 0.01) { fragColor = vec4(0.0); return; }

  // Emboss normal
  float lumL = luminance(texture(u_logo, v_uv + vec2(-texel.x, 0)).rgb);
  float lumR = luminance(texture(u_logo, v_uv + vec2(texel.x, 0)).rgb);
  float lumU = luminance(texture(u_logo, v_uv + vec2(0, -texel.y)).rgb);
  float lumD = luminance(texture(u_logo, v_uv + vec2(0, texel.y)).rgb);
  float aL = texture(u_logo, v_uv + vec2(-texel.x * 2.0, 0)).a;
  float aR = texture(u_logo, v_uv + vec2(texel.x * 2.0, 0)).a;
  float aU = texture(u_logo, v_uv + vec2(0, -texel.y * 2.0)).a;
  float aD = texture(u_logo, v_uv + vec2(0, texel.y * 2.0)).a;
  vec3 normal = normalize(vec3((lumL - lumR) * u_embossDepth + (aL - aR) * 2.0, (lumU - lumD) * u_embossDepth + (aU - aD) * 2.0, 1.0));

  // Light from cursor
  vec2 lightPos = u_cursor / u_resolution;
  vec3 lightDir = normalize(vec3(lightPos - 0.5, 0.6));
  vec3 viewDir = vec3(0.0, 0.0, 1.0);
  vec3 halfDir = normalize(lightDir + viewDir);

  // Anisotropic specular (stretched along brush direction)
  float angle = u_brushAngle;
  float c = cos(angle), s = sin(angle);
  vec3 tangent = normalize(vec3(c, s, 0.0));
  float dotTH = dot(tangent, halfDir);
  float anisoSpec = pow(sqrt(max(1.0 - dotTH * dotTH, 0.0)), 10.0 / u_highlightWidth);

  // Brush texture
  float brush = brushNoise(v_uv * u_resolution, angle) * u_noiseIntensity;

  // Diffuse
  float diff = max(dot(normal, lightDir), 0.0) * 0.5 + 0.5;

  // Combine
  vec3 color = u_steelTint * diff;
  color += vec3(0.9) * anisoSpec * 0.5;
  color += vec3(brush * 0.05);

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
    embossDepth: { type: 'range', label: 'Emboss Depth', min: 0.5, max: 5.0, step: 0.1, default: 2.0, group: 'Material' },
  },
  setUniforms(gl, loc, props, hexToVec3) {
    gl.uniform3fv(loc.u_steelTint, hexToVec3(props.steelTint));
    gl.uniform1f(loc.u_brushAngle, props.brushAngle);
    gl.uniform1f(loc.u_highlightWidth, props.highlightWidth);
    gl.uniform1f(loc.u_noiseIntensity, props.noiseIntensity);
    gl.uniform1f(loc.u_embossDepth, props.embossDepth);
  },
});
