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

// Procedural environment map — studio lighting bands
float envMap(vec3 dir) {
  float bands = 0.0;
  bands += smoothstep(0.4, 0.5, sin(dir.x * 6.0 + dir.y * 2.0)) * 0.8;
  bands += smoothstep(0.3, 0.5, sin(dir.x * 3.0 - dir.y * 4.0 + 1.5)) * 0.5;
  bands += smoothstep(0.2, 0.4, cos(dir.y * 8.0 + dir.x * 1.0)) * 0.3;
  return bands * u_envBrightness + 0.15;
}

void main() {
  vec2 texel = 1.0 / u_resolution;
  vec4 logo = texture(u_logo, v_uv);
  float logoLum = luminance(logo.rgb);

  // Derive normal from logo luminance gradient (emboss)
  float lumL = luminance(texture(u_logo, v_uv + vec2(-texel.x, 0)).rgb);
  float lumR = luminance(texture(u_logo, v_uv + vec2(texel.x, 0)).rgb);
  float lumU = luminance(texture(u_logo, v_uv + vec2(0, -texel.y)).rgb);
  float lumD = luminance(texture(u_logo, v_uv + vec2(0, texel.y)).rgb);

  float depth = 3.0;
  vec3 normal = normalize(vec3((lumL - lumR) * depth, (lumU - lumD) * depth, 1.0));

  // Light direction from cursor
  vec2 lightPos = u_cursor / u_resolution;
  vec3 lightDir = normalize(vec3(lightPos - 0.5, 0.6));
  vec3 viewDir = vec3(0.0, 0.0, 1.0);

  // Reflection
  vec3 reflectDir = reflect(-viewDir, normal);
  float env = envMap(reflectDir + lightDir * 0.3);

  // Fresnel
  float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.0 + u_roughness * 3.0);

  // Specular (Blinn-Phong)
  vec3 halfDir = normalize(lightDir + viewDir);
  float spec = pow(max(dot(normal, halfDir), 0.0), 20.0 + (1.0 - u_roughness) * 80.0);

  // Combine
  vec3 color = u_metalColor * env * u_reflectionIntensity;
  color += vec3(1.0) * spec * (1.0 - u_roughness) * 0.6;
  color *= (0.7 + fresnel * 0.5);
  color *= logoLum; // logo shape masks the metal

  // Add slight ambient for logo shape visibility
  color += u_metalColor * logoLum * 0.1;

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
    roughness: { type: 'range', label: 'Roughness', min: 0, max: 1, step: 0.01, default: 0.2, group: 'Material' },
    reflectionIntensity: { type: 'range', label: 'Reflection', min: 0.2, max: 2, step: 0.1, default: 1.0, group: 'Lighting' },
    envBrightness: { type: 'range', label: 'Environment', min: 0.2, max: 2, step: 0.1, default: 1.0, group: 'Lighting' },
  },
  setUniforms(gl, loc, props, hexToVec3) {
    gl.uniform3fv(loc.u_metalColor, hexToVec3(props.metalColor));
    gl.uniform1f(loc.u_roughness, props.roughness);
    gl.uniform1f(loc.u_reflectionIntensity, props.reflectionIntensity);
    gl.uniform1f(loc.u_envBrightness, props.envBrightness);
  },
});
