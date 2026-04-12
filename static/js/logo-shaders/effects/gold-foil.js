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
uniform float u_bevelWidth;

float luminance(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
}

// Warm gold environment — rich reflections with golden tones
vec3 goldEnv(vec3 dir, vec3 tint, float brightness) {
  float band1 = pow(max(0.0, sin(dir.x * 3.0 + dir.y * 1.5)), 2.0) * 1.0;
  float band2 = pow(max(0.0, sin(dir.x * 1.5 - dir.y * 3.5 + 1.0)), 3.0) * 0.7;
  float band3 = pow(max(0.0, cos(dir.y * 5.0 + dir.x * 2.0)), 2.0) * 0.4;
  float env = (band1 + band2 + band3) * brightness;

  vec3 highlight = tint * 2.0 + vec3(0.15, 0.1, 0.0); // warm white-gold highlights
  vec3 shadow = tint * vec3(0.4, 0.25, 0.1) * 0.3; // deep warm shadow
  return mix(shadow, highlight, clamp(env, 0.0, 1.0));
}

void main() {
  vec2 texel = 1.0 / u_resolution;
  vec4 logo = texture(u_logo, v_uv);
  if (logo.a < 0.01) { fragColor = vec4(0.0); return; }

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

  // Luminance gradient for internal detail
  float lumL = luminance(texture(u_logo, v_uv + vec2(-texel.x * 2.0, 0)).rgb);
  float lumR = luminance(texture(u_logo, v_uv + vec2( texel.x * 2.0, 0)).rgb);
  float lumU = luminance(texture(u_logo, v_uv + vec2(0, -texel.y * 2.0)).rgb);
  float lumD = luminance(texture(u_logo, v_uv + vec2(0,  texel.y * 2.0)).rgb);

  float nx = bevelX * bevelIntensity + (lumL - lumR) * u_embossDepth;
  float ny = bevelY * bevelIntensity + (lumU - lumD) * u_embossDepth;

  // Edge rim light
  float rimLight = smoothstep(0.2, 0.4, bevelMag) * (1.0 - smoothstep(0.4, 0.7, bevelMag));
  rimLight *= 0.35;

  // Dome curvature
  vec2 fromCenter = (v_uv - 0.5) * 0.35;
  nx += fromCenter.x;
  ny += fromCenter.y;

  // Subtle surface noise for organic variation
  float n1 = noise(v_uv * 25.0 + u_time * 0.03);
  float n2 = noise(v_uv * 25.0 + vec2(5.2, 1.3) + u_time * 0.03);
  nx += (n1 - 0.5) * 0.15;
  ny += (n2 - 0.5) * 0.15;

  vec3 normal = normalize(vec3(nx, ny, 1.0));

  // === LIGHTING ===
  vec2 lightPos = u_cursor / u_resolution;
  vec3 lightDir = normalize(vec3((lightPos - 0.5) * 2.0, 0.5));
  vec3 viewDir = vec3(0.0, 0.0, 1.0);

  // Environment reflection
  vec3 reflectDir = reflect(-viewDir, normal);
  vec3 envColor = goldEnv(reflectDir + lightDir * 0.5, u_goldTint, u_lightIntensity);

  // Diffuse
  float diff = max(dot(normal, lightDir), 0.0) * 0.5 + 0.5;

  // Specular — tight bright highlight
  vec3 halfDir = normalize(lightDir + viewDir);
  float spec = pow(max(dot(normal, halfDir), 0.0), 30.0 + (1.0 - u_roughness) * 120.0);

  // Gold Fresnel — gold reflects its own tint at grazing angles
  float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.5);

  // === COMPOSE ===
  vec3 color = envColor * 0.7;
  color += u_goldTint * diff * 0.4;
  color += mix(u_goldTint * 1.5, vec3(1.0), 0.3) * spec * 0.9;
  color += u_goldTint * fresnel * 0.5;
  color += vec3(1.0) * rimLight;
  color += u_goldTint * 0.05;

  fragColor = vec4(color, logo.a);
}
`;

registerEffect({
  id: 'gold-foil',
  name: 'Gold Foil',
  fragmentShader,
  uniforms: ['u_logo', 'u_resolution', 'u_time', 'u_cursor', 'u_goldTint', 'u_embossDepth', 'u_lightIntensity', 'u_roughness', 'u_bevelWidth'],
  schema: {
    goldTint: { type: 'color', label: 'Gold Tint', default: '#d4a843', group: 'Material' },
    embossDepth: { type: 'range', label: 'Emboss Depth', min: 1, max: 8, step: 0.1, default: 3.0, group: 'Material' },
    bevelWidth: { type: 'range', label: 'Bevel Width', min: 1, max: 6, step: 0.1, default: 2.5, group: 'Material' },
    lightIntensity: { type: 'range', label: 'Light Intensity', min: 0.5, max: 3.0, step: 0.1, default: 1.8, group: 'Lighting' },
    roughness: { type: 'range', label: 'Roughness', min: 0, max: 1, step: 0.01, default: 0.2, group: 'Material' },
  },
  setUniforms(gl, loc, props, hexToVec3) {
    gl.uniform3fv(loc.u_goldTint, hexToVec3(props.goldTint));
    gl.uniform1f(loc.u_embossDepth, props.embossDepth);
    gl.uniform1f(loc.u_lightIntensity, props.lightIntensity);
    gl.uniform1f(loc.u_roughness, props.roughness);
    gl.uniform1f(loc.u_bevelWidth, props.bevelWidth);
  },
});
