import { describe, expect, it } from 'vitest';
import { inline, renderMarkdown } from './markdown';

describe('inline marks', () => {
  it('escapes HTML before anything else', () => {
    expect(inline('<b>x</b> & "y"')).toBe('&lt;b&gt;x&lt;/b&gt; &amp; &quot;y&quot;');
  });

  it('applies bold, italic, strikethrough and code', () => {
    expect(inline('**bold** and *it* and ~~gone~~ and `a*b*c`')).toBe(
      '<strong>bold</strong> and <em>it</em> and <del>gone</del> and <code>a*b*c</code>'
    );
  });

  it('leaves snake_case and arithmetic alone', () => {
    expect(inline('my_var_name and 2*3*4')).toBe('my_var_name and 2*3*4');
  });

  it('keeps only the text of a link and marks places', () => {
    expect(inline('[Moda](https://example.com) ve [[Galata Kulesi]]')).toBe(
      '<a>Moda</a> ve <span class="ent">Galata Kulesi</span>'
    );
  });

  it('handles Turkish letters around italics', () => {
    expect(inline('*çok* güzel')).toBe('<em>çok</em> güzel');
  });
});

describe('blocks', () => {
  it('makes headings, paragraphs and rules', () => {
    expect(renderMarkdown('# Başlık\nbir\niki\n\n---\n### Alt')).toBe(
      '<h1>Başlık</h1><p>bir<br>iki</p><hr><h3>Alt</h3>'
    );
  });

  it('keeps an ordered list together across blank lines and numbers from its start', () => {
    const html = renderMarkdown('3. üç\n\n4. dört');
    expect(html).toBe('<ol start="3" style="counter-reset:n 2"><li>üç</li><li>dört</li></ol>');
  });

  it('nests lists and attaches lines under an item to it', () => {
    const html = renderMarkdown('- bir\n  devamı\n  - alt madde\n- iki');
    expect(html).toBe('<ul><li>bir<br>devamı<ul><li>alt madde</li></ul></li><li>iki</li></ul>');
  });

  it('turns a fenced block into code with its language', () => {
    const html = renderMarkdown('```js\nconst a = 1 < 2;\n```', { codeHead: (l) => `<i>${l}</i>` });
    expect(html).toBe('<div class="code" data-lang="js"><i>js</i><pre><code>const a = 1 &lt; 2;</code></pre></div>');
  });

  it('builds a table with alignment', () => {
    const html = renderMarkdown('| Yer | Puan |\n|:---|---:|\n| Moda | 9 |\n| Balat \\| Fener | 8 |');
    expect(html).toContain('<th>Yer</th><th class="al-r">Puan</th>');
    expect(html).toContain('<td>Balat | Fener</td><td class="al-r">8</td>');
  });

  it('renders quotes recursively', () => {
    expect(renderMarkdown('> **not**\n> ikinci')).toBe('<blockquote><p><strong>not</strong><br>ikinci</p></blockquote>');
  });
});
