import type { PlatformDef } from '@/platforms/types';
import Claude from './Claude.vue';
import css from './claude.css?inline';

export const claude: PlatformDef = {
  id: 'claude',
  slug: 'claude',
  name: 'Claude',
  category: 'ai',
  swatch: '#d97757',
  component: Claude,
  css,
  device: 'choice',
  anchor: 'top',
  times: false,
  receipts: 'none',
  themLabel: () => 'Claude',
  formatHint: 'Yanıtlarda **kalın**, *italik*, `kod`, listeler, # başlıklar, tablolar ve ``` kod blokları kullanabilirsin.',
  fields: [
    {
      type: 'text',
      key: 'title',
      label: 'Sohbet başlığı',
      default: { tr: "İstanbul'da hafta sonu", en: 'Weekend in Istanbul' },
      maxlength: 60
    },
    { type: 'text', key: 'model', label: 'Model', default: 'Sonnet 5.5', maxlength: 32 },
    {
      type: 'choice',
      key: 'font',
      label: 'Sohbet yazı tipi',
      default: 'default',
      hint: "Claude'un kendi ayarındaki seçenekler. Varsayılan, yanıtları tırnaklı yazar.",
      options: [
        { value: 'default', label: 'Varsayılan' },
        { value: 'sans', label: 'Sans' },
        { value: 'system', label: 'Sistem' },
        { value: 'dyslexic', label: 'Disleksi dostu' }
      ]
    },
    {
      type: 'choice',
      key: 'userStyle',
      label: 'Senin mesajların',
      default: 'bubble',
      options: [
        { value: 'bubble', label: 'Sağda balon' },
        { value: 'classic', label: 'Solda, baş harfli' }
      ]
    },
    {
      type: 'text',
      key: 'userName',
      label: 'Adın',
      default: { tr: 'Ayşe Demir', en: 'Alex Morgan' },
      hint: 'Yalnızca baş harfleri görünür.',
      when: (s) => s.userStyle === 'classic'
    },
    { type: 'text', key: 'placeholder', label: 'Giriş kutusundaki yazı', default: { tr: "Claude'a yanıt ver…", en: 'Reply to Claude…' } },
    { type: 'toggle', key: 'showSpark', label: 'Son yanıtın altında Claude işareti', default: true },
    { type: 'toggle', key: 'showActions', label: 'Son yanıtın altındaki simgeler', default: true },
    { type: 'toggle', key: 'showTop', label: 'Üst çubuk', default: true },
    { type: 'toggle', key: 'showComposer', label: 'Giriş kutusu', default: true },
    { type: 'toggle', key: 'showFooter', label: 'Uyarı satırı', default: false },
    {
      type: 'text',
      key: 'footer',
      label: 'Uyarı metni',
      default: {
        tr: 'Claude hata yapabilir. Lütfen yanıtları iki kez kontrol edin.',
        en: 'Claude can make mistakes. Please double-check responses.'
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
