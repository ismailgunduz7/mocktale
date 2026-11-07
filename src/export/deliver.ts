/** Getting the finished PNG to the visitor: a download, the clipboard or the share sheet. */

const pad = (n: number): string => String(n).padStart(2, '0');

export function fileName(slug: string): string {
  const d = new Date();
  const stamp = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  return `mocktale-${slug}-${stamp}.png`;
}

export function download(blob: Blob, name: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

export const canCopyImage =
  typeof window !== 'undefined' && typeof ClipboardItem !== 'undefined' && !!navigator.clipboard?.write;

/**
 * Copies the image. The promise goes into the ClipboardItem as it is, so Safari still counts the
 * write as part of the click even though drawing the image takes a moment.
 */
export async function copyImage(blob: Promise<Blob>): Promise<void> {
  await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
}

export function canShareFiles(): boolean {
  try {
    return !!navigator.canShare?.({ files: [new File([new Blob()], 'mocktale.png', { type: 'image/png' })] });
  } catch {
    return false;
  }
}

/** Opens the share sheet; on a phone that is where "Save Image" lives. */
export async function shareImage(blob: Blob, name: string): Promise<boolean> {
  try {
    await navigator.share({ files: [new File([blob], name, { type: 'image/png' })] });
    return true;
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') return false;
    throw e;
  }
}
