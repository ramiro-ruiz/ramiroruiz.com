import { listEffects, getEffect, getDefaultProps } from './effects/registry.js';
import { renderControls } from './controls.js';
import { initCodePanel, updateCodeOutput } from './code-generator.js';
import { initSVGInput, loadDefaultLogo, getCurrentSVGSource } from './svg-input.js';
import { createProgram, createTexture, setupFullscreenQuad, FULLSCREEN_VERTEX_SHADER, cssToCanvas } from './webgl-utils.js';

// Import all effects so they self-register
import './effects/chrome.js';
import './effects/holographic.js';
import './effects/glossy.js';
import './effects/neon-glow.js';
import './effects/liquid-metal.js';
import './effects/brushed-steel.js';
import './effects/gold-foil.js';

let activeEffect = null;
let activeProps = {};
let activeInstance = null;
let svgTextureCanvas = null;
let glCanvas = null;

function init() {
  initCodePanel(() => glCanvas);
  renderEffectList();

  initSVGInput((textureCanvas) => {
    svgTextureCanvas = textureCanvas;
    if (activeEffect) renderCanvas();
  });

  loadDefaultLogo((textureCanvas) => {
    svgTextureCanvas = textureCanvas;
    const effects = listEffects();
    if (effects.length > 0) loadEffect(effects[0].id);
  });
}

function renderEffectList() {
  const grid = document.getElementById('effectGrid');
  grid.innerHTML = '';

  for (const e of listEffects()) {
    const card = document.createElement('div');
    card.className = 'template-card';
    card.dataset.effectId = e.id;
    card.innerHTML = `<div class="template-card-name">${e.name}</div>`;
    card.addEventListener('click', () => loadEffect(e.id));
    grid.appendChild(card);
  }
}

function loadEffect(id) {
  if (activeInstance?.cleanup) {
    activeInstance.cleanup();
    activeInstance = null;
  }

  activeEffect = getEffect(id);
  activeProps = getDefaultProps(activeEffect.schema);

  document.querySelectorAll('.template-card').forEach(card => {
    card.classList.toggle('active', card.dataset.effectId === id);
  });

  const controlsBody = document.getElementById('controlsBody');
  renderControls(controlsBody, activeEffect.schema, activeProps, onControlsChange);

  renderCanvas();
  updateCodeOutput(activeEffect, activeProps, getCurrentSVGSource());
}

function onControlsChange(props) {
  activeProps = props;
  if (activeInstance?.updateUniforms) {
    activeInstance.updateUniforms(props);
  }
  updateCodeOutput(activeEffect, activeProps, getCurrentSVGSource());
}

function hexToVec3(hex) {
  return [
    parseInt(hex.slice(1, 3), 16) / 255,
    parseInt(hex.slice(3, 5), 16) / 255,
    parseInt(hex.slice(5, 7), 16) / 255,
  ];
}

function renderCanvas() {
  const container = document.getElementById('canvasContainer');
  container.innerHTML = '';

  if (!svgTextureCanvas || !activeEffect) return;

  const size = 512;
  const canvas = document.createElement('canvas');
  const dpr = window.devicePixelRatio || 1;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width = size + 'px';
  canvas.style.height = size + 'px';
  container.appendChild(canvas);
  glCanvas = canvas;

  const gl = canvas.getContext('webgl2', { premultipliedAlpha: false, preserveDrawingBuffer: true });
  if (!gl) return;

  const program = createProgram(gl, FULLSCREEN_VERTEX_SHADER, activeEffect.fragmentShader);
  const logoTexture = createTexture(gl);
  setupFullscreenQuad(gl, program);
  gl.useProgram(program);

  // Upload SVG texture
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, logoTexture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, svgTextureCanvas);

  // Get uniform locations
  const loc = {};
  const uniformNames = activeEffect.uniforms || [];
  for (const name of uniformNames) {
    loc[name] = gl.getUniformLocation(program, name);
  }

  let cursor = { x: canvas.width / 2, y: canvas.height / 2 };
  let uniforms = { ...activeProps };
  let animFrame = null;
  let userInteracted = false;

  canvas.addEventListener('mousemove', (e) => {
    userInteracted = true;
    cursor = cssToCanvas(canvas, e.clientX, e.clientY);
  });

  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    userInteracted = true;
    const touch = e.touches[0];
    cursor = cssToCanvas(canvas, touch.clientX, touch.clientY);
  }, { passive: false });

  canvas.addEventListener('touchstart', (e) => {
    userInteracted = true;
    const touch = e.touches[0];
    cursor = cssToCanvas(canvas, touch.clientX, touch.clientY);
  });

  canvas.addEventListener('mouseleave', () => {
    userInteracted = false;
  });

  function render(time) {
    animFrame = requestAnimationFrame(render);
    const t = time / 1000;

    // Auto-animate light when no interaction (subtle orbit)
    if (!userInteracted) {
      cursor.x = canvas.width * (0.5 + 0.3 * Math.sin(t * 0.5));
      cursor.y = canvas.height * (0.5 + 0.2 * Math.cos(t * 0.7));
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform1i(loc.u_logo, 0);
    gl.uniform2f(loc.u_resolution, canvas.width, canvas.height);
    gl.uniform1f(loc.u_time, t);
    gl.uniform2f(loc.u_cursor, cursor.x, cursor.y);

    if (activeEffect.setUniforms) {
      activeEffect.setUniforms(gl, loc, uniforms, hexToVec3);
    }

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  animFrame = requestAnimationFrame(render);

  activeInstance = {
    cleanup() {
      cancelAnimationFrame(animFrame);
      gl.deleteProgram(program);
      gl.deleteTexture(logoTexture);
    },
    updateUniforms(newProps) {
      Object.assign(uniforms, newProps);
    }
  };
}

document.addEventListener('DOMContentLoaded', init);
