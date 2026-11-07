import { isIOS, isWebKit } from '@/lib/env';
import { embeddedFontCss } from '@/fonts/registry';

/**
 * Turns the live preview into a PNG without any network: the mock's DOM and stylesheet go into an
 * SVG <foreignObject>, the browser draws that SVG onto a canvas with its own layout engine, and
 * the canvas becomes the file. Photos are already data URLs; fonts are packed in as data URLs too,
 * since an image may not load anything from outside itself.
 */

export interface RenderInput {
  node: HTMLElement;
  /** Every rule the mock needs: shared base, the platform's sheet. */
  css: string;
  /** Pixels per CSS pixel. */
  scale: number;
  /** Exact output size, for fixed formats such as Instagram's 1080×1350. */
  size?: [number, number];
}

export interface RenderOutput {
  blob: Blob;
  width: number;
  height: number;
  /** Lower than asked when the image would have been larger than the browser can draw. */
  scale: number;
}

// iOS draws nothing on a canvas over ~16.7 million pixels; desktop browsers allow far more, but
// Safari on the Mac stops at 16384 pixels a side.
const MAX_AREA = isIOS ? 16_000_000 : 100_000_000;
const MAX_SIDE = 16_384;

const xmlText = (s: string): string => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'sync';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('svg'));
    img.src = src;
  });
}

const wait = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

/** The font-family values used anywhere in the mock, to know which fonts to pack. */
function fontStacks(node: HTMLElement): Set<string> {
  const stacks = new Set<string>();
  const add = (el: Element): void => {
    stacks.add(getComputedStyle(el).fontFamily);
    for (const pseudo of ['::before', '::after']) stacks.add(getComputedStyle(el, pseudo).fontFamily);
  };
  add(node);
  node.querySelectorAll('*').forEach(add);
  return stacks;
}

export async function renderPng({ node, css, scale, size }: RenderInput): Promise<RenderOutput> {
  await document.fonts.ready;
  const width = node.offsetWidth;
  const height = node.offsetHeight;

  let outW = size ? size[0] : Math.round(width * scale);
  let outH = size ? size[1] : Math.round(height * scale);
  let k = 1;
  if (outW * outH > MAX_AREA) k = Math.min(k, Math.sqrt(MAX_AREA / (outW * outH)));
  if (Math.max(outW, outH) * k > MAX_SIDE) k = Math.min(k, MAX_SIDE / Math.max(outW, outH));
  if (k < 1) {
    outW = Math.floor(outW * k);
    outH = Math.floor(outH * k);
  }

  const fonts = await embeddedFontCss(fontStacks(node));
  const html = new XMLSerializer().serializeToString(node);
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    `<foreignObject x="0" y="0" width="${width}" height="${height}">` +
    `<div xmlns="http://www.w3.org/1999/xhtml" style="width:${width}px;height:${height}px">` +
    `<style>${xmlText(fonts + '\n' + css)}</style>${html}</div></foreignObject></svg>`;

  const img = await loadImage(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`);
  try {
    await img.decode();
  } catch {
    // Some engines refuse decode() for SVG; onload already means it can be drawn.
  }

  const canvas = document.createElement('canvas');
  canvas.width = outW;
  canvas.height = outH;
  const g = canvas.getContext('2d');
  if (!g) throw new Error('canvas');
  const background = getComputedStyle(node).backgroundColor;

  // WebKit paints the photos and fonts inside an SVG picture only after it has been drawn once,
  // so on Safari and every iOS browser the picture is drawn a few times with a pause between.
  const passes = isWebKit ? 3 : 1;
  for (let pass = 0; pass < passes; pass++) {
    if (pass) await wait(150);
    g.clearRect(0, 0, outW, outH);
    g.fillStyle = background;
    g.fillRect(0, 0, outW, outH);
    g.drawImage(img, 0, 0, outW, outH);
  }

  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('blob'))), 'image/png')
  );
  return { blob, width: outW, height: outH, scale: outW / width };
}
