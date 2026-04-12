import { registerEffect } from './registry.js';

const fragmentShader = `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform sampler2D u_logo;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_cursor;
uniform vec3 u_baseColor;
uniform vec3 u_specColor;
uniform float u_shininess;
uniform float u_specSize;
uniform float u_fresnelStrength;

float luminance(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

// Glossy environment — soft gradients with bright hotspot
vec3 glossyEnv(vec3 dir, vec3 baseCol) {
  float top = smoothstep(-0.2, 0.8, dir.y) * 0.4;
  float hotspot = pow(max(0.0, sin(dir.x * 2.5 + dir.y * 1.0)), 6.0) * 0.6;
  float fill = 0.15;
  float env = top + hotspot + fill;
  return mix(baseCol * 0.2, baseCol * 1.3 + vec3(0.1), env);
}

void main() {
  vec2 texel = 1.0 / u_resolution;
  vec4 logo = texture(u_logo, v_uv);
  if (logo.a < 0.01) { fragColor = vec4(0.0); return; }

  // Bevel normals + dome
  float lumL = luminance(texture(u_logo, v_uv + vec2(-texel.x * 2.0, 0)).rgb);
  float lumR = luminance(texture(u_logo, v_uv + vec2(texel.x * 2.0, 0)).rgb);
  float lumU = luminance(texture(u_logo, v_uv + vec2(0, -texel.y * 2.0)).rgb);
  float lumD = luminance(texture(u_logo, v_uv + vec2(0, texel.y * 2.0)).rgb);
  float aL = texture(u_logo, v_uv + vec2(-texel.x * 3.0, 0)).a;
  float aR = texture(u_logo, v_uv + vec2(texel.x * 3.0, 0)).a;
  float aU = texture(u_logo, v_uv + vec2(0, -texel.y * 3.0)).a;
  float aD = texture(u_logo, v_uv + vec2(0, texel.y * 3.0)).a;

  float nx = (aL - aR) * 3.5 + (lumL - lumR) * 2.0;
  float ny = (aU - aD) * 3.5 + (lumU - lumD) * 2.0;

  // Dome curvature
  vec2 fromCenter = (v_uv - 0.5) * 0.3;
  nx += fromCenter.x;
  ny += fromCenter.y;

  vec3 normal = normalize(vec3(nx, ny, 1.0));

  // Lighting
  vec2 lightPos = u_cursor / u_resolution;
  vec3 lightDir = normalize(vec3((lightPos - 0.5) * 1.5, 0.6));
  vec3 viewDir = vec3(0.0, 0.0, 1.0);

  // Environment reflection (glossy = softer than chrome)
  vec3 reflectDir = reflect(-viewDir, normal);
  vec3 envColor = glossyEnv(reflectDir + lightDir * 0.4, u_baseColor);

  // Diffuse — rich base color
  float diff = max(dot(normal, lightDir), 0.0) * 0.5 + 0.5;

  // Specular — tight white highlight
  vec3 halfDir = normalize(lightDir + viewDir);
  float spec = pow(max(dot(normal, halfDir), 0.0), u_shininess) * u_specSize;

  // Fresnel — edge brightening
  float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.5) * u_fresnelStrength;

  // Compose — deep saturated base with bright specular
  vec3 color = envColor * 0.5;
  color += u_baseColor * diff * 0.6;
  color += u_specColor * spec * 0.9;
  color += mix(u_baseColor, u_specColor, 0.5) * fresnel * 0.3;
  color += u_baseColor * 0.08;

  fragColor = vec4(color, logo.a);
}
`;

registerEffect({
  id: 'glossy',
  name: 'Glossy Plastic',
  fragmentShader,
  uniforms: ['u_logo', 'u_resolution', 'u_time', 'u_cursor', 'u_baseColor', 'u_specColor', 'u_shininess', 'u_specSize', 'u_fresnelStrength'],
  schema: {
    baseColor: { type: 'color', label: 'Base Color', default: '#2563eb', group: 'Material' },
    specColor: { type: 'color', label: 'Specular Color', default: '#ffffff', group: 'Material' },
    shininess: { type: 'range', label: 'Shininess', min: 10, max: 300, default: 120, group: 'Lighting' },
    specSize: { type: 'range', label: 'Specular Size', min: 0.1, max: 3.0, step: 0.1, default: 1.2, group: 'Lighting' },
    fresnelStrength: { type: 'range', label: 'Fresnel', min: 0, max: 2.0, step: 0.1, default: 1.0, group: 'Lighting' },
  },
  setUniforms(gl, loc, props, hexToVec3) {
    gl.uniform3fv(loc.u_baseColor, hexToVec3(props.baseColor));
    gl.uniform3fv(loc.u_specColor, hexToVec3(props.specColor));
    gl.uniform1f(loc.u_shininess, props.shininess);
    gl.uniform1f(loc.u_specSize, props.specSize);
    gl.uniform1f(loc.u_fresnelStrength, props.fresnelStrength);
  },
});
