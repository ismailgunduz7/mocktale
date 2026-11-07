<script setup lang="ts">
import { computed } from 'vue';
import { chatHtml, initials, jumboEmojiCount } from '@/lib/text';
import { formatTime } from '@/lib/time';
import { IOS } from '@/platforms/shared/ios-icons';
import { timeAfter } from '@/platforms/shared/layout';
import StatusBar from '@/platforms/shared/StatusBar.vue';
import type { ShotContext } from '@/platforms/types';
import type { Side } from '@/state/types';

export interface IosMessagesSettings {
  style: 'ios26' | 'ios18';
  name: string;
  avatar: string | null;
  unread: string;
  /** Only the SMS platform has it; iMessage is always iMessage. */
  service?: 'sms' | 'rcs';
  showTyping: boolean;
  showTop: boolean;
  showComposer: boolean;
}

type Row =
  | { kind: 'stamp'; id: string; service: string; day: string; time: string }
  | { kind: 'text'; id: string; side: Side; html: string; tail: boolean; jumbo: number; gap: boolean }
  | { kind: 'image'; id: string; side: Side; src: string; gap: boolean }
  | { kind: 'receipt'; id: string; label: string; time: string };

const props = defineProps<{ ctx: ShotContext }>();
const s = computed(() => props.ctx.s as unknown as IosMessagesSettings);
const tr = computed(() => props.ctx.lang === 'tr');
const service = computed(() => s.value.service ?? 'imessage');

const serviceLabel = computed(() => {
  if (service.value === 'imessage') return 'iMessage';
  const text = tr.value ? 'Kısa Mesaj' : 'Text Message';
  return service.value === 'rcs' ? `${text} • RCS` : text;
});

const monogram = computed(() => initials(s.value.name, tr.value ? 'tr-TR' : 'en-US'));

const rows = computed<Row[]>(() => {
  const out: Row[] = [];
  const msgs = props.ctx.messages;
  let labelled = false;
  let prevSide: Side | null = null;
  msgs.forEach((m, index) => {
    if (m.kind === 'divider') {
      // The first time line names the service above it, as Messages does.
      out.push({
        kind: 'stamp',
        id: m.id,
        service: labelled ? '' : serviceLabel.value,
        day: m.text.trim(),
        time: formatTime(timeAfter(msgs, index), props.ctx.lang)
      });
      labelled = true;
      prevSide = null;
      return;
    }
    let gap = prevSide !== m.side;
    for (const [k, src] of m.images.entries()) {
      out.push({ kind: 'image', id: `${m.id}-${k}`, side: m.side, src, gap });
      gap = false;
    }
    if (m.text.trim()) {
      out.push({
        kind: 'text',
        id: m.id,
        side: m.side,
        html: chatHtml(m.text),
        tail: false,
        jumbo: jumboEmojiCount(m.text),
        gap
      });
    }
    if (m.images.length || m.text.trim()) prevSide = m.side;
  });

  // The tail goes on the last bubble of every run from one side.
  for (let k = 0; k < out.length; k++) {
    const r = out[k];
    if (r?.kind !== 'text' || r.jumbo) continue;
    const next = out[k + 1];
    r.tail = !next || next.kind === 'stamp' || (next.kind !== 'receipt' && next.side !== r.side);
  }

  // "Delivered" or "Read" sits under your own message when it is the last one, and not for SMS.
  const last = [...msgs].reverse().find((m) => m.kind === 'message' && (m.text.trim() || m.images.length));
  if (last?.side === 'me' && service.value !== 'sms' && last.receipt !== 'sent') {
    const read = last.receipt === 'read';
    out.push({
      kind: 'receipt',
      id: 'receipt',
      label: read ? (tr.value ? 'Okundu' : 'Read') : tr.value ? 'İletildi' : 'Delivered',
      time: read ? formatTime(last.time, props.ctx.lang) : ''
    });
  }
  return out;
});

const placeholder = computed(() => serviceLabel.value);
</script>

<template>
  <div class="mt-top" :class="s.style">
    <StatusBar v-if="ctx.status.show" device="ios" :time="ctx.status.time" :battery="ctx.status.battery" />
    <div v-if="s.showTop && s.style === 'ios26'" class="im-nav26">
      <span class="im-glass im-btn" v-html="IOS.backSmall" />
      <span class="im-who">
        <span class="av im-av">
          <img v-if="s.avatar" :src="s.avatar" alt="" />
          <template v-else>{{ monogram }}</template>
        </span>
        <span class="im-glass im-name">
          <span class="im-name-t">{{ s.name }}</span>
          <span class="im-next" v-html="IOS.next" />
        </span>
      </span>
      <span class="im-glass im-btn" v-html="IOS.video" />
    </div>
    <div v-else-if="s.showTop" class="im-nav18">
      <span class="im-back18">
        <span v-html="IOS.back" />
        <span v-if="s.unread.trim()" class="im-unread">{{ s.unread }}</span>
      </span>
      <span class="im-who18">
        <span class="av im-av">
          <img v-if="s.avatar" :src="s.avatar" alt="" />
          <template v-else>{{ monogram }}</template>
        </span>
        <span class="im-name18">
          <span class="im-name-t">{{ s.name }}</span>
          <span class="im-next" v-html="IOS.next" />
        </span>
      </span>
      <span class="im-video18" v-html="IOS.video" />
    </div>
  </div>
  <div class="mt-body">
    <div class="mt-scroll">
      <div class="im-thread">
        <template v-for="r in rows" :key="r.id">
          <div v-if="r.kind === 'stamp'" class="im-stamp">
            <div v-if="r.service" class="im-service">{{ r.service }}</div>
            <div>
              <b v-if="r.day">{{ r.day }}</b>
              <template v-if="r.day && r.time">&#32;</template>
              <span v-if="r.time">{{ r.time }}</span>
            </div>
          </div>
          <div v-else-if="r.kind === 'image'" class="im-row" :class="[r.side, { g: r.gap }]">
            <img class="im-img" :src="r.src" alt="" />
          </div>
          <div v-else-if="r.kind === 'text'" class="im-row" :class="[r.side, { g: r.gap, jumbo: r.jumbo }]">
            <div class="im-bubble">
              <span v-html="r.html" />
              <svg v-if="r.tail" class="im-tail" viewBox="0 0 24 20" width="24" height="20" aria-hidden="true">
                <path d="M0 2H18V10C18 15 20.5 18.5 24 19.6C20.8 20.3 17.2 19.9 14.4 18.4C12.6 19.5 10 20 7 20H0Z" fill="currentColor" />
              </svg>
            </div>
          </div>
          <div v-else class="im-receipt">
            <b>{{ r.label }}</b>
            <template v-if="r.time">&#32;{{ r.time }}</template>
          </div>
        </template>
        <div v-if="s.showTyping" class="im-row them g">
          <div class="im-typing">
            <span /><span /><span />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="s.showComposer || ctx.status.show" class="mt-bottom" :class="s.style">
    <div v-if="s.showComposer && s.style === 'ios26'" class="im-comp26">
      <span class="im-glass im-plus" v-html="IOS.plusThin" />
      <span class="im-glass im-field">
        <span class="im-ph">{{ placeholder }}</span>
        <span class="im-mic" v-html="IOS.mic" />
      </span>
    </div>
    <div v-else-if="s.showComposer" class="im-comp18">
      <span class="im-plus18" v-html="IOS.plus" />
      <span class="im-field18">
        <span class="im-ph">{{ placeholder }}</span>
        <span class="im-mic" v-html="IOS.mic" />
      </span>
    </div>
    <div v-if="ctx.status.show" class="im-safe" />
  </div>
</template>
