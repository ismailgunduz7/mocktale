// Thin rounded strokes in the manner of the ChatGPT app's icon set, drawn for this project.
const svg = (body: string, size = 24, width = 1.75): string =>
  `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

const thumb =
  '<path d="M7.5 10.5V20"/><path d="M7.5 10.5 11 4.3c.3-.5.8-.8 1.4-.8 1.1 0 1.9 1 1.7 2.1l-.6 3.4h4.6c1.3 0 2.2 1.2 1.9 2.4l-1.6 6.6c-.2.9-1 1.5-2 1.5H5a1.5 1.5 0 0 1-1.5-1.5V12c0-.8.7-1.5 1.5-1.5h2.5Z"/>';

export const ICONS = {
  menu: svg('<path d="M3.75 8.5h16.5M3.75 15.5h10.5"/>'),
  chev: svg('<path d="m7 10 5 5 5-5"/>', 16, 2),
  compose: svg(
    '<path d="M11 4.5H7.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h9a3 3 0 0 0 3-3V13"/><path d="M17.6 3.9a1.9 1.9 0 0 1 2.7 2.7l-7.3 7.3-3.6.9.9-3.6 7.3-7.3Z"/>'
  ),
  plus: svg('<path d="M12 5v14M5 12h14"/>'),
  mic: svg('<rect x="9" y="3" width="6" height="11.5" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>', 22),
  voice: svg('<path d="M7 10.5v3M10.33 7v10M13.67 9v6M17 10.5v3"/>', 20, 2.2),
  copy: svg(
    '<rect x="8.5" y="8.5" width="11.5" height="11.5" rx="2.5"/><path d="M15.5 8.5V6.5a2.5 2.5 0 0 0-2.5-2.5H6.5A2.5 2.5 0 0 0 4 6.5V13a2.5 2.5 0 0 0 2.5 2.5h2"/>',
    18
  ),
  up: svg(thumb, 18),
  down: svg(`<g transform="rotate(180 12 12)">${thumb}</g>`, 18),
  share: svg('<path d="M12 14.5V3.5M8 7.5l4-4 4 4"/><path d="M8 10.5H7a2.5 2.5 0 0 0-2.5 2.5v5A2.5 2.5 0 0 0 7 20.5h10a2.5 2.5 0 0 0 2.5-2.5v-5a2.5 2.5 0 0 0-2.5-2.5h-1"/>', 18),
  retry: svg('<path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3"/><path d="M19.8 4.5V8.8h-4.3"/>', 18),
  codeCopy: svg(
    '<rect x="8.5" y="8.5" width="11.5" height="11.5" rx="2.5"/><path d="M15.5 8.5V6.5a2.5 2.5 0 0 0-2.5-2.5H6.5A2.5 2.5 0 0 0 4 6.5V13a2.5 2.5 0 0 0 2.5 2.5h2"/>',
    14
  )
};
