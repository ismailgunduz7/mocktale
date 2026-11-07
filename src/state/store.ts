import { computed, reactive } from 'vue';
import { addMinutes } from '@/lib/time';
import { PLATFORMS, platformById } from '@/platforms';
import type { PlatformDef, Settings, ShotContext } from '@/platforms/types';
import { defaultThread, newDivider, newMessage } from './defaults';
import {
  localize,
  type Category,
  type Device,
  type FrameId,
  type Lang,
  type Message,
  type PlatformId,
  type Scale,
  type Side,
  type Theme,
  type WidthChoice
} from './types';

/**
 * All of the app's state, in memory and nowhere else. There is deliberately no persistence: no
 * localStorage, no IndexedDB, no cookies, no server. Reloading or closing the tab forgets every
 * message and photo, which is the promise the site makes; App.vue asks before a reload throws
 * away unsaved work.
 */
export interface AppState {
  platform: PlatformId;
  theme: Theme;
  lang: Lang;
  width: WidthChoice;
  frame: FrameId;
  /** Position in a fixed frame: 0 shows the start of the conversation, 1 its end. */
  scroll: number;
  scale: Scale;
  /** Status bar clock and battery, shared by every platform. */
  clock: string;
  battery: number;
  threads: Record<Category, Message[]>;
  /** A thread nobody has touched follows the mock's language; the first edit makes it theirs. */
  pristine: Record<Category, boolean>;
  /** Only what the visitor changed; everything else comes from each field's default. */
  settings: Record<PlatformId, Settings>;
  /** Changed since the last export, so leaving the page would lose something. */
  dirty: boolean;
}

const narrowScreen = (): boolean => typeof window !== 'undefined' && window.matchMedia('(max-width: 899px)').matches;

const preferredLang = (): Lang =>
  typeof navigator !== 'undefined' && !/^tr\b/i.test(navigator.language) ? 'en' : 'tr';

function initialState(): AppState {
  const lang = preferredLang();
  return {
    platform: 'gemini',
    theme: 'light',
    lang,
    width: narrowScreen() ? 'fit' : 393,
    frame: 'auto',
    scroll: 0,
    scale: 3,
    clock: '9:41',
    battery: 82,
    threads: { ai: defaultThread('ai', lang), chat: defaultThread('chat', lang) },
    pristine: { ai: true, chat: true },
    settings: Object.fromEntries(PLATFORMS.map((p) => [p.id, {}])) as Record<PlatformId, Settings>,
    dirty: false
  };
}

export const state = reactive<AppState>(initialState());

export const current = computed<PlatformDef>(() => platformById(state.platform));
export const category = computed<Category>(() => current.value.category);
export const thread = computed<Message[]>(() => state.threads[category.value]);

/** A platform's settings with defaults filled in, texts in the mock's language. */
export function resolveSettings(def: PlatformDef, overrides: Settings, lang: Lang): Settings {
  const out: Settings = {};
  for (const f of def.fields) {
    const v = overrides[f.key];
    if (v !== undefined) out[f.key] = v;
    else if (f.type === 'text') out[f.key] = localize(f.default, lang);
    else if (f.type === 'image') out[f.key] = null;
    else out[f.key] = f.default;
  }
  return out;
}

export const settings = computed<Settings>(() =>
  resolveSettings(current.value, state.settings[state.platform], state.lang)
);

export const device = computed<Device>(() =>
  current.value.device === 'choice' ? (settings.value.device === 'android' ? 'android' : 'ios') : current.value.device
);

export const shotContext = computed<ShotContext>(() => ({
  s: settings.value,
  messages: thread.value,
  theme: state.theme,
  lang: state.lang,
  status: {
    show: settings.value.statusBar === true,
    device: device.value,
    time: state.clock,
    battery: state.battery
  }
}));

/** Name of each side in the editor. */
export const sideLabels = computed<Record<Side, string>>(() => ({
  me: category.value === 'ai' ? 'Sen' : 'Ben',
  them: current.value.themLabel(settings.value, state.lang) || (category.value === 'ai' ? 'Asistan' : 'Kişi')
}));

export function setSetting(key: string, value: unknown): void {
  state.settings[state.platform][key] = value;
  state.dirty = true;
}

/** Called after any edit to the conversation. */
export function touched(): void {
  state.pristine[category.value] = false;
  state.dirty = true;
}

export function setPlatform(id: PlatformId): void {
  if (id === state.platform) return;
  const before = category.value;
  state.platform = id;
  // AI answers are read from the top; chats from their latest message.
  if (category.value !== before) state.scroll = category.value === 'chat' ? 1 : 0;
}

export function setLang(lang: Lang): void {
  state.lang = lang;
  for (const c of ['ai', 'chat'] as Category[]) {
    if (state.pristine[c]) state.threads[c] = defaultThread(c, lang);
  }
}

export function addMessage(side: Side): void {
  const list = thread.value;
  const last = [...list].reverse().find((m) => m.kind === 'message');
  const time = category.value === 'chat' ? (last?.time ? addMinutes(last.time, 1) : '09:41') : '';
  list.push(newMessage(side, '', time, 'read'));
  touched();
}

export function addDivider(): void {
  thread.value.push(newDivider(state.lang === 'tr' ? 'Bugün' : 'Today'));
  touched();
}

export function removeMessage(id: string): void {
  const list = thread.value;
  const k = list.findIndex((m) => m.id === id);
  if (k >= 0) list.splice(k, 1);
  touched();
}

export function moveMessage(id: string, delta: -1 | 1): void {
  const list = thread.value;
  const k = list.findIndex((m) => m.id === id);
  const j = k + delta;
  if (k < 0 || j < 0 || j >= list.length) return;
  const [m] = list.splice(k, 1);
  if (m) list.splice(j, 0, m);
  touched();
}

export function resetAll(): void {
  const fresh = initialState();
  fresh.platform = state.platform;
  fresh.width = state.width;
  Object.assign(state, fresh);
  state.scroll = category.value === 'chat' ? 1 : 0;
}
