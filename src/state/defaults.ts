import { uid } from '@/lib/id';
import type { Category, Lang, Message, Receipt, Side } from './types';

export function newMessage(side: Side, text = '', time = '', receipt: Receipt = 'read'): Message {
  return { id: uid(), kind: 'message', side, text, images: [], time, receipt };
}

export function newDivider(text: string): Message {
  return { id: uid(), kind: 'divider', side: 'them', text, images: [], time: '', receipt: 'read' };
}

const AI: Record<Lang, [string, string]> = {
  tr: [
    "İstanbul'da hafta sonu için 3 öneri verir misin?",
    [
      "Tabii, İstanbul'da hafta sonunu dolu dolu geçirmek için üç öneri:",
      '',
      "1. **Balat ve Fener'de yürüyüş:** Renkli evlerin arasındaki yokuşlarda kaybol, sonra mahallenin küçük kahvaltıcılarından birinde mola ver.",
      "2. **Kadıköy'den Moda'ya:** Çarşıda atıştırarak dolaş, gün batımını Moda sahilinde izle.",
      "3. **Vapurla Boğaz turu:** Eminönü'nden kalkan kısa tur, şehri sudan görmenin en kolay yolu.",
      '',
      'Bütçeni ya da kimlerle gideceğini söylersen listeyi daraltabilirim.'
    ].join('\n')
  ],
  en: [
    'Can you give me 3 ideas for a weekend in Istanbul?',
    [
      'Sure, here are three ways to fill a weekend in Istanbul:',
      '',
      '1. **Walk around Balat and Fener:** Wander the steep streets of colourful houses, then stop for breakfast at one of the small cafés.',
      '2. **Kadıköy to Moda:** Snack your way through the market and watch the sunset from the Moda shore.',
      '3. **Bosphorus by ferry:** The short tour from Eminönü is the easiest way to see the city from the water.',
      '',
      'Tell me your budget or who you are going with and I can narrow it down.'
    ].join('\n')
  ]
};

const CHAT: Record<Lang, { day: string; lines: [Side, string, string][] }> = {
  tr: {
    day: 'Bugün',
    lines: [
      ['them', 'Akşam hâlâ müsait misin?', '09:38'],
      ['me', 'Evet! Saat kaçta buluşalım?', '09:39'],
      ['them', "7 gibi Kadıköy'de olur mu?", '09:40'],
      ['me', 'Olur, iskelede görüşürüz 👋', '09:41']
    ]
  },
  en: {
    day: 'Today',
    lines: [
      ['them', 'Are you still free tonight?', '09:38'],
      ['me', 'Yes! What time works for you?', '09:39'],
      ['them', 'How about 7 in Kadıköy?', '09:40'],
      ['me', 'Perfect, see you at the pier 👋', '09:41']
    ]
  }
};

/** The conversation a new visitor starts from, in the mock's language. */
export function defaultThread(category: Category, lang: Lang): Message[] {
  if (category === 'ai') {
    const [question, answer] = AI[lang];
    return [newMessage('me', question), newMessage('them', answer)];
  }
  const { day, lines } = CHAT[lang];
  return [newDivider(day), ...lines.map(([side, text, time]) => newMessage(side, text, time, 'read'))];
}
