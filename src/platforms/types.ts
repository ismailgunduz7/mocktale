import type { Component } from 'vue';
import type { Category, Device, Lang, Localized, Message, PlatformId, Theme } from '@/state/types';

export type Settings = Record<string, unknown>;

interface FieldBase {
  key: string;
  label: string;
  hint?: string;
  /** Shown only while this holds for the current settings. */
  when?: (s: Settings) => boolean;
  /**
   * `look` fields (status bar, device) are drawn in the shared Görünüm section; the rest in the
   * platform's own section.
   */
  section?: 'platform' | 'look';
}

export type Field =
  | (FieldBase & { type: 'text'; default: Localized; placeholder?: string; maxlength?: number })
  | (FieldBase & { type: 'toggle'; default: boolean })
  | (FieldBase & { type: 'choice'; default: string; options: { value: string; label: string }[] })
  | (FieldBase & { type: 'image'; round?: boolean });

/** Everything a mock component needs to draw itself. */
export interface ShotContext {
  s: Settings;
  messages: Message[];
  theme: Theme;
  lang: Lang;
  status: { show: boolean; device: Device; time: string; battery: number };
}

export interface PlatformDef {
  id: PlatformId;
  /** Path of the platform's page: /gemini, /whatsapp, … */
  slug: string;
  name: string;
  /** A second line in the picker, for names that need one ("Google Mesajlar"). */
  note?: string;
  category: Category;
  /** A small mark of the platform's colour in the picker; no logos. */
  swatch: string;
  /** Class on the mock's root; platforms sharing one stylesheet share it. Defaults to p-<id>. */
  rootClass?: string;
  component: Component;
  /** The mock's stylesheet, used on the page and inside the exported image alike. */
  css: string;
  fields: Field[];
  /** Name of the other side in the editor: the assistant, or the contact. */
  themLabel: (s: Settings, lang: Lang) => string;
  /** Status bar style; `choice` reads the platform's `device` setting. */
  device: Device | 'choice';
  /** Where a short conversation sits in a fixed frame: under the header, or above the input. */
  anchor: 'top' | 'bottom';
  /** Which per-message controls the editor offers. */
  times: boolean;
  receipts: 'each' | 'last' | 'none';
  /** A hint under the message list about text formatting, if the platform has any. */
  formatHint?: string;
}
