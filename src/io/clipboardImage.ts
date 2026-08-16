// Pasted images are downscaled/recompressed before storage so a screenshot
// straight off the clipboard doesn't balloon the saved file — 720px on the
// long edge stays reasonably sharp even zoomed in a few hundred percent,
// while keeping file size sane. The on-canvas display size is a smaller,
// separate "fit" box (notes aren't resizable yet, so this is the size the
// image is stuck at until that lands).
const STORAGE_MAX_SIDE = 720;
const DISPLAY_MAX_SIDE = 280;
const DISPLAY_MIN_SIDE = 90;

export function getImageFileFromClipboard(e: ClipboardEvent): File | null {
  const items = e.clipboardData?.items;
  if (!items) return null;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.kind === 'file' && item.type.startsWith('image/')) {
      return item.getAsFile();
    }
  }
  return null;
}

function fitDisplaySize(w: number, h: number): { width: number; height: number } {
  const long = Math.max(w, h);
  let scale = 1;
  if (long > DISPLAY_MAX_SIDE) scale = DISPLAY_MAX_SIDE / long;
  else if (long < DISPLAY_MIN_SIDE) scale = DISPLAY_MIN_SIDE / long;
  return { width: Math.max(1, Math.round(w * scale)), height: Math.max(1, Math.round(h * scale)) };
}

/** Downscales an image file onto a canvas and re-encodes it as JPEG (~85%
 * quality). Transparency gets flattened onto white — an acceptable trade for
 * photos/screenshots, which is what pasted images mostly are. */
export function processImageFile(file: File): Promise<{ blob: Blob; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, STORAGE_MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
      const storeW = Math.max(1, Math.round(img.naturalWidth * scale));
      const storeH = Math.max(1, Math.round(img.naturalHeight * scale));
      const canvas = document.createElement('canvas');
      canvas.width = storeW;
      canvas.height = storeH;
      const ctx = canvas.getContext('2d');
      URL.revokeObjectURL(objectUrl);
      if (!ctx) {
        reject(new Error('Canvas is not available in this browser.'));
        return;
      }
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, storeW, storeH);
      ctx.drawImage(img, 0, 0, storeW, storeH);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Could not encode the pasted image.'));
            return;
          }
          const display = fitDisplaySize(storeW, storeH);
          resolve({ blob, width: display.width, height: display.height });
        },
        'image/jpeg',
        0.85,
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Could not read the pasted image.'));
    };
    img.src = objectUrl;
  });
}
