import type { Message } from '@/state/types';

export interface ChatItem {
  m: Message;
  /** First and last of a run of messages from the same side with no divider between them. */
  first: boolean;
  last: boolean;
  /** The last real message of the conversation; read receipts and "typing" hang off it. */
  final: boolean;
}

/** Messages with their place in a run, which decides tails, corner shapes and spacing. */
export function chatItems(messages: Message[]): ChatItem[] {
  const out: ChatItem[] = messages.map((m) => ({ m, first: true, last: true, final: false }));
  const isMsg = (x: ChatItem | undefined): x is ChatItem => !!x && x.m.kind === 'message';
  out.forEach((cur, k) => {
    if (!isMsg(cur)) return;
    const prev = out[k - 1];
    const next = out[k + 1];
    cur.first = !isMsg(prev) || prev.m.side !== cur.m.side;
    cur.last = !isMsg(next) || next.m.side !== cur.m.side;
  });
  const final = [...out].reverse().find(isMsg);
  if (final) final.final = true;
  return out;
}

/** The time a divider stands for: the time of the first message after it. */
export function timeAfter(messages: Message[], index: number): string {
  for (let k = index + 1; k < messages.length; k++) {
    const m = messages[k];
    if (m && m.kind === 'message' && m.time) return m.time;
  }
  return '';
}
