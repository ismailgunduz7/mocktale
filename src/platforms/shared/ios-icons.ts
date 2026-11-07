// iOS-style glyphs shared by the iPhone mocks (Messages, WhatsApp on iPhone). Drawn for this
// project after the shapes of Apple's symbols; the phone handset is Google's Material "call"
// outline (Apache License 2.0), traced as a stroke.

const stroke = (w: number, h: number, vb: string, body: string, width = 1.8): string =>
  `<svg viewBox="${vb}" width="${w}" height="${h}" fill="none" stroke="currentColor" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

export const IOS = {
  back: stroke(12, 21, '0 0 12 21', '<path d="M10 2 2 10.5 10 19"/>', 3),
  backSmall: stroke(11, 19, '0 0 12 21', '<path d="M9.5 2.5 2.5 10.5l7 8"/>', 2.8),
  next: stroke(6, 10, '0 0 7 12', '<path d="M1.5 1.5 6 6l-4.5 4.5"/>', 1.9),
  video: stroke(
    28,
    19,
    '0 0 30 20',
    '<rect x="1.5" y="2.5" width="18.5" height="15" rx="4.2"/><path d="m21.5 8.4 5-3.6c.8-.6 2 0 2 1v8.4c0 1-1.2 1.6-2 1l-5-3.6Z"/>',
    1.8
  ),
  phone: stroke(
    22,
    22,
    '0 0 24 24',
    '<path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>',
    1.6
  ),
  plus: stroke(18, 18, '0 0 24 24', '<path d="M12 4.5v15M4.5 12h15"/>', 2.4),
  plusThin: stroke(22, 22, '0 0 24 24', '<path d="M12 4v16M4 12h16"/>', 1.7),
  mic: stroke(
    15,
    22,
    '0 0 16 24',
    '<rect x="4.5" y="2" width="7" height="13" rx="3.5"/><path d="M1.5 11.5a6.5 6.5 0 0 0 13 0M8 18v4"/>',
    1.7
  ),
  camera: stroke(
    24,
    20,
    '0 0 26 22',
    '<path d="M2 7.5A2.5 2.5 0 0 1 4.5 5h3l1.6-2.3c.3-.4.7-.7 1.2-.7h5.4c.5 0 .9.3 1.2.7L18.5 5h3A2.5 2.5 0 0 1 24 7.5v10a2.5 2.5 0 0 1-2.5 2.5h-17A2.5 2.5 0 0 1 2 17.5Z"/><circle cx="13" cy="12.2" r="4.2"/>',
    1.7
  ),
  sticker: stroke(
    20,
    20,
    '0 0 24 24',
    '<path d="M20.5 13.5V7a3.5 3.5 0 0 0-3.5-3.5H7A3.5 3.5 0 0 0 3.5 7v10A3.5 3.5 0 0 0 7 20.5h6.5"/><path d="M20.5 13.5 13.5 20.5V16a2.5 2.5 0 0 1 2.5-2.5Z"/>',
    1.6
  )
};
