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

// Thin-film interference for a given wavelength
float thinFilm(float cosAngle, float thickness, float wavelength) {
  float phase = 2.0 * 3.14159 * 2.0 * thickness * cosAngle / wavelength;
  return 0.5 + 0.5 * cos(phase);
}

void main() {
  vec4 logo = texture(u_logo, v_uv);
  float logoLum = luminance(logo.rgb);

  // Viewing angle derived from cursor position + UV
  vec2 cursorNorm = u_cursor / u_resolution;
  float angle = length(v_uv - cursorNorm) * u_angleSensitivity;
  float cosAngle = cos(angle);

  // UV-based variation for spatial shimmer
  float uvPhase = (v_uv.x * 3.0 + v_uv.y * 2.0 + u_time * u_shiftSpeed) * 0.5;
  float thickness = u_thickness + sin(uvPhase) * u_thickness * 0.3;

  // Thin-film interference per RGB wavelength
  float r = thinFilm(cosAngle, thickness, 680.0); // red
  float g = thinFilm(cosAngle, thickness, 550.0); // green
  float b = thinFilm(cosAngle, thickness, 440.0); // blue

  vec3 iridescent = vec3(r, g, b);

  // Apply to logo — luminance-gated (dark stays dark)
  vec3 color = logo.rgb * mix(vec3(1.0), iridescent, u_iridescence * logoLum);

  // Boost brightness for the holographic pop
  color *= 1.0 + logoLum * u_iridescence * 0.3;

  fragColor = vec4(color, logo.a);
}
`;

registerEffect({
  id: 'holographic',
  name: 'Holographic Foil',
  fragmentShader,
  uniforms: ['u_logo', 'u_resolution', 'u_time', 'u_cursor', 'u_iridescence', 'u_shiftSpeed', 'u_thickness', 'u_angleSensitivity'],
  schema: {
    iridescence: { type: 'range', label: 'Iridescence', min: 0.2, max: 2.0, step: 0.05, default: 1.0, group: 'Effect' },
    shiftSpeed: { type: 'range', label: 'Color Shift Speed', min: 0, max: 2.0, step: 0.05, default: 0.5, group: 'Effect' },
    thickness: { type: 'range', label: 'Film Thickness', min: 200, max: 800, default: 400, group: 'Effect' },
    angleSensitivity: { type: 'range', label: 'Angle Sensitivity', min: 0.5, max: 5.0, step: 0.1, default: 2.0, group: 'Effect' },
  },
  setUniforms(gl, loc, props) {
    gl.uniform1f(loc.u_iridescence, props.iridescence);
    gl.uniform1f(loc.u_shiftSpeed, props.shiftSpeed);
    gl.uniform1f(loc.u_thickness, props.thickness);
    gl.uniform1f(loc.u_angleSensitivity, props.angleSensitivity);
  },
});
