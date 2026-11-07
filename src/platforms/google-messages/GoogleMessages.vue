<script setup lang="ts">
import { computed } from 'vue';
import { chatHtml, initials, jumboEmojiCount } from '@/lib/text';
import { formatTime } from '@/lib/time';
import { timeAfter } from '@/platforms/shared/layout';
import { MD } from '@/platforms/shared/material-icons';
import StatusBar from '@/platforms/shared/StatusBar.vue';
import type { ShotContext } from '@/platforms/types';
import type { Side } from '@/state/types';

export interface GoogleMessagesSettings {
  name: string;
  avatar: string | null;
  service: 'sms' | 'rcs';
  showTyping: boolean;
  showTop: boolean;
  showComposer: boolean;
}

type Shape = 'single' | 'first' | 'mid' | 'last';
type Row =
  | { kind: 'day'; id: string; text: string }
  | { kind: 'text'; id: string; side: Side; html: string; shape: Shape; jumbo: number; gap: boolean }
  | { kind: 'image'; id: string; side: Side; src: string; shape: Shape; gap: boolean }
  | { kind: 'meta'; id: string; side: Side; text: string };

const props = defineProps<{ ctx: ShotContext }>();
const s = computed(() => props.ctx.s as unknown as GoogleMessagesSettings);
const tr = computed(() => props.ctx.lang === 'tr');
const time = (t: string): string => formatTime(t, props.ctx.lang);

// Contact colours of Material You: a soft tone with a deep letter, picked from the name.
const TONES: [string, string][] = [
  ['#c2e7ff', '#001d35'],
  ['#c4eed0', '#072711'],
  ['#ffdad6', '#410002'],
  ['#ffdeac', '#281900'],
  ['#e8def8', '#1d192b'],
  ['#ffd8e4', '#31111d']
];
const tone = computed(() => {
  let h = 0;
  for (const ch of s.value.name) h = (h * 31 + (ch.codePointAt(0) ?? 0)) >>> 0;
  return TONES[h % TONES.length] ?? TONES[0]!;
});
const monogram = computed(() => initials(s.value.name, tr.value ? 'tr-TR' : 'en-US').slice(0, 1));

const statusText = (receipt: string): string => {
  if (receipt === 'read') return tr.value ? 'Okundu' : 'Read';
  if (receipt === 'delivered') return tr.value ? 'Teslim edildi' : 'Delivered';
  return tr.value ? 'Gönderildi' : 'Sent';
};

const rows = computed<Row[]>(() => {
  const msgs = props.ctx.messages;
  type Part = Extract<Row, { kind: 'text' | 'image' }>;
  const out: Row[] = [];
  let run: Part[] = [];
  let runSide: Side | null = null;
  let runEnd: { time: string; receipt: string } | null = null;
  const finalId = [...msgs].reverse().find((m) => m.kind === 'message' && (m.text.trim() || m.images.length))?.id;
  let finalMine = false;

  const flush = (): void => {
    if (!run.length || !runSide) return;
    run.forEach((p, k) => {
      p.shape = run.length === 1 ? 'single' : k === 0 ? 'first' : k === run.length - 1 ? 'last' : 'mid';
    });
    out.push(...run);
    const t = runEnd ? time(runEnd.time) : '';
    const status = runSide === 'me' && finalMine && runEnd ? statusText(runEnd.receipt) : '';
    const text = [t, status].filter(Boolean).join(' • ');
    if (text) out.push({ kind: 'meta', id: `meta-${run[run.length - 1]?.id}`, side: runSide, text });
    run = [];
    runSide = null;
    finalMine = false;
  };

  msgs.forEach((m, index) => {
    if (m.kind === 'divider') {
      flush();
      const t = time(timeAfter(msgs, index));
      out.push({ kind: 'day', id: m.id, text: [m.text.trim(), t].filter(Boolean).join(' • ') });
      return;
    }
    if (!m.text.trim() && !m.images.length) return;
    if (runSide !== m.side) flush();
    const gap = run.length === 0;
    runSide = m.side;
    m.images.forEach((src, k) => run.push({ kind: 'image', id: `${m.id}-${k}`, side: m.side, src, shape: 'single', gap: gap && k === 0 }));
    if (m.text.trim()) {
      run.push({
        kind: 'text',
        id: m.id,
        side: m.side,
        html: chatHtml(m.text),
        shape: 'single',
        jumbo: jumboEmojiCount(m.text),
        gap: gap && !m.images.length
      });
    }
    runEnd = { time: m.time, receipt: m.receipt };
    if (m.id === finalId) finalMine = m.side === 'me';
  });
  flush();
  return out;
});

const placeholder = computed(() =>
  s.value.service === 'rcs' ? (tr.value ? 'RCS mesajı' : 'RCS message') : tr.value ? 'Kısa mesaj' : 'Text message'
);
</script>

<template>
  <div class="mt-top">
    <StatusBar v-if="ctx.status.show" device="android" :time="ctx.status.time" :battery="ctx.status.battery" />
    <div v-if="s.showTop" class="gm-nav">
      <span class="ib gm-back" v-html="MD.back" />
      <span class="av gm-av" :style="{ background: tone[0], color: tone[1] }">
        <img v-if="s.avatar" :src="s.avatar" alt="" />
        <template v-else>{{ monogram }}</template>
      </span>
      <span class="gm-name">{{ s.name }}</span>
      <span class="ib" v-html="MD.call" />
      <span class="ib" v-html="MD.video" />
      <span class="ib" v-html="MD.more" />
    </div>
  </div>
  <div class="mt-body">
    <div class="mt-scroll">
      <div class="gm-thread" :class="s.service">
        <template v-for="r in rows" :key="r.id">
          <div v-if="r.kind === 'day'" class="gm-day">{{ r.text }}</div>
          <div v-else-if="r.kind === 'meta'" class="gm-meta" :class="r.side">{{ r.text }}</div>
          <div v-else class="gm-row" :class="[r.side, r.shape, { g: r.gap, jumbo: r.kind === 'text' && r.jumbo }]">
            <img v-if="r.kind === 'image'" class="gm-img" :src="r.src" alt="" />
            <div v-else class="gm-b" v-html="r.html" />
          </div>
        </template>
        <div v-if="s.showTyping" class="gm-row them single g">
          <div class="gm-b gm-typing"><span /><span /><span /></div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="s.showComposer || ctx.status.show" class="mt-bottom">
    <div v-if="s.showComposer" class="gm-comp">
      <span class="ib gm-round" v-html="MD.add" />
      <span class="gm-field">
        <span class="gm-ph">{{ placeholder }}</span>
        <span class="ib" v-html="MD.mood" />
        <span class="ib" v-html="MD.image" />
      </span>
      <span class="ib gm-round gm-mic" v-html="MD.mic" />
    </div>
    <div v-if="ctx.status.show" class="gm-safe" />
  </div>
</template>
