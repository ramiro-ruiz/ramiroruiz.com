export function downloadPNG(canvas, filename, scale) {
  const sz = scale || 2;
  const exportCanvas = document.createElement('canvas');
  const dpr = window.devicePixelRatio || 1;
  exportCanvas.width = canvas.width * sz / dpr;
  exportCanvas.height = canvas.height * sz / dpr;
  const ctx = exportCanvas.getContext('2d');
  ctx.drawImage(canvas, 0, 0, exportCanvas.width, exportCanvas.height);

  exportCanvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'logo-shader.png';
    a.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}

let mediaRecorder = null;
let recordedChunks = [];

export function startRecording(canvas, duration, onComplete) {
  const stream = canvas.captureStream(30);
  mediaRecorder = new MediaRecorder(stream, {
    mimeType: 'video/webm;codecs=vp9',
    videoBitsPerSecond: 5000000,
  });
  recordedChunks = [];

  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) recordedChunks.push(e.data);
  };

  mediaRecorder.onstop = () => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'logo-shader.webm';
    a.click();
    URL.revokeObjectURL(url);
    if (onComplete) onComplete();
  };

  mediaRecorder.start();
  setTimeout(() => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
    }
  }, (duration || 4) * 1000);
}

export function isRecording() {
  return mediaRecorder && mediaRecorder.state === 'recording';
}
