import { registerEffect } from './registry.js';

const fragmentShader = `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform sampler2D u_logo;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_cursor;
uniform float u_iridescence;
uniform float u_shiftSpeed;
uniform float u_thickness;
uniform float u_angleSensitivity;

float luminance(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

float thinFilm(float cosAngle, float thickness, float wavelength) {
  float phase = 2.0 * 3.14159 * 2.0 * thickness * cosAngle / wavelength;
  return 0.5 + 0.5 * cos(phase);
}

void main() {
  vec2 texel = 1.0 / u_resolution;
  vec4 logo = texture(u_logo, v_uv);
  if (logo.a < 0.01) { fragColor = vec4(0.0); return; }

  // Dome + edge normals for angled reflections
  float aL = texture(u_logo, v_uv + vec2(-texel.x * 3.0, 0)).a;
  float aR = texture(u_logo, v_uv + vec2(texel.x * 3.0, 0)).a;
  float aU = texture(u_logo, v_uv + vec2(0, -texel.y * 3.0)).a;
  float aD = texture(u_logo, v_uv + vec2(0, texel.y * 3.0)).a;

  float nx = (aL - aR) * 3.0 + (v_uv.x - 0.5) * 0.4;
  float ny = (aU - aD) * 3.0 + (v_uv.y - 0.5) * 0.4;
  vec3 normal = normalize(vec3(nx, ny, 1.0));
  vec3 viewDir = vec3(0.0, 0.0, 1.0);

  // Viewing angle from cursor + surface normal
  vec2 cursorNorm = u_cursor / u_resolution;
  vec3 lightDir = normalize(vec3((cursorNorm - 0.5) * 2.0, 0.5));
  vec3 reflectDir = reflect(-viewDir, normal);
  float angle = acos(clamp(dot(reflectDir, lightDir), -1.0, 1.0)) * u_angleSensitivity;

  // Spatial rainbow patterns (two layers for complexity)
  float uvPhase = (v_uv.x * 4.0 + v_uv.y * 3.0 + u_time * u_shiftSpeed) * 0.6;
  float thickness = u_thickness + sin(uvPhase) * u_thickness * 0.4;
  float uvPhase2 = (v_uv.x * 2.0 - v_uv.y * 5.0 + u_time * u_shiftSpeed * 0.7) * 0.4;
  thickness += sin(uvPhase2) * u_thickness * 0.2;

  // Thin-film interference per RGB wavelength
  float r = thinFilm(cos(angle), thickness, 680.0);
  float g = thinFilm(cos(angle), thickness, 530.0);
  float b = thinFilm(cos(angle), thickness, 430.0);

  vec3 iridescent = vec3(r, g, b);

  // Boost saturation
  float iridLum = dot(iridescent, vec3(0.333));
  iridescent = clamp(mix(vec3(iridLum), iridescent, 1.8), 0.0, 1.5);

  // Specular highlight
  vec3 halfDir = normalize(lightDir + viewDir);
  float spec = pow(max(dot(normal, halfDir), 0.0), 60.0) * 0.5;

  // Fresnel rim
  float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.5);

  // Compose
  vec3 color = iridescent * u_iridescence * 0.8;
  color += vec3(1.0) * spec;
  color += iridescent * fresnel * 0.3;
  color += vec3(0.05);
  color *= 1.2;

  fragColor = vec4(color, logo.a);
}
`;

registerEffect({
  id: 'holographic',
  name: 'Holographic Foil',
  fragmentShader,
  uniforms: ['u_logo', 'u_resolution', 'u_time', 'u_cursor', 'u_iridescence', 'u_shiftSpeed', 'u_thickness', 'u_angleSensitivity'],
  schema: {
    iridescence: { type: 'range', label: 'Iridescence', min: 0.2, max: 2.5, step: 0.05, default: 1.2, group: 'Effect' },
    shiftSpeed: { type: 'range', label: 'Color Shift Speed', min: 0, max: 2.0, step: 0.05, default: 0.4, group: 'Effect' },
    thickness: { type: 'range', label: 'Film Thickness', min: 200, max: 800, default: 400, group: 'Effect' },
    angleSensitivity: { type: 'range', label: 'Angle Sensitivity', min: 0.5, max: 5.0, step: 0.1, default: 2.5, group: 'Effect' },
  },
  setUniforms(gl, loc, props) {
    gl.uniform1f(loc.u_iridescence, props.iridescence);
    gl.uniform1f(loc.u_shiftSpeed, props.shiftSpeed);
    gl.uniform1f(loc.u_thickness, props.thickness);
    gl.uniform1f(loc.u_angleSensitivity, props.angleSensitivity);
  },
});
