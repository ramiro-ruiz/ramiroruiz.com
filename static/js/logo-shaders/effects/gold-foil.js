import { registerEffect } from './registry.js';

const fragmentShader = `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform sampler2D u_logo;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_cursor;
uniform vec3 u_goldTint;
uniform float u_embossDepth;
uniform float u_lightIntensity;
uniform float u_roughness;

float luminance(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

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

void main() {
  vec2 texel = 1.0 / u_resolution;
  vec4 logo = texture(u_logo, v_uv);
  float logoLum = luminance(logo.rgb);

  // Emboss normal from logo gradient
  float lumL = luminance(texture(u_logo, v_uv + vec2(-texel.x, 0)).rgb);
  float lumR = luminance(texture(u_logo, v_uv + vec2(texel.x, 0)).rgb);
  float lumU = luminance(texture(u_logo, v_uv + vec2(0, -texel.y)).rgb);
  float lumD = luminance(texture(u_logo, v_uv + vec2(0, texel.y)).rgb);
  vec3 normal = normalize(vec3((lumL - lumR) * u_embossDepth, (lumU - lumD) * u_embossDepth, 1.0));

  // Surface variation from low-frequency noise
  float surfaceNoise = noise(v_uv * 20.0 + u_time * 0.05) * 0.1;
  normal = normalize(normal + vec3(surfaceNoise, surfaceNoise, 0.0));

  // Light from cursor
  vec2 lightPos = u_cursor / u_resolution;
  vec3 lightDir = normalize(vec3(lightPos - 0.5, 0.5));
  vec3 viewDir = vec3(0.0, 0.0, 1.0);

  // Gold BRDF: warm diffuse + tinted specular
  float diff = max(dot(normal, lightDir), 0.0);
  vec3 halfDir = normalize(lightDir + viewDir);
  float spec = pow(max(dot(normal, halfDir), 0.0), 15.0 + (1.0 - u_roughness) * 60.0);

  // Fresnel — gold has colored Fresnel reflections
  float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.5);

  // Combine
  vec3 diffColor = u_goldTint * (diff * 0.6 + 0.4) * u_lightIntensity;
  vec3 specColor = mix(u_goldTint, vec3(1.0), 0.3) * spec * 0.8;
  vec3 fresnelColor = u_goldTint * fresnel * 0.3;

  vec3 color = (diffColor + specColor + fresnelColor) * logoLum;

  fragColor = vec4(color, logo.a);
}
`;

registerEffect({
  id: 'gold-foil',
  name: 'Gold Foil',
  fragmentShader,
  uniforms: ['u_logo', 'u_resolution', 'u_time', 'u_cursor', 'u_goldTint', 'u_embossDepth', 'u_lightIntensity', 'u_roughness'],
  schema: {
    goldTint: { type: 'color', label: 'Gold Tint', default: '#d4a843', group: 'Material' },
    embossDepth: { type: 'range', label: 'Emboss Depth', min: 1, max: 8, step: 0.1, default: 3.0, group: 'Material' },
    lightIntensity: { type: 'range', label: 'Light Intensity', min: 0.5, max: 2.0, step: 0.1, default: 1.2, group: 'Lighting' },
    roughness: { type: 'range', label: 'Roughness', min: 0, max: 1, step: 0.01, default: 0.3, group: 'Material' },
  },
  setUniforms(gl, loc, props, hexToVec3) {
    gl.uniform3fv(loc.u_goldTint, hexToVec3(props.goldTint));
    gl.uniform1f(loc.u_embossDepth, props.embossDepth);
    gl.uniform1f(loc.u_lightIntensity, props.lightIntensity);
    gl.uniform1f(loc.u_roughness, props.roughness);
  },
});
