const TEXTURE_SIZE = 512;
let currentSVGSource = null;

export function initSVGInput(onSVGLoaded) {
  const textarea = document.getElementById('svgTextarea');
  const dropZone = document.getElementById('svgDropZone');
  const fileInput = document.getElementById('svgFileInput');
  const uploadBtn = document.getElementById('uploadBtn');

  textarea.addEventListener('input', () => {
    const svg = textarea.value.trim();
    if (svg.startsWith('<svg') || svg.startsWith('<?xml')) {
      loadSVG(svg, onSVGLoaded);
    }
  });

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'image/svg+xml' || file.name.endsWith('.svg'))) {
      readFile(file, onSVGLoaded);
    }
  });

  uploadBtn.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', () => {
    if (fileInput.files[0]) {
      readFile(fileInput.files[0], onSVGLoaded);
    }
  });
}

function readFile(file, callback) {
  const reader = new FileReader();
  reader.onload = () => {
    const svg = reader.result;
    document.getElementById('svgTextarea').value = svg;
    loadSVG(svg, callback);
  };
  reader.readAsText(file);
}

function loadSVG(svgString, callback) {
  currentSVGSource = svgString;
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const img = new Image();

  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = TEXTURE_SIZE;
    canvas.height = TEXTURE_SIZE;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE);

    const scale = Math.min(TEXTURE_SIZE / img.width, TEXTURE_SIZE / img.height) * 0.8;
    const w = img.width * scale;
    const h = img.height * scale;
    const x = (TEXTURE_SIZE - w) / 2;
    const y = (TEXTURE_SIZE - h) / 2;
    ctx.drawImage(img, x, y, w, h);

    URL.revokeObjectURL(url);
    callback(canvas);
  };

  img.onerror = () => URL.revokeObjectURL(url);
  img.src = url;
}

export function getCurrentSVGSource() {
  return currentSVGSource;
}

export function loadDefaultLogo(callback) {
  const svg = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="100%" stop-color="#a0a0a0"/>
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="40" fill="url(#g)"/>
    <polygon points="50,22 65,58 35,58" fill="#333"/>
    <circle cx="50" cy="50" r="12" fill="none" stroke="#333" stroke-width="2"/>
  </svg>`;
  document.getElementById('svgTextarea').value = svg;
  loadSVG(svg, callback);
}
