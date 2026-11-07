import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { describe, expect, it } from 'vitest';
import { newDivider, newMessage, defaultThread } from '@/state/defaults';
import { resolveSettings } from '@/state/store';
import type { Device, Lang, Message, Theme } from '@/state/types';
import { PLATFORMS } from '.';
import type { PlatformDef, Settings } from './types';

const PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

/** Whether some element carries all of these classes, in any order. */
const hasClasses = (html: string, ...names: string[]): boolean =>
  Array.from(html.matchAll(/class="([^"]*)"/g)).some((m) => {
    const list = (m[1] ?? '').split(/\s+/);
    return names.every((n) => list.includes(n));
  });

async function render(
  p: PlatformDef,
  overrides: Settings,
  messages: Message[],
  opts: { theme?: Theme; lang?: Lang; device?: Device } = {}
): Promise<string> {
  const lang = opts.lang ?? 'tr';
  const ctx = {
    s: resolveSettings(p, overrides, lang),
    messages,
    theme: opts.theme ?? 'light',
    lang,
    status: { show: true, device: opts.device ?? 'ios', time: '9:41', battery: 15 }
  };
  return renderToString(createSSRApp({ render: () => h(p.component, { ctx }) }));
}

describe('every platform draws its default conversation', () => {
  for (const p of PLATFORMS) {
    for (const lang of ['tr', 'en'] as Lang[]) {
      for (const theme of ['light', 'dark'] as Theme[]) {
        it(`${p.id}, ${lang}, ${theme}`, async () => {
          const thread = defaultThread(p.category, lang);
          const html = await render(p, { statusBar: true }, thread, { lang, theme });
          expect(html).toContain('mt-top');
          expect(html).toContain('mt-body');
          // The first message reaches the mock.
          const first = thread.find((m) => m.kind === 'message')?.text ?? '';
          expect(html).toContain(first.slice(-12));
        });
      }
    }
  }
});

describe('platform details', () => {
  const byId = (id: string): PlatformDef => {
    const p = PLATFORMS.find((x) => x.id === id);
    if (!p) throw new Error(id);
    return p;
  };
  const chat = [
    newDivider('Bugün'),
    newMessage('them', 'Selam', '09:40'),
    { ...newMessage('me', 'Fotoğraf', '09:41', 'delivered'), images: [PIXEL] },
    newMessage('me', '👋', '09:42', 'read')
  ];

  it('iMessage labels the service, shows Read with its time and tails the last bubble', async () => {
    const html = await render(byId('imessage'), {}, chat);
    expect(html).toContain('iMessage');
    expect(html).toContain('Okundu');
    expect(html).toContain('09:42');
    expect(html).toContain('im-tail');
    expect(html).toContain('jumbo');
  });

  it('iPhone SMS says Text Message and shows no read receipt', async () => {
    const html = await render(byId('iphone-sms'), {}, chat, { lang: 'en' });
    expect(html).toContain('Text Message');
    expect(html).not.toContain('Read');
  });

  it('iOS 18 style draws the classic bar with the unread count', async () => {
    const html = await render(byId('imessage'), { style: 'ios18', unread: '12' }, chat);
    expect(html).toContain('im-nav18');
    expect(html).toContain('12');
  });

  it('WhatsApp puts ticks on its own messages and switches to Android', async () => {
    const ios = await render(byId('whatsapp'), {}, chat);
    expect(hasClasses(ios, 'wa-tick', 'read')).toBe(true);
    expect(hasClasses(ios, 'wa-tail', 'bottom')).toBe(true);
    const android = await render(byId('whatsapp'), { device: 'android', showEncryption: true }, chat, { device: 'android' });
    expect(hasClasses(android, 'wa-tail', 'top')).toBe(true);
    expect(android).toContain('wa-fab');
    expect(android).toContain('uçtan uca şifrelidir');
  });

  it('Google Messages groups runs and writes the status under the last message', async () => {
    const html = await render(byId('android-sms'), { service: 'rcs', showTyping: true }, chat, { device: 'android' });
    expect(hasClasses(html, 'gm-thread', 'rcs')).toBe(true);
    expect(html).toContain('09:42 • Okundu');
    expect(html).toContain('Bugün • 09:40');
    expect(html).toContain('gm-typing');
  });

  it('Claude honours the chat font and the classic user style', async () => {
    const thread = defaultThread('ai', 'tr');
    const html = await render(byId('claude'), { font: 'dyslexic', userStyle: 'classic', userName: 'ilknur ışık' }, thread);
    expect(html).toContain('f-dyslexic');
    expect(html).toContain('İI');
  });

  it('Gemini renders Markdown answers and hides the model label when empty', async () => {
    const html = await render(byId('gemini'), { model: ' ' }, [
      newMessage('me', 'Soru'),
      newMessage('them', '1. **Bir**\n2. İki\n\n```py\nprint(1)\n```')
    ]);
    expect(html).toContain('<strong>Bir</strong>');
    expect(html).toContain('code-head');
    expect(html).not.toContain('g-model');
  });
});
