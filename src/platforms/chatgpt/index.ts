import type { PlatformDef } from '@/platforms/types';
import ChatGPT from './ChatGPT.vue';
import css from './chatgpt.css?inline';

export const chatgpt: PlatformDef = {
  id: 'chatgpt',
  slug: 'chatgpt',
  name: 'ChatGPT',
  category: 'ai',
  swatch: '#0d0d0d',
  component: ChatGPT,
  css,
  device: 'choice',
  anchor: 'top',
  times: false,
  receipts: 'none',
  themLabel: () => 'ChatGPT',
  formatHint: 'Yanıtlarda **kalın**, *italik*, `kod`, listeler, # başlıklar, tablolar ve ``` kod blokları kullanabilirsin.',
  fields: [
    { type: 'text', key: 'title', label: 'Başlık', default: 'ChatGPT', maxlength: 32, hint: 'Model adını da yazabilirsin.' },
    { type: 'text', key: 'placeholder', label: 'Giriş kutusundaki yazı', default: { tr: 'Herhangi bir şey sor', en: 'Ask anything' } },
    { type: 'toggle', key: 'showActions', label: 'Son yanıtın altındaki simgeler', default: true },
    { type: 'toggle', key: 'showTop', label: 'Üst çubuk', default: true },
    { type: 'toggle', key: 'showComposer', label: 'Giriş kutusu', default: true },
    { type: 'toggle', key: 'showFooter', label: 'Uyarı satırı', default: false },
    {
      type: 'text',
      key: 'footer',
      label: 'Uyarı metni',
      default: {
        tr: 'ChatGPT hata yapabilir. Önemli bilgileri kontrol edin.',
        en: 'ChatGPT can make mistakes. Check important info.'
      },
      when: (s) => s.showFooter === true
    },
    { type: 'toggle', key: 'statusBar', label: 'Durum çubuğu', default: false, section: 'look' },
    {
      type: 'choice',
      key: 'device',
      label: 'Cihaz',
      default: 'ios',
      section: 'look',
      options: [
        { value: 'ios', label: 'iPhone' },
        { value: 'android', label: 'Android' }
      ],
      when: (s) => s.statusBar === true
    }
  ]
};
