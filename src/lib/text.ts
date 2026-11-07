export const escapeHtml = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// A web address as people type it in a chat. The last character may not be punctuation, so
// "bak: example.com." keeps its full stop outside the link.
const URL_RE = /\b((?:https?:\/\/|www\.)[^\s<]*[^\s<.,:;"')\]!?])/gi;

/** Escaped chat text with web addresses marked, as phones underline them in a bubble. */
export function chatHtml(text: string): string {
  return escapeHtml(text).replace(URL_RE, '<span class="lnk">$1</span>');
}

// WhatsApp's own markers: *bold*, _italic_, ~strikethrough~, `inline code`, ```monospace```.
// A marker only counts when it hugs a word on both sides, as in the app.
const WA_INLINE: [RegExp, string][] = [
  [/(^|[\s([{"'])\*(?=\S)([^*\n]*?\S)\*(?=$|[\s)\]}.,;:!?"'])/g, '$1<b>$2</b>'],
  [/(^|[\s([{"'])_(?=\S)([^_\n]*?\S)_(?=$|[\s)\]}.,;:!?"'])/g, '$1<i>$2</i>'],
  [/(^|[\s([{"'])~(?=\S)([^~\n]*?\S)~(?=$|[\s)\]}.,;:!?"'])/g, '$1<s>$2</s>']
];

/** Escaped WhatsApp message text with the app's formatting markers applied. */
export function whatsappHtml(text: string): string {
  const kept: string[] = [];
  const keep = (html: string): string => `\u0000${kept.push(html) - 1}\u0000`;
  let s = escapeHtml(text)
    .replace(/```([\s\S]+?)```/g, (_, code: string) => keep(`<span class="mono">${code}</span>`))
    .replace(/`([^`\n]+)`/g, (_, code: string) => keep(`<span class="icode">${code}</span>`))
    .replace(URL_RE, (url: string) => keep(`<span class="lnk">${url}</span>`));
  for (const [re, html] of WA_INLINE) s = s.replace(re, html);
  return s.replace(/\u0000(\d+)\u0000/g, (_, i: string) => kept[Number(i)] ?? '');
}

const segmenter =
  typeof Intl !== 'undefined' && 'Segmenter' in Intl
    ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    : null;

const EMOJI_START = /^(?:\p{Extended_Pictographic}|\p{Regional_Indicator}|[#*0-9]️?⃣)/u;

/**
 * How many emoji a message is made of, when it is made of nothing else and has at most three.
 * Phones draw such messages large, without a bubble. Zero means an ordinary message.
 */
export function jumboEmojiCount(text: string): number {
  const t = text.trim();
  if (!t || t.length > 48 || !segmenter) return 0;
  let n = 0;
  for (const { segment } of segmenter.segment(t)) {
    if (!EMOJI_START.test(segment)) return 0;
    if (++n > 3) return 0;
  }
  return n;
}

/** Up to two initials, as contact avatars show them: "Elif Yılmaz" gives "EY". */
export function initials(name: string, locale: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const letters = words.length > 1 ? [words[0], words[words.length - 1]] : words;
  return letters
    .map((w) => Array.from(w ?? '')[0] ?? '')
    .join('')
    .toLocaleUpperCase(locale);
}
