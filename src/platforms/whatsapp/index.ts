import type { PlatformDef } from '@/platforms/types';
import WhatsApp from './WhatsApp.vue';
import css from './whatsapp.css?inline';

export const whatsapp: PlatformDef = {
  id: 'whatsapp',
  slug: 'whatsapp',
  name: 'WhatsApp',
  category: 'chat',
  swatch: '#25d366',
  rootClass: 'p-wa',
  component: WhatsApp,
  css,
  device: 'choice',
  anchor: 'top',
  times: true,
  receipts: 'each',
  themLabel: (s) => String(s.name ?? ''),
  formatHint: "*kalın*, _italik_, ~üstü çizili~ ve `kod` WhatsApp'taki gibi görünür.",
  fields: [
    {
      type: 'choice',
      key: 'device',
      label: 'Telefon',
      default: 'ios',
      options: [
        { value: 'ios', label: 'iPhone' },
        { value: 'android', label: 'Android' }
      ]
    },
    { type: 'text', key: 'name', label: 'Kişi adı', default: { tr: 'Elif', en: 'Emma' }, maxlength: 40 },
    { type: 'text', key: 'subtitle', label: 'Adın altındaki yazı', default: { tr: 'çevrimiçi', en: 'online' }, maxlength: 60 },
    { type: 'image', key: 'avatar', label: 'Profil fotoğrafı', round: true },
    { type: 'text', key: 'unread', label: 'Okunmamış sayısı', default: '', placeholder: 'Örneğin 3', maxlength: 4 },
    {
      type: 'choice',
      key: 'wallpaper',
      label: 'Duvar kâğıdı',
      default: 'default',
      options: [
        { value: 'default', label: 'Düz renk' },
        { value: 'image', label: 'Kendi görselin' }
      ]
    },
    { type: 'image', key: 'wallpaperImage', label: 'Görsel', when: (s) => s.wallpaper === 'image' },
    { type: 'toggle', key: 'showEncryption', label: 'Şifreleme notu', default: false },
    { type: 'toggle', key: 'showTop', label: 'Kişi başlığı', default: true },
    { type: 'toggle', key: 'showComposer', label: 'Yazma alanı', default: true },
    { type: 'toggle', key: 'statusBar', label: 'Durum çubuğu', default: true, section: 'look' }
  ]
};
