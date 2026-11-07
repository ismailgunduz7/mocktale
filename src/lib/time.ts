import type { Lang } from '@/state/types';

/** Minutes since midnight for a "HH:MM" or "H.MM" time, or null when it is not one. */
export function parseTime(value: string): number | null {
  const m = /^(\d{1,2})[:.](\d{2})$/.exec(value.trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
}

const pad = (n: number): string => String(n).padStart(2, '0');

export function toHHMM(minutes: number): string {
  const t = ((minutes % 1440) + 1440) % 1440;
  return `${pad(Math.floor(t / 60))}:${pad(t % 60)}`;
}

/** The time a little after `value`; a new message usually comes a minute after the last one. */
export function addMinutes(value: string, delta: number): string {
  const t = parseTime(value);
  return t === null ? value : toHHMM(t + delta);
}

/**
 * A stored 24-hour time as a phone set to the mock's language shows it: "09:41" in Turkish,
 * "9:41 AM" in English. Text that is not a time is shown as typed.
 */
export function formatTime(value: string, lang: Lang): string {
  const t = parseTime(value);
  if (t === null) return value.trim();
  const h = Math.floor(t / 60);
  const m = t % 60;
  if (lang === 'tr') return `${pad(h)}:${pad(m)}`;
  return `${h % 12 || 12}:${pad(m)} ${h < 12 ? 'AM' : 'PM'}`;
}
