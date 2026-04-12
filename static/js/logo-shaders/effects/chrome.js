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

// Rich procedural environment — studio lighting with multiple bands
vec3 envMap(vec3 dir, vec3 metalCol) {
  float d1 = smoothstep(0.3, 0.7, sin(dir.x * 4.0 + dir.y * 2.0)) * 0.9;
  float d2 = smoothstep(0.2, 0.6, sin(dir.x * 2.0 - dir.y * 5.0 + 1.5)) * 0.7;
  float d3 = smoothstep(0.4, 0.6, cos(dir.y * 7.0 + dir.x * 3.0 + 0.8)) * 0.5;
  float d4 = smoothstep(0.3, 0.5, sin(dir.x * 8.0 + dir.y * 1.0 + 2.0)) * 0.3;
  float env = (d1 + d2 + d3 + d4) * 0.4;

  // Colored reflections — warm highlights, cool shadows
  vec3 warm = metalCol * 1.3;
  vec3 cool = metalCol * vec3(0.7, 0.8, 1.0) * 0.5;
  return mix(cool, warm, env);
}

void main() {
  vec2 texel = 1.0 / u_resolution;
  vec4 logo = texture(u_logo, v_uv);

  // Alpha clip — transparent areas stay transparent
  if (logo.a < 0.01) { fragColor = vec4(0.0); return; }

  // Normal from luminance gradient (emboss the logo shape)
  float lumC = luminance(logo.rgb);
  float lumL = luminance(texture(u_logo, v_uv + vec2(-texel.x * 2.0, 0)).rgb);
  float lumR = luminance(texture(u_logo, v_uv + vec2(texel.x * 2.0, 0)).rgb);
  float lumU = luminance(texture(u_logo, v_uv + vec2(0, -texel.y * 2.0)).rgb);
  float lumD = luminance(texture(u_logo, v_uv + vec2(0, texel.y * 2.0)).rgb);

  // Also factor in alpha edges for sharper silhouette normals
  float aL = texture(u_logo, v_uv + vec2(-texel.x * 2.0, 0)).a;
  float aR = texture(u_logo, v_uv + vec2(texel.x * 2.0, 0)).a;
  float aU = texture(u_logo, v_uv + vec2(0, -texel.y * 2.0)).a;
  float aD = texture(u_logo, v_uv + vec2(0, texel.y * 2.0)).a;

  float nx = (lumL - lumR) * 3.0 + (aL - aR) * 2.0;
  float ny = (lumU - lumD) * 3.0 + (aU - aD) * 2.0;
  vec3 normal = normalize(vec3(nx, ny, 1.0));

  // Light from cursor
  vec2 lightPos = u_cursor / u_resolution;
  vec3 lightDir = normalize(vec3((lightPos - 0.5) * 1.5, 0.6));
  vec3 viewDir = vec3(0.0, 0.0, 1.0);

  // Reflection vector
  vec3 reflectDir = reflect(-viewDir, normal);
  vec3 envColor = envMap(reflectDir + lightDir * 0.4, u_metalColor) * u_envBrightness;

  // Fresnel — edges reflect more (like real metal)
  float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.0 + u_roughness * 3.0);

  // Specular highlight
  vec3 halfDir = normalize(lightDir + viewDir);
  float spec = pow(max(dot(normal, halfDir), 0.0), 30.0 + (1.0 - u_roughness) * 120.0);

  // Compose: env reflection + specular + fresnel rim
  vec3 color = envColor * u_reflectionIntensity * (0.6 + fresnel * 0.4);
  color += vec3(1.0) * spec * (1.0 - u_roughness * 0.7) * 0.8;
  color += u_metalColor * fresnel * 0.3;

  // Ambient base so no part of the logo is pure black
  color += u_metalColor * 0.08;

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
    envBrightness: { type: 'range', label: 'Environment', min: 0.2, max: 3, step: 0.1, default: 1.5, group: 'Lighting' },
  },
  setUniforms(gl, loc, props, hexToVec3) {
    gl.uniform3fv(loc.u_metalColor, hexToVec3(props.metalColor));
    gl.uniform1f(loc.u_roughness, props.roughness);
    gl.uniform1f(loc.u_reflectionIntensity, props.reflectionIntensity);
    gl.uniform1f(loc.u_envBrightness, props.envBrightness);
  },
});
