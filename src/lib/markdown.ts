import { escapeHtml } from './text';

/**
 * The Markdown an AI answer is written in, turned into the HTML the mocks style. It is a small
 * parser on purpose: headings, paragraphs, nested lists, quotes, tables, fenced code and the
 * usual inline marks. Everything is escaped first, so typed HTML shows up as text.
 */

export interface MarkdownOptions {
  /** Markup put at the top of a fenced code block, given the escaped language label. */
  codeHead?: (lang: string) => string;
}

const ITEM = /^\s*([-*+•]|\d+[.)])\s+(.*)$/;
const HEAD = /^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$/;
const HR = /^\s{0,3}([-*_])(\s*\1){2,}\s*$/;
const FENCE = /^\s{0,3}(`{3,}|~{3,})\s*([^`\s]*)\s*$/;
const QUOTE = /^\s{0,3}>\s?(.*)$/;
const TABLE_SEP = /^\s*\|?\s*:?-+:?\s*(?:\|\s*:?-+:?\s*)+\|?\s*$/;

const indentOf = (s: string): number => (/^\s*/.exec(s)?.[0] ?? '').replace(/\t/g, '    ').length;
const isItem = (l: string): boolean => ITEM.test(l) && !HR.test(l);

/** Inline marks of one line: `code`, **bold**, *italic*, ~~struck~~, [links](…) and [[places]]. */
export function inline(src: string): string {
  const kept: string[] = [];
  const keep = (html: string): string => `\u0000${kept.push(html) - 1}\u0000`;
  const s = escapeHtml(src)
    .replace(/`([^`]+)`/g, (_, c: string) => keep(`<code>${c}</code>`))
    // Gemini underlines places and names it can search for with a dotted line.
    .replace(/\[\[(.+?)\]\]/g, '<span class="ent">$1</span>')
    // A link keeps only its text: a picture has nothing to navigate to.
    .replace(/\[([^\]]+)\]\(([^)\s]*)\)/g, '<a>$1</a>')
    .replace(/\*\*(?=\S)(.*?\S)\*\*/g, '<strong>$1</strong>')
    .replace(/__(?=\S)(.*?\S)__/g, '<strong>$1</strong>')
    .replace(/~~(?=\S)(.*?\S)~~/g, '<del>$1</del>')
    .replace(/(^|[^*\p{L}\p{N}])\*(?=\S)([^*\n]*?\S)\*(?!\*)/gu, '$1<em>$2</em>')
    .replace(/(^|[^_\p{L}\p{N}])_(?=\S)([^_\n]*?\S)_(?![_\p{L}\p{N}])/gu, '$1<em>$2</em>');
  return s.replace(/\u0000(\d+)\u0000/g, (_, k: string) => kept[Number(k)] ?? '');
}

/** The cells of a table row; `\|` is a literal bar inside a cell. */
function cells(row: string): string[] {
  let r = row.trim();
  if (r.startsWith('|')) r = r.slice(1);
  if (r.endsWith('|') && !r.endsWith('\\|')) r = r.slice(0, -1);
  const out: string[] = [];
  let cur = '';
  for (let k = 0; k < r.length; k++) {
    const ch = r[k];
    if (ch === '\\' && r[k + 1] === '|') {
      cur += '|';
      k++;
    } else if (ch === '|') {
      out.push(cur.trim());
      cur = '';
    } else {
      cur += ch;
    }
  }
  out.push(cur.trim());
  return out;
}

export function renderMarkdown(src: string, opts: MarkdownOptions = {}): string {
  const L = src.replace(/\r/g, '').split('\n');
  let i = 0;
  const line = (k: number): string => L[k] ?? '';
  const isTableStart = (k: number): boolean =>
    k + 1 < L.length && line(k).includes('|') && TABLE_SEP.test(line(k + 1));
  const startsBlock = (k: number): boolean =>
    HEAD.test(line(k)) || HR.test(line(k)) || FENCE.test(line(k)) || QUOTE.test(line(k)) || isTableStart(k);

  // A list. Blank lines between items do not end it; lines under an item belong to the item,
  // and a more indented marker starts a nested list.
  function list(base: number): string {
    const first = ITEM.exec(line(i));
    const mark = first?.[1] ?? '-';
    const ordered = /\d/.test(mark);
    let html = '';
    while (i < L.length) {
      const m = ITEM.exec(line(i));
      if (!m || !isItem(line(i)) || indentOf(line(i)) !== base || /\d/.test(m[1] ?? '') !== ordered) break;
      i++;
      const blocks: string[][] = [[m[2] ?? '']];
      let sub = '';
      while (i < L.length) {
        if (!line(i).trim()) {
          let k = i;
          while (k < L.length && !line(k).trim()) k++;
          i = k;
          if (k < L.length && indentOf(line(k)) > base && !HR.test(line(k))) {
            if (!isItem(line(k))) blocks.push([]);
            continue;
          }
          break;
        }
        const l = line(i);
        if (isItem(l)) {
          if (indentOf(l) > base) {
            sub += list(indentOf(l));
            continue;
          }
          break;
        }
        if (startsBlock(i)) break;
        blocks[blocks.length - 1]?.push(l.trim());
        i++;
      }
      const parts = blocks.filter((b) => b.length).map((b) => b.map(inline).join('<br>'));
      html += `<li>${parts[0] ?? ''}${parts
        .slice(1)
        .map((p) => `<p>${p}</p>`)
        .join('')}${sub}</li>`;
    }
    if (!ordered) return `<ul>${html}</ul>`;
    const start = parseInt(mark, 10) || 1;
    // Both the native start and the counter Gemini draws its own numbers with.
    return `<ol${start !== 1 ? ` start="${start}"` : ''} style="counter-reset:n ${start - 1}">${html}</ol>`;
  }

  function code(): string {
    const m = FENCE.exec(line(i));
    const fence = m?.[1] ?? '```';
    const lang = escapeHtml(m?.[2] ?? '');
    const close = new RegExp(`^\\s{0,3}${fence[0] === '~' ? '~' : '`'}{${fence.length},}\\s*$`);
    const body: string[] = [];
    i++;
    while (i < L.length && !close.test(line(i))) body.push(line(i++));
    i++;
    const head = opts.codeHead ? opts.codeHead(lang) : '';
    return `<div class="code"${lang ? ` data-lang="${lang}"` : ''}>${head}<pre><code>${escapeHtml(body.join('\n'))}</code></pre></div>`;
  }

  function table(): string {
    const head = cells(line(i));
    const aligns = cells(line(i + 1)).map((c) =>
      c.startsWith(':') && c.endsWith(':') ? 'c' : c.endsWith(':') ? 'r' : ''
    );
    i += 2;
    const rows: string[][] = [];
    while (i < L.length && line(i).trim() && line(i).includes('|')) rows.push(cells(line(i++)));
    const cell = (tag: string, text: string, k: number): string =>
      `<${tag}${aligns[k] ? ` class="al-${aligns[k]}"` : ''}>${inline(text)}</${tag}>`;
    const thead = `<tr>${head.map((c, k) => cell('th', c, k)).join('')}</tr>`;
    const tbody = rows.map((r) => `<tr>${head.map((_, k) => cell('td', r[k] ?? '', k)).join('')}</tr>`).join('');
    return `<div class="table"><table><thead>${thead}</thead><tbody>${tbody}</tbody></table></div>`;
  }

  const out: string[] = [];
  while (i < L.length) {
    const l = line(i);
    let m: RegExpExecArray | null;
    if (!l.trim()) {
      i++;
    } else if (FENCE.test(l)) {
      out.push(code());
    } else if (HR.test(l)) {
      out.push('<hr>');
      i++;
    } else if ((m = HEAD.exec(l))) {
      const level = Math.min((m[1] ?? '#').length, 4);
      out.push(`<h${level}>${inline(m[2] ?? '')}</h${level}>`);
      i++;
    } else if (isTableStart(i)) {
      out.push(table());
    } else if (QUOTE.test(l)) {
      const inner: string[] = [];
      while (i < L.length && QUOTE.test(line(i))) inner.push(QUOTE.exec(line(i++))?.[1] ?? '');
      out.push(`<blockquote>${renderMarkdown(inner.join('\n'), opts)}</blockquote>`);
    } else if (isItem(l)) {
      out.push(list(indentOf(l)));
    } else {
      const p: string[] = [];
      while (i < L.length && line(i).trim() && !isItem(line(i)) && !startsBlock(i)) p.push(line(i++).trim());
      out.push(`<p>${p.map(inline).join('<br>')}</p>`);
    }
  }
  return out.join('');
}
