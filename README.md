# mocktale

Fake chat screenshots for AI assistants and messaging apps, made entirely in the browser: Gemini,
ChatGPT and Claude, WhatsApp (iPhone and Android), iMessage, iPhone SMS and Android SMS (Google
Messages). You write the conversation, pick photos, and download a PNG, copy it, or share it from
a phone. The interface is in Turkish; each mock can speak Turkish or English.

Nothing typed or picked leaves the browser tab and nothing is stored, not even in the browser. The
rules that keep it so are in [AGENTS.md](AGENTS.md).

## Layout

| Path | What lives there |
| --- | --- |
| `src/platforms/<name>/` | One mock each: component, stylesheet, definition with its settings fields |
| `src/platforms/shared/` | Status bars, chat run grouping, iPhone and Material icon outlines |
| `src/shot/base.css` | Rules every mock shares, including fixed frames and status bars |
| `src/stage/` | The preview: frame sizing, scrolling inside fixed frames, export |
| `src/export/` | DOM to SVG to canvas to PNG, and download, clipboard and share sheet |
| `src/editor/` | The editing column: platform picker, messages, settings |
| `src/fonts/registry.ts` | Every font the mocks may use, registered from Fontsource packages |
| `src/state/` | The in-memory state, default conversations, frames and widths |
| `netlify.toml`, `public/_redirects` | Build settings, headers (CSP) and the SPA fallback |
| `public/licenses.txt` | Licences of the fonts and icon outlines that ship with the site |

Vue 3, Vite and TypeScript. No router and no store library; the only runtime JavaScript is Vue
and this code. The Fontsource packages contribute font files, nothing else.

## How it works

```
editor ──> state (memory only) ──> mock component ──> preview in the page
                                         │
                                         └─> export: DOM + mock CSS + fonts as data URLs
                                             ──> SVG <foreignObject> ──> canvas ──> PNG
```

The preview is the image. Each mock's stylesheet is imported as a string, injected once into the
page, and packed into the SVG at export together with the fonts the preview loaded, so the
browser draws the PNG with the same engine and the same rules. Photos are kept as downscaled data
URLs, so they travel into the image without a network. Safari draws SVG pictures lazily; the
exporter paints a few times with a pause there.

Frames: "İçeriğe göre" is as tall as the conversation. "Telefon ekranı" (19.5:9 on iPhone, 20:9 on
Android) and the Instagram sizes are fixed; their header and input bar float over the
conversation as in the apps, and a slider picks the part that shows. Instagram sizes always come
out 1080 pixels wide.

"Tam ekran" hides the editor and fills the screen with the mock, for a screenshot taken with the
phone itself. Esc, a double click or a double tap leaves it.

The path picks the platform: `/gemini`, `/chatgpt`, `/claude`, `/whatsapp`, `/imessage`,
`/iphone-sms`, `/android-sms`. `/` starts on Gemini.

## Fonts

| Mock | Font | Why |
| --- | --- | --- |
| Gemini, Google Messages, Android status bar | Google Sans Flex (OFL), fixed | The apps' own typeface; open since 2025 |
| Gemini code | Google Sans Code (OFL) | Gemini's code font |
| ChatGPT | the system font | ChatGPT itself asks for the system font |
| iMessage, iPhone SMS, WhatsApp on iPhone, iOS status bar | San Francisco where the device has it, else Inter (OFL) | SF may not be served by a website |
| WhatsApp on Android | Roboto (OFL) | Android's system font |
| Claude | Inter and Source Serif 4 (OFL) in place of Anthropic's fonts; OpenDyslexic for the dyslexic friendly setting | Anthropic's fonts are not open |

To use a font you hold a web licence for, add its woff2 files under `src/fonts/files/`, list them
in `src/fonts/registry.ts`, and make sure the platform's stack names the family. The stacks already
start with the real names (`'SF Pro Text'`, `'Anthropic Sans'`, `'Anthropic Serif'`, `'Styrene B'`,
`'Tiempos Text'`), so the licensed font takes over without other changes. Add its licence to
`public/licenses.txt`.

## Adding a platform

1. Create `src/platforms/<name>/` with a component that takes `ctx: ShotContext` and renders
   `.mt-top`, `.mt-body > .mt-scroll > <thread>` and `.mt-bottom`.
2. Write its stylesheet under `.shot.<root class>` and import it with `?inline` in the
   definition (`index.ts`), together with its fields, category, status bar device and editor
   options.
3. Add it to `PLATFORMS` in `src/platforms/index.ts`. The picker, the route, the settings form and
   the exporter pick it up from there.
4. Add it to the render test in `src/platforms/platforms.test.ts`.

## Development

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit tests, every mock rendered, and a smoke test of the whole app
npm run lint
npm run build      # type check, then the static site in dist/
```

## Deploying to Netlify

Connect the repository and leave the build settings empty in the Netlify UI: `netlify.toml` is the
source of truth (`npm run build`, publish `dist`, Node 24). `public/_redirects` answers every path
with `index.html` so platform links work, but returns a real 404 for missing files under
`/assets/`. The headers set long caching for hashed assets and a Content-Security-Policy that
only lets the page talk to its own origin.
