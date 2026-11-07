# Working agreement for agents

Rules for any AI agent (or human) changing this repository. [README.md](README.md) explains how the
site works; this file is what must stay true while you change it.

## The promise: nothing leaves the tab

mocktale draws fake chat screenshots for people who will type real names, real messages and their
own photos into it. The site promises that none of that is sent anywhere or kept anywhere. Every
change has to keep that promise.

- **No server side.** No Netlify Functions, forms, edge functions or databases. The build is static
  files and nothing else.
- **No network calls with content.** The only runtime fetches are the site's own font files, made
  by the exporter. No analytics, no error reporting, no third-party scripts, styles, fonts or
  images, no CDNs. Everything is bundled by Vite and served from this origin.
- **No persistence of content.** No `localStorage`, `sessionStorage`, IndexedDB, Cache API or
  cookies for anything the visitor typed or picked. State lives in `src/state/store.ts` and dies
  with the tab. The one storage write in the code base is the Netlify badge flag in
  `src/main.ts`, and it holds nothing personal.
- **Photos stay in memory.** They are read with `FileReader`/canvas in `src/lib/images.ts` and kept
  as data URLs. Re-encoding drops their metadata.
- **The CSP is the enforcement.** `netlify.toml` sets `default-src 'none'` and `connect-src 'self'`.
  Do not loosen it to make something work; if a feature needs another origin, it does not belong
  here.

## Mocks

- Each platform lives in `src/platforms/<name>/`: a component, a stylesheet and a definition
  (`index.ts`) with its settings fields. `src/platforms/index.ts` lists them.
- A mock's stylesheet is imported with `?inline` and must be self-contained: selectors start with
  `.shot.<root class>`, nothing depends on the page around it. The same text styles the preview
  and travels inside the exported SVG, which is how the PNG matches the preview.
- A mock renders three parts: `.mt-top`, `.mt-body > .mt-scroll > <thread>`, `.mt-bottom`. Fixed
  frames (phone screen, Instagram) rely on that shape; `src/shot/base.css` has the rules.
- `src/styles/app.css` styles the editor only and must never reach into `.shot`.
- Mock UI strings follow the mock's language (`ctx.lang`, Turkish or English), not the editor's.

## Fonts

- Fonts are registered in `src/fonts/registry.ts` through the FontFace API, from open-licence
  Fontsource packages. The exporter packs exactly the faces the preview loaded.
- Gemini and Google Messages use Google Sans Flex and offer no font choice. Keep it that way.
- Proprietary fonts (SF Pro, Anthropic's, OpenAI's, Samsung's) are never committed without a web
  licence. Stacks already name them first; adding a licensed file to the registry is enough.
- Every font that ships is listed with its licence in `public/licenses.txt`.

## Copy and code

- The interface is in Turkish; code, identifiers, comments and commit messages are in English.
- Write interface copy the way a person would say it. No filler, no em dashes.
- Keep `npm run build`, `npm test` and `npm run lint` passing. The build runs `vue-tsc` first.
- Update README.md and this file in the same commit as the behaviour they describe.
