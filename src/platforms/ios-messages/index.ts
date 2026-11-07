import type { Field, PlatformDef } from '@/platforms/types';
import css from './ios-messages.css?inline';
import IosMessages from './IosMessages.vue';

const contact: Field[] = [
  {
    type: 'choice',
    key: 'style',
    label: 'iOS görünümü',
    default: 'ios26',
    options: [
      { value: 'ios26', label: 'iOS 26' },
      { value: 'ios18', label: 'iOS 18 ve öncesi' }
    ]
  },
  { type: 'text', key: 'name', label: 'Kişi adı', default: { tr: 'Elif', en: 'Emma' }, maxlength: 40 },
  { type: 'image', key: 'avatar', label: 'Profil fotoğrafı', round: true, hint: 'Seçmezsen baş harfler görünür.' },
  {
    type: 'text',
    key: 'unread',
    label: 'Okunmamış sayısı',
    default: '',
    placeholder: 'Örneğin 3',
    maxlength: 4,
    when: (s) => s.style === 'ios18'
  }
];

const rest: Field[] = [
  { type: 'toggle', key: 'showTyping', label: 'Yazıyor balonu', default: false },
  { type: 'toggle', key: 'showTop', label: 'Kişi başlığı', default: true },
  { type: 'toggle', key: 'showComposer', label: 'Yazma alanı', default: true },
  { type: 'toggle', key: 'statusBar', label: 'Durum çubuğu', default: true, section: 'look' }
];

const base = {
  category: 'chat',
  component: IosMessages,
  css,
  device: 'ios',
  anchor: 'top',
  times: true,
  receipts: 'last',
  themLabel: (s) => String(s.name ?? '')
} satisfies Partial<PlatformDef>;

export const imessage: PlatformDef = {
  ...base,
  id: 'imessage',
  slug: 'imessage',
  name: 'iMessage',
  swatch: '#0a84ff',
  rootClass: 'p-ios',
  fields: [...contact, ...rest]
};

export const iphoneSms: PlatformDef = {
  ...base,
  id: 'iphone-sms',
  slug: 'iphone-sms',
  name: 'iPhone SMS',
  swatch: '#34c759',
  rootClass: 'p-ios sms',
  fields: [
    ...contact,
    {
      type: 'choice',
      key: 'service',
      label: 'Tür',
      default: 'sms',
      hint: "RCS de yeşil görünür; okundu bilgisi yalnızca RCS ve iMessage'da çıkar.",
      options: [
        { value: 'sms', label: 'SMS' },
        { value: 'rcs', label: 'RCS' }
      ]
    },
    ...rest
  ]
};
