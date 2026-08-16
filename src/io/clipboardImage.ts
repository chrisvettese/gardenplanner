// Pasted images are stored exactly as pasted — no downscaling or
// recompression — so quality/transparency/format are never touched. Only
// the on-canvas display box is sized down to something reasonable; the
// underlying file is untouched (note that this means a large screenshot can
// meaningfully grow the saved .gardenplan file).
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

/** Reads the pasted file's natural dimensions (to size its note box) without
 * re-encoding it — the returned blob is the original file, byte-for-byte. */
export function processImageFile(file: File): Promise<{ blob: Blob; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const display = fitDisplaySize(img.naturalWidth, img.naturalHeight);
      URL.revokeObjectURL(objectUrl);
      resolve({ blob: file, width: display.width, height: display.height });
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Could not read the pasted image.'));
    };
    img.src = objectUrl;
  });
}
