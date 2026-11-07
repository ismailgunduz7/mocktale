import type { PlatformDef } from '@/platforms/types';
import css from './google-messages.css?inline';
import GoogleMessages from './GoogleMessages.vue';

export const androidSms: PlatformDef = {
  id: 'android-sms',
  slug: 'android-sms',
  name: 'Android SMS',
  note: 'Google Mesajlar',
  category: 'chat',
  swatch: '#0b57d0',
  rootClass: 'p-gm',
  component: GoogleMessages,
  css,
  device: 'android',
  anchor: 'bottom',
  times: true,
  receipts: 'last',
  themLabel: (s) => String(s.name ?? ''),
  fields: [
    { type: 'text', key: 'name', label: 'Kişi adı', default: { tr: 'Elif', en: 'Emma' }, maxlength: 40 },
    { type: 'image', key: 'avatar', label: 'Profil fotoğrafı', round: true, hint: 'Seçmezsen baş harf görünür.' },
    {
      type: 'choice',
      key: 'service',
      label: 'Tür',
      default: 'sms',
      hint: 'Gönderdiğin SMS açık mavi, RCS mesajı koyu mavi görünür.',
      options: [
        { value: 'sms', label: 'SMS' },
        { value: 'rcs', label: 'RCS' }
      ]
    },
    { type: 'toggle', key: 'showTyping', label: 'Yazıyor balonu', default: false },
    { type: 'toggle', key: 'showTop', label: 'Kişi başlığı', default: true },
    { type: 'toggle', key: 'showComposer', label: 'Yazma alanı', default: true },
    { type: 'toggle', key: 'statusBar', label: 'Durum çubuğu', default: true, section: 'look' }
  ]
};
