import { chatgpt } from './chatgpt';
import { claude } from './claude';
import { gemini } from './gemini';
import { androidSms } from './google-messages';
import { imessage, iphoneSms } from './ios-messages';
import type { PlatformDef } from './types';
import { whatsapp } from './whatsapp';
import type { PlatformId } from '@/state/types';

/** Every platform, in the order the picker shows them. */
export const PLATFORMS: PlatformDef[] = [gemini, chatgpt, claude, whatsapp, imessage, iphoneSms, androidSms];

export const platformById = (id: PlatformId): PlatformDef => PLATFORMS.find((p) => p.id === id) ?? gemini;

export const platformBySlug = (slug: string): PlatformDef | undefined =>
  PLATFORMS.find((p) => p.slug === slug.toLowerCase());

/** All mock stylesheets once each; iMessage and iPhone SMS share theirs. */
export const ALL_MOCK_CSS = Array.from(new Set(PLATFORMS.map((p) => p.css))).join('\n');
