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
uniform float u_roughness;
uniform float u_reflectionIntensity;
uniform float u_envBrightness;

float luminance(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

// Rich studio environment — high contrast bands like a real HDRI
vec3 studioEnv(vec3 dir, vec3 metalCol, float brightness) {
  // Multiple light bands at different angles
  float band1 = pow(max(0.0, sin(dir.x * 3.5 + dir.y * 1.5)), 3.0) * 1.2;
  float band2 = pow(max(0.0, sin(dir.x * 1.5 - dir.y * 4.0 + 1.2)), 4.0) * 0.8;
  float band3 = pow(max(0.0, cos(dir.y * 6.0 + dir.x * 2.0 + 0.5)), 2.0) * 0.4;
  float band4 = pow(max(0.0, sin(dir.x * 8.0 - dir.y * 2.0 + 2.5)), 5.0) * 0.6;

  float env = (band1 + band2 + band3 + band4) * brightness;

  // Warm highlights, cool fill
  vec3 highlight = metalCol * 1.6 + vec3(0.1);
  vec3 fill = metalCol * vec3(0.5, 0.55, 0.65) * 0.3;
  return mix(fill, highlight, clamp(env, 0.0, 1.0));
}

void main() {
  vec2 texel = 1.0 / u_resolution;
  vec4 logo = texture(u_logo, v_uv);

  if (logo.a < 0.01) { fragColor = vec4(0.0); return; }

  // === BEVEL NORMALS FROM ALPHA EDGES ===
  // Sample alpha at multiple radii for edge detection
  float a = logo.a;
  float aL = texture(u_logo, v_uv + vec2(-texel.x * 3.0, 0)).a;
  float aR = texture(u_logo, v_uv + vec2(texel.x * 3.0, 0)).a;
  float aU = texture(u_logo, v_uv + vec2(0, -texel.y * 3.0)).a;
  float aD = texture(u_logo, v_uv + vec2(0, texel.y * 3.0)).a;

  // Alpha gradient = edge direction and intensity
  float edgeX = aL - aR;
  float edgeY = aU - aD;

  // Also get luminance gradient for logos with internal detail
  float lumL = luminance(texture(u_logo, v_uv + vec2(-texel.x * 2.0, 0)).rgb);
  float lumR = luminance(texture(u_logo, v_uv + vec2(texel.x * 2.0, 0)).rgb);
  float lumU = luminance(texture(u_logo, v_uv + vec2(0, -texel.y * 2.0)).rgb);
  float lumD = luminance(texture(u_logo, v_uv + vec2(0, texel.y * 2.0)).rgb);

  // Combine: alpha edges (bevel at silhouette) + luminance edges (internal detail)
  float nx = edgeX * 4.0 + (lumL - lumR) * 2.0;
  float ny = edgeY * 4.0 + (lumU - lumD) * 2.0;

  // === DOME CURVATURE ===
  // Add subtle dome so flat interiors still catch varying reflections
  vec2 center = vec2(0.5);
  vec2 fromCenter = (v_uv - center) * 0.4;
  nx += fromCenter.x;
  ny += fromCenter.y;

  vec3 normal = normalize(vec3(nx, ny, 1.0));

  // === LIGHTING ===
  vec2 lightPos = u_cursor / u_resolution;
  vec3 lightDir = normalize(vec3((lightPos - 0.5) * 2.0, 0.5));
  vec3 viewDir = vec3(0.0, 0.0, 1.0);

  // Environment reflection
  vec3 reflectDir = reflect(-viewDir, normal);
  vec3 envColor = studioEnv(reflectDir + lightDir * 0.5, u_metalColor, u_envBrightness);

  // Fresnel — strong edge reflection
  float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.5);

  // Specular
  vec3 halfDir = normalize(lightDir + viewDir);
  float spec = pow(max(dot(normal, halfDir), 0.0), 40.0 + (1.0 - u_roughness) * 150.0);

  // === COMPOSE ===
  vec3 color = envColor * u_reflectionIntensity;
  color += vec3(1.0) * spec * (1.0 - u_roughness * 0.6) * 0.9;
  color += u_metalColor * fresnel * 0.4;
  color += u_metalColor * 0.05; // ambient floor

  fragColor = vec4(color, logo.a);
}
`;

registerEffect({
  id: 'chrome',
  name: 'Chrome / Metallic',
  fragmentShader,
  uniforms: ['u_logo', 'u_resolution', 'u_time', 'u_cursor', 'u_metalColor', 'u_roughness', 'u_reflectionIntensity', 'u_envBrightness'],
  schema: {
    metalColor: { type: 'color', label: 'Metal Color', default: '#c0c0c0', group: 'Material' },
    roughness: { type: 'range', label: 'Roughness', min: 0, max: 1, step: 0.01, default: 0.15, group: 'Material' },
    reflectionIntensity: { type: 'range', label: 'Reflection', min: 0.2, max: 3, step: 0.1, default: 1.5, group: 'Lighting' },
    envBrightness: { type: 'range', label: 'Environment', min: 0.2, max: 3, step: 0.1, default: 1.8, group: 'Lighting' },
  },
  setUniforms(gl, loc, props, hexToVec3) {
    gl.uniform3fv(loc.u_metalColor, hexToVec3(props.metalColor));
    gl.uniform1f(loc.u_roughness, props.roughness);
    gl.uniform1f(loc.u_reflectionIntensity, props.reflectionIntensity);
    gl.uniform1f(loc.u_envBrightness, props.envBrightness);
  },
});
