import type { Device, FrameId, WidthChoice } from './types';

export interface FrameDef {
  id: FrameId;
  label: string;
  /** Exact output size in pixels; the export scale is worked out from it. */
  out?: [number, number];
}

export const FRAMES: FrameDef[] = [
  { id: 'auto', label: 'İçeriğe göre' },
  { id: 'screen', label: 'Telefon ekranı' },
  { id: 'ig45', label: 'Instagram 4:5', out: [1080, 1350] },
  { id: 'ig34', label: 'Instagram 3:4', out: [1080, 1440] },
  { id: 'ig11', label: 'Kare 1:1', out: [1080, 1080] },
  { id: 'story', label: 'Hikâye 9:16', out: [1080, 1920] }
];

export const frameById = (id: FrameId): FrameDef => FRAMES.find((f) => f.id === id) ?? (FRAMES[0] as FrameDef);

/** Height of a fixed frame at the given width, or null when the height follows the content. */
export function frameHeight(id: FrameId, width: number, device: Device): number | null {
  if (id === 'auto') return null;
  // A phone's own screen: 19.5:9 on current iPhones, 20:9 on most Android phones.
  if (id === 'screen') return Math.round((width * (device === 'android' ? 20 : 19.5)) / 9);
  const out = frameById(id).out;
  return out ? Math.round((width * out[1]) / out[0]) : null;
}

export const WIDTHS: { value: WidthChoice; label: string }[] = [
  { value: 'fit', label: 'Ekrana sığdır' },
  { value: 375, label: '375 · küçük iPhone' },
  { value: 393, label: '393 · iPhone' },
  { value: 402, label: '402 · iPhone Pro' },
  { value: 412, label: '412 · Android' },
  { value: 440, label: '440 · iPhone Pro Max' },
  { value: 760, label: '760 · tablet' },
  { value: 1000, label: '1000 · masaüstü' }
];
