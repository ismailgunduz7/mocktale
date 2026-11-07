import type { PlatformDef } from '@/platforms/types';
import css from './gemini.css?inline';
import Gemini from './Gemini.vue';

export const gemini: PlatformDef = {
  id: 'gemini',
  slug: 'gemini',
  name: 'Gemini',
  category: 'ai',
  swatch: 'linear-gradient(135deg, #4f8df5, #a46cf0 60%, #f06c8c)',
  component: Gemini,
  css,
  device: 'choice',
  anchor: 'top',
  times: false,
  receipts: 'none',
  themLabel: (s) => String(s.assistantName ?? ''),
  formatHint:
    'Yanıtlarda **kalın**, *italik*, `kod`, - liste, 1. liste, ### başlık, tablo ve ``` kod bloğu kullanabilirsin. [[yer adı]] noktalı alt çizgi ekler.',
  fields: [
    { type: 'text', key: 'assistantName', label: 'Asistan adı', default: 'Gemini', maxlength: 24 },
    { type: 'text', key: 'model', label: 'Model etiketi', default: 'Pro', maxlength: 24, hint: 'Adın yanında soluk yazılır; boş bırakabilirsin.' },
    { type: 'text', key: 'placeholder', label: 'Giriş kutusundaki yazı', default: { tr: "Gemini'a sorun", en: 'Ask Gemini' } },
    { type: 'text', key: 'footer', label: 'Alt bilgi', default: '', placeholder: 'Boş bırakırsan görünmez' },
    { type: 'toggle', key: 'showTop', label: 'Üst çubuk', default: true },
    { type: 'toggle', key: 'showComposer', label: 'Giriş kutusu', default: true },
    { type: 'toggle', key: 'showAssistantIcon', label: 'Yanıtların solunda simge', default: false },
    {
      type: 'image',
      key: 'assistantIcon',
      label: 'Simge',
      round: true,
      hint: 'Seçmezsen asistan adının baş harfi görünür.',
      when: (s) => s.showAssistantIcon === true
    },
    { type: 'toggle', key: 'showAvatar', label: 'Sağ üstte profil', default: false, hint: '⋮ simgesinin yerine geçer.' },
    { type: 'text', key: 'userLetter', label: 'Profil harfi', default: 'A', maxlength: 2, when: (s) => s.showAvatar === true },
    { type: 'image', key: 'userAvatar', label: 'Profil fotoğrafı', round: true, when: (s) => s.showAvatar === true },
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
