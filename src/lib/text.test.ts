import { describe, expect, it } from 'vitest';
import { chatHtml, initials, jumboEmojiCount, whatsappHtml } from './text';

describe('chat text', () => {
  it('escapes and underlines web addresses without their final punctuation', () => {
    expect(chatHtml('bak: www.example.com.')).toBe('bak: <span class="lnk">www.example.com</span>.');
    expect(chatHtml('<script>')).toBe('&lt;script&gt;');
  });

  it("applies WhatsApp's markers only around words", () => {
    expect(whatsappHtml('*kalın* _eğik_ ~yok~')).toBe('<b>kalın</b> <i>eğik</i> <s>yok</s>');
    expect(whatsappHtml('2 * 3 * 4')).toBe('2 * 3 * 4');
    expect(whatsappHtml('dosya_adı_burada')).toBe('dosya_adı_burada');
  });

  it('keeps code untouched by other markers', () => {
    expect(whatsappHtml('`*not bold*`')).toBe('<span class="icode">*not bold*</span>');
    expect(whatsappHtml('```a_b_c```')).toBe('<span class="mono">a_b_c</span>');
  });

  it('counts emoji-only messages up to three', () => {
    expect(jumboEmojiCount('👋')).toBe(1);
    expect(jumboEmojiCount('👍🏽❤️🇹🇷')).toBe(3);
    expect(jumboEmojiCount('👋👋👋👋')).toBe(0);
    expect(jumboEmojiCount('selam 👋')).toBe(0);
    expect(jumboEmojiCount('')).toBe(0);
  });

  it('takes initials with Turkish casing', () => {
    expect(initials('ilknur ışık', 'tr-TR')).toBe('İI');
    expect(initials('Elif', 'tr-TR')).toBe('E');
    expect(initials('  ', 'tr-TR')).toBe('');
  });
});
