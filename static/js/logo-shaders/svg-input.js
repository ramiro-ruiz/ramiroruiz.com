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
  // Bold abstract "R" mark — silhouette with transparent bg for proper alpha clipping
  const svg = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <path d="M40 20h70c30 0 54 24 54 54 0 22-13 41-32 49l38 57H140l-34-52H80v52H40V20zm40 72h30c12 0 22-10 22-22s-10-22-22-22H80v44z" fill="white"/>
  </svg>`;
  document.getElementById('svgTextarea').value = svg;
  loadSVG(svg, callback);
}
