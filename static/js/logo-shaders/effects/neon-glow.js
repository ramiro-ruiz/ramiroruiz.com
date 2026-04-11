import { registerEffect } from './registry.js';

const fragmentShader = `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform sampler2D u_logo;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_cursor;
uniform vec3 u_glowColor;
uniform float u_glowRadius;
uniform float u_intensity;
uniform float u_pulseSpeed;
uniform float u_bgDarkness;

float luminance(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

float sobelEdge(vec2 uv, vec2 t) {
  float tl = luminance(texture(u_logo, uv + vec2(-t.x,-t.y)).rgb);
  float tc = luminance(texture(u_logo, uv + vec2(0,-t.y)).rgb);
  float tr = luminance(texture(u_logo, uv + vec2(t.x,-t.y)).rgb);
  float ml = luminance(texture(u_logo, uv + vec2(-t.x,0)).rgb);
  float mr = luminance(texture(u_logo, uv + vec2(t.x,0)).rgb);
  float bl = luminance(texture(u_logo, uv + vec2(-t.x,t.y)).rgb);
  float bc = luminance(texture(u_logo, uv + vec2(0,t.y)).rgb);
  float br = luminance(texture(u_logo, uv + vec2(t.x,t.y)).rgb);
  float gx = -tl - 2.0*ml - bl + tr + 2.0*mr + br;
  float gy = -tl - 2.0*tc - tr + bl + 2.0*bc + br;
  return sqrt(gx*gx + gy*gy);
}

void main() {
  vec2 texel = 1.0 / u_resolution;
  vec2 px = v_uv * u_resolution;
  vec4 logo = texture(u_logo, v_uv);

  // Multi-ring edge glow
  float glow = 0.0;
  glow += sobelEdge(v_uv, texel) * 2.0;
  for (int ring = 1; ring <= 5; ring++) {
    float dist = float(ring) * u_glowRadius * 0.2;
    float weight = exp(-float(ring) * 0.5);
    for (int i = 0; i < 8; i++) {
      float angle = float(i) * 0.7854 + float(ring) * 0.4;
      vec2 offset = vec2(cos(angle), sin(angle)) * dist * texel;
      glow += sobelEdge(v_uv + offset, texel) * weight;
    }
  }
  glow /= 42.0;

  // Cursor proximity boost
  float cursorDist = length(px - u_cursor);
  float cursorBoost = 1.0 + 2.0 * exp(-cursorDist * cursorDist / 30000.0);

  // Pulse
  float pulse = 1.0 + 0.15 * sin(u_time * u_pulseSpeed);

  // Dark background
  vec3 bg = vec3(u_bgDarkness * 0.05);

  // Neon color
  vec3 neonGlow = u_glowColor * glow * u_intensity * cursorBoost * pulse;

  // Logo as dark silhouette with glow edges
  float logoShape = luminance(logo.rgb);
  vec3 color = bg + neonGlow;
  // Brighten logo interior slightly with glow color
  color += u_glowColor * logoShape * 0.15;

  fragColor = vec4(color, max(logo.a, glow * u_intensity));
}
`;

registerEffect({
  id: 'neon-glow',
  name: 'Neon Glow',
  fragmentShader,
  uniforms: ['u_logo', 'u_resolution', 'u_time', 'u_cursor', 'u_glowColor', 'u_glowRadius', 'u_intensity', 'u_pulseSpeed', 'u_bgDarkness'],
  schema: {
    glowColor: { type: 'color', label: 'Glow Color', default: '#f43f5e', group: 'Effect' },
    glowRadius: { type: 'range', label: 'Glow Radius', min: 4, max: 30, default: 12, group: 'Effect' },
    intensity: { type: 'range', label: 'Intensity', min: 0.5, max: 4.0, step: 0.1, default: 2.0, group: 'Effect' },
    pulseSpeed: { type: 'range', label: 'Pulse Speed', min: 0, max: 6.0, step: 0.1, default: 2.0, group: 'Effect' },
    bgDarkness: { type: 'range', label: 'Background', min: 0, max: 1.0, step: 0.05, default: 0.1, group: 'Effect' },
  },
  setUniforms(gl, loc, props, hexToVec3) {
    gl.uniform3fv(loc.u_glowColor, hexToVec3(props.glowColor));
    gl.uniform1f(loc.u_glowRadius, props.glowRadius);
    gl.uniform1f(loc.u_intensity, props.intensity);
    gl.uniform1f(loc.u_pulseSpeed, props.pulseSpeed);
    gl.uniform1f(loc.u_bgDarkness, props.bgDarkness);
  },
});
