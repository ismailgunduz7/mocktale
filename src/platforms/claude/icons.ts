// Icons in the manner of claude.ai, drawn for this project.
const svg = (body: string, size = 20, width = 1.6): string =>
  `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

const thumb =
  '<path d="M7.5 10.5V20"/><path d="M7.5 10.5 11 4.3c.3-.5.8-.8 1.4-.8 1.1 0 1.9 1 1.7 2.1l-.6 3.4h4.6c1.3 0 2.2 1.2 1.9 2.4l-1.6 6.6c-.2.9-1 1.5-2 1.5H5a1.5 1.5 0 0 1-1.5-1.5V12c0-.8.7-1.5 1.5-1.5h2.5Z"/>';

/** The starburst Claude puts under its latest answer: rays of uneven length around a centre. */
function spark(): string {
  const rays = [
    [0, 10.5], [24, 8.6], [47, 10.8], [71, 8.2], [96, 10.2], [118, 8.8], [142, 10.9], [166, 8.4],
    [191, 10.4], [213, 8.9], [238, 10.7], [261, 8.3], [286, 10.3], [309, 9], [334, 10.6]
  ];
  const paths = rays
    .map(([deg, len]) => {
      const a = ((deg ?? 0) * Math.PI) / 180;
      const x = (12 + Math.sin(a) * (len ?? 10)).toFixed(2);
      const y = (12 - Math.cos(a) * (len ?? 10)).toFixed(2);
      return `M12 12L${x} ${y}`;
    })
    .join('');
  return `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"><path d="${paths}"/></svg>`;
}

export const ICONS = {
  menu: svg('<path d="M4 7h16M4 12h16M4 17h10"/>', 22),
  chev: svg('<path d="m8 10 4 4 4-4"/>', 16, 1.8),
  compose: svg('<path d="M11 4.5H7.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h9a3 3 0 0 0 3-3V13"/><path d="M17.6 3.9a1.9 1.9 0 0 1 2.7 2.7l-7.3 7.3-3.6.9.9-3.6 7.3-7.3Z"/>', 22),
  plus: svg('<path d="M12 5.5v13M5.5 12h13"/>', 18),
  tools: svg('<path d="M4 7.5h9M17 7.5h3M4 16.5h3M11 16.5h9"/><circle cx="15" cy="7.5" r="2"/><circle cx="9" cy="16.5" r="2"/>', 18),
  send: svg('<path d="M12 18.5V6M6.5 11.5 12 6l5.5 5.5"/>', 18, 2.2),
  copy: svg('<rect x="8.5" y="8.5" width="11" height="11" rx="2.2"/><path d="M15.5 8.5V6.7A2.2 2.2 0 0 0 13.3 4.5H6.7A2.2 2.2 0 0 0 4.5 6.7v6.6a2.2 2.2 0 0 0 2.2 2.2h1.8"/>', 18),
  up: svg(thumb, 18),
  down: svg(`<g transform="rotate(180 12 12)">${thumb}</g>`, 18),
  retry: svg('<path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3"/><path d="M19.8 4.5V8.8h-4.3"/>', 18),
  spark: spark()
};
