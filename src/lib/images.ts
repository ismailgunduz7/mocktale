/**
 * Photos are read, shrunk and re-encoded in the browser and kept as data URLs in memory. Re-encoding
 * also drops the file's metadata (camera, place), which a mock never needs. Nothing is uploaded and
 * nothing is written to storage: closing the tab is the end of them.
 */

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('image'));
    img.src = src;
  });
}

/** Whether any pixel is see-through, on a small copy so a big photo costs little. */
function hasTransparency(img: HTMLImageElement): boolean {
  const size = 48;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const g = c.getContext('2d', { willReadFrequently: true });
  if (!g) return false;
  g.drawImage(img, 0, 0, size, size);
  const data = g.getImageData(0, 0, size, size).data;
  for (let k = 3; k < data.length; k += 4) if ((data[k] ?? 255) < 250) return true;
  return false;
}

/**
 * A picked file as a data URL no larger than `max` pixels on its long side. Photos become JPEG;
 * pictures with transparency (stickers, screenshots of icons) stay PNG.
 */
export async function readImage(file: File, max = 1600): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    const k = Math.min(1, max / Math.max(w, h));
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(w * k));
    c.height = Math.max(1, Math.round(h * k));
    const g = c.getContext('2d');
    if (!g) throw new Error('canvas');
    g.imageSmoothingQuality = 'high';
    const png = /png|gif|webp|svg/.test(file.type) && hasTransparency(img);
    g.drawImage(img, 0, 0, c.width, c.height);
    return png ? c.toDataURL('image/png') : c.toDataURL('image/jpeg', 0.9);
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Every picked file that the browser could read as an image; the rest are skipped. */
export async function readImages(files: FileList | File[], max?: number): Promise<string[]> {
  const out: string[] = [];
  for (const f of Array.from(files)) {
    try {
      out.push(await readImage(f, max));
    } catch {
      // Not an image the browser can decode (a RAW file, say). Leaving it out is enough.
    }
  }
  return out;
}
