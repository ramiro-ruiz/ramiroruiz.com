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

void main() {
  vec2 texel = 1.0 / u_resolution;
  vec4 logo = texture(u_logo, v_uv);
  float logoLum = luminance(logo.rgb);

  // Normal from gradient
  float lumL = luminance(texture(u_logo, v_uv + vec2(-texel.x, 0)).rgb);
  float lumR = luminance(texture(u_logo, v_uv + vec2(texel.x, 0)).rgb);
  float lumU = luminance(texture(u_logo, v_uv + vec2(0, -texel.y)).rgb);
  float lumD = luminance(texture(u_logo, v_uv + vec2(0, texel.y)).rgb);
  vec3 normal = normalize(vec3((lumL - lumR) * 2.0, (lumU - lumD) * 2.0, 1.0));

  // Lighting
  vec2 lightPos = u_cursor / u_resolution;
  vec3 lightDir = normalize(vec3(lightPos - 0.5, 0.7));
  vec3 viewDir = vec3(0.0, 0.0, 1.0);

  // Diffuse
  float diff = max(dot(normal, lightDir), 0.0) * 0.6 + 0.4;

  // Specular (Blinn-Phong)
  vec3 halfDir = normalize(lightDir + viewDir);
  float spec = pow(max(dot(normal, halfDir), 0.0), u_shininess) * u_specSize;

  // Fresnel
  float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0) * u_fresnelStrength;

  // Combine
  vec3 color = u_baseColor * diff * logoLum;
  color += u_specColor * spec * logoLum;
  color += u_baseColor * fresnel * 0.3;

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
    shininess: { type: 'range', label: 'Shininess', min: 10, max: 200, default: 80, group: 'Lighting' },
    specSize: { type: 'range', label: 'Specular Size', min: 0.1, max: 3.0, step: 0.1, default: 1.0, group: 'Lighting' },
    fresnelStrength: { type: 'range', label: 'Fresnel', min: 0, max: 2.0, step: 0.1, default: 0.8, group: 'Lighting' },
  },
  setUniforms(gl, loc, props, hexToVec3) {
    gl.uniform3fv(loc.u_baseColor, hexToVec3(props.baseColor));
    gl.uniform3fv(loc.u_specColor, hexToVec3(props.specColor));
    gl.uniform1f(loc.u_shininess, props.shininess);
    gl.uniform1f(loc.u_specSize, props.specSize);
    gl.uniform1f(loc.u_fresnelStrength, props.fresnelStrength);
  },
});
