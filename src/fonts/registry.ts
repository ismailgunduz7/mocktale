/**
 * Every font the mocks may draw with, served from this site. All of them are open (SIL OFL 1.1),
 * so they ship with the build; see public/licenses.txt.
 *
 * Faces are registered through the FontFace API rather than CSS. The browser still downloads a
 * face only when some text needs it, and the exporter can ask each face whether it was loaded:
 * exactly those are packed into the exported image, so the PNG matches the preview.
 *
 * To add a font you hold a web licence for (SF Pro, Söhne, Styrene, Tiempos and so on), put its
 * woff2 files under src/fonts/files/, list them below, and name the family in the stack of the
 * platform that uses it. Stacks already start with the real names where we know them, so a
 * licensed font takes over without touching any platform code.
 */

import gscLatinExt from '@fontsource-variable/google-sans-code/files/google-sans-code-latin-ext-wght-normal.woff2?url';
import gscLatin from '@fontsource-variable/google-sans-code/files/google-sans-code-latin-wght-normal.woff2?url';
import gsfLatinExt from '@fontsource-variable/google-sans-flex/files/google-sans-flex-latin-ext-opsz-normal.woff2?url';
import gsfLatin from '@fontsource-variable/google-sans-flex/files/google-sans-flex-latin-opsz-normal.woff2?url';
import gsfVietnamese from '@fontsource-variable/google-sans-flex/files/google-sans-flex-vietnamese-opsz-normal.woff2?url';
import interCyrillic from '@fontsource-variable/inter/files/inter-cyrillic-opsz-normal.woff2?url';
import interGreek from '@fontsource-variable/inter/files/inter-greek-opsz-normal.woff2?url';
import interLatinExtItalic from '@fontsource-variable/inter/files/inter-latin-ext-opsz-italic.woff2?url';
import interLatinExt from '@fontsource-variable/inter/files/inter-latin-ext-opsz-normal.woff2?url';
import interLatinItalic from '@fontsource-variable/inter/files/inter-latin-opsz-italic.woff2?url';
import interLatin from '@fontsource-variable/inter/files/inter-latin-opsz-normal.woff2?url';
import robotoCyrillic from '@fontsource-variable/roboto/files/roboto-cyrillic-wght-normal.woff2?url';
import robotoGreek from '@fontsource-variable/roboto/files/roboto-greek-wght-normal.woff2?url';
import robotoLatinExtItalic from '@fontsource-variable/roboto/files/roboto-latin-ext-wght-italic.woff2?url';
import robotoLatinExt from '@fontsource-variable/roboto/files/roboto-latin-ext-wght-normal.woff2?url';
import robotoLatinItalic from '@fontsource-variable/roboto/files/roboto-latin-wght-italic.woff2?url';
import robotoLatin from '@fontsource-variable/roboto/files/roboto-latin-wght-normal.woff2?url';
import serifCyrillic from '@fontsource-variable/source-serif-4/files/source-serif-4-cyrillic-opsz-normal.woff2?url';
import serifGreek from '@fontsource-variable/source-serif-4/files/source-serif-4-greek-opsz-normal.woff2?url';
import serifLatinExtItalic from '@fontsource-variable/source-serif-4/files/source-serif-4-latin-ext-opsz-italic.woff2?url';
import serifLatinExt from '@fontsource-variable/source-serif-4/files/source-serif-4-latin-ext-opsz-normal.woff2?url';
import serifLatinItalic from '@fontsource-variable/source-serif-4/files/source-serif-4-latin-opsz-italic.woff2?url';
import serifLatin from '@fontsource-variable/source-serif-4/files/source-serif-4-latin-opsz-normal.woff2?url';
import dysBoldItalic from '@fontsource/opendyslexic/files/opendyslexic-latin-700-italic.woff2?url';
import dysBold from '@fontsource/opendyslexic/files/opendyslexic-latin-700-normal.woff2?url';
import dysItalic from '@fontsource/opendyslexic/files/opendyslexic-latin-400-italic.woff2?url';
import dysRegular from '@fontsource/opendyslexic/files/opendyslexic-latin-400-normal.woff2?url';

// The subsets Google Fonts cuts its families into. Turkish needs both Latin ranges: ı is in the
// first, ğ, ş and İ in the second.
const LATIN =
  'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';
const LATIN_EXT =
  'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C4,U+2113,U+2C60-2C7F,U+A720-A7FF';
const VIETNAMESE =
  'U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB';
const CYRILLIC = 'U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116';
const GREEK = 'U+0370-0377,U+037A-037F,U+0384-038A,U+038C,U+038E-03A1,U+03A3-03FF';

export type FontFamily =
  | 'Google Sans Flex'
  | 'Google Sans Code'
  | 'Inter'
  | 'Roboto'
  | 'Source Serif 4'
  | 'OpenDyslexic';

interface FaceSpec {
  family: FontFamily;
  url: string;
  /** A range for variable fonts ("1 1000"), a single value for static ones. */
  weight: string;
  style?: 'normal' | 'italic';
  range?: string;
}

const SPECS: FaceSpec[] = [
  // Google's own typeface: Gemini, Google Messages and the Android status bar. The optical size
  // axis gives the "Text" cut at message sizes and the display cut in large titles by itself.
  { family: 'Google Sans Flex', url: gsfLatin, weight: '1 1000', range: LATIN },
  { family: 'Google Sans Flex', url: gsfLatinExt, weight: '1 1000', range: LATIN_EXT },
  { family: 'Google Sans Flex', url: gsfVietnamese, weight: '1 1000', range: VIETNAMESE },
  { family: 'Google Sans Code', url: gscLatin, weight: '300 800', range: LATIN },
  { family: 'Google Sans Code', url: gscLatinExt, weight: '300 800', range: LATIN_EXT },

  // Stand-in for SF Pro on devices that do not have it, and for Anthropic's sans in Claude.
  { family: 'Inter', url: interLatin, weight: '100 900', range: LATIN },
  { family: 'Inter', url: interLatinExt, weight: '100 900', range: LATIN_EXT },
  { family: 'Inter', url: interCyrillic, weight: '100 900', range: CYRILLIC },
  { family: 'Inter', url: interGreek, weight: '100 900', range: GREEK },
  { family: 'Inter', url: interLatinItalic, weight: '100 900', style: 'italic', range: LATIN },
  { family: 'Inter', url: interLatinExtItalic, weight: '100 900', style: 'italic', range: LATIN_EXT },

  // Android's system font, used by WhatsApp on Android.
  { family: 'Roboto', url: robotoLatin, weight: '100 900', range: LATIN },
  { family: 'Roboto', url: robotoLatinExt, weight: '100 900', range: LATIN_EXT },
  { family: 'Roboto', url: robotoCyrillic, weight: '100 900', range: CYRILLIC },
  { family: 'Roboto', url: robotoGreek, weight: '100 900', range: GREEK },
  { family: 'Roboto', url: robotoLatinItalic, weight: '100 900', style: 'italic', range: LATIN },
  { family: 'Roboto', url: robotoLatinExtItalic, weight: '100 900', style: 'italic', range: LATIN_EXT },

  // Stand-in for the serif Claude answers in.
  { family: 'Source Serif 4', url: serifLatin, weight: '200 900', range: LATIN },
  { family: 'Source Serif 4', url: serifLatinExt, weight: '200 900', range: LATIN_EXT },
  { family: 'Source Serif 4', url: serifCyrillic, weight: '200 900', range: CYRILLIC },
  { family: 'Source Serif 4', url: serifGreek, weight: '200 900', range: GREEK },
  { family: 'Source Serif 4', url: serifLatinItalic, weight: '200 900', style: 'italic', range: LATIN },
  { family: 'Source Serif 4', url: serifLatinExtItalic, weight: '200 900', style: 'italic', range: LATIN_EXT },

  // Claude's "dyslexic friendly" chat font.
  { family: 'OpenDyslexic', url: dysRegular, weight: '400' },
  { family: 'OpenDyslexic', url: dysBold, weight: '700' },
  { family: 'OpenDyslexic', url: dysItalic, weight: '400', style: 'italic' },
  { family: 'OpenDyslexic', url: dysBoldItalic, weight: '700', style: 'italic' }
];

const faces: { spec: FaceSpec; face: FontFace }[] = [];

/** Makes every face known to the page. Nothing is downloaded until text uses it. */
export function registerFonts(): void {
  if (faces.length || typeof FontFace === 'undefined') return;
  for (const spec of SPECS) {
    const face = new FontFace(spec.family, `url("${spec.url}") format("woff2")`, {
      weight: spec.weight,
      style: spec.style ?? 'normal',
      unicodeRange: spec.range ?? 'U+0-10FFFF',
      display: 'swap'
    });
    document.fonts.add(face);
    faces.push({ spec, face });
  }
}

const dataUrls = new Map<string, Promise<string>>();

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error ?? new Error('read'));
    r.readAsDataURL(blob);
  });
}

/** The font file as a data URL. Same-origin only, which the site's CSP allows and requires. */
function fontDataUrl(url: string): Promise<string> {
  let p = dataUrls.get(url);
  if (!p) {
    p = fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`font ${r.status}`);
        return r.blob();
      })
      .then(blobToDataUrl);
    p.catch(() => dataUrls.delete(url));
    dataUrls.set(url, p);
  }
  return p;
}

/**
 * @font-face rules carrying their files inline, for the faces the preview has actually loaded and
 * whose family appears in `usedStacks` (the font-family values found in the mock). An image drawn
 * from an SVG cannot fetch anything, so the fonts have to travel inside it.
 */
export async function embeddedFontCss(usedStacks: Set<string>): Promise<string> {
  await document.fonts.ready;
  const stacks = Array.from(usedStacks).join(',');
  const used = faces.filter(({ spec, face }) => face.status === 'loaded' && stacks.includes(spec.family));
  const rules = await Promise.all(
    used.map(async ({ spec }) => {
      const src = await fontDataUrl(spec.url);
      const range = spec.range ? `unicode-range:${spec.range};` : '';
      return `@font-face{font-family:'${spec.family}';src:url(${src}) format('woff2');font-weight:${spec.weight};font-style:${spec.style ?? 'normal'};${range}}`;
    })
  );
  return rules.join('\n');
}
