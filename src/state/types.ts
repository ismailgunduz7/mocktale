export type Lang = 'tr' | 'en';
export type Theme = 'light' | 'dark';
export type Device = 'ios' | 'android';

/** AI assistants share one conversation, messaging apps another. */
export type Category = 'ai' | 'chat';

/** `me` is the person holding the phone (or asking the AI), `them` the other side. */
export type Side = 'me' | 'them';

/** What the other phone reported back about a sent message. */
export type Receipt = 'sent' | 'delivered' | 'read';

export type PlatformId =
  | 'gemini'
  | 'chatgpt'
  | 'claude'
  | 'whatsapp'
  | 'imessage'
  | 'iphone-sms'
  | 'android-sms';

export interface Message {
  id: string;
  /** A divider is a date line between messages ("Bugün"); it has text and nothing else. */
  kind: 'message' | 'divider';
  side: Side;
  text: string;
  /** Data URLs of downscaled photos. They live in memory only and die with the tab. */
  images: string[];
  /** 24-hour "HH:MM"; each platform formats it the way a phone in the mock's language would. */
  time: string;
  receipt: Receipt;
}

export type FrameId = 'auto' | 'screen' | 'ig45' | 'ig34' | 'ig11' | 'story';

/** `fit` follows the preview area, which is how a phone shows its own screen size. */
export type WidthChoice = 'fit' | number;

export type Scale = 1 | 2 | 3;

/** A text that differs by the mock's language, or one text for both. */
export type Localized = string | { tr: string; en: string };

export const localize = (v: Localized, lang: Lang): string => (typeof v === 'string' ? v : v[lang]);
