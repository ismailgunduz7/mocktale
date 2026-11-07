<script setup lang="ts">
import { computed } from 'vue';
import { whatsappHtml } from '@/lib/text';
import { formatTime } from '@/lib/time';
import { IOS } from '@/platforms/shared/ios-icons';
import { chatItems } from '@/platforms/shared/layout';
import { MD } from '@/platforms/shared/material-icons';
import StatusBar from '@/platforms/shared/StatusBar.vue';
import type { ShotContext } from '@/platforms/types';
import type { Receipt } from '@/state/types';

export interface WhatsAppSettings {
  device: 'ios' | 'android';
  name: string;
  subtitle: string;
  avatar: string | null;
  unread: string;
  wallpaper: 'default' | 'image';
  wallpaperImage: string | null;
  showEncryption: boolean;
  showTop: boolean;
  showComposer: boolean;
}

const props = defineProps<{ ctx: ShotContext }>();
const s = computed(() => props.ctx.s as unknown as WhatsAppSettings);
const ios = computed(() => s.value.device !== 'android');
const tr = computed(() => props.ctx.lang === 'tr');

const items = computed(() =>
  chatItems(props.ctx.messages).filter((it) => it.m.kind === 'divider' || it.m.text.trim() || it.m.images.length)
);

// iPhone draws the tail under the last bubble of a run, Android above the first one.
const hasTail = (first: boolean, last: boolean): boolean => (ios.value ? last : first);

const time = (t: string): string => formatTime(t, props.ctx.lang);

const TICKS: Record<Receipt, string> = {
  sent: '<svg viewBox="0 0 16 11" width="16" height="11" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3.6 5.9 6.3 8.6 12.2 2.4"/></svg>',
  delivered:
    '<svg viewBox="0 0 16 11" width="16" height="11" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1.2 5.9 3.9 8.6 9.8 2.4M7.4 8.1l.5.5 5.9-6.2"/></svg>',
  read: '<svg viewBox="0 0 16 11" width="16" height="11" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1.2 5.9 3.9 8.6 9.8 2.4M7.4 8.1l.5.5 5.9-6.2"/></svg>'
};

const encryption = computed(() =>
  tr.value
    ? 'Mesajlar ve aramalar uçtan uca şifrelidir. Bu sohbetteki kişiler dışında hiç kimse bunları okuyamaz, dinleyemez veya paylaşamaz.'
    : 'Messages and calls are end-to-end encrypted. Only people in this chat can read, listen to, or share them.'
);
const learnMore = computed(() => (tr.value ? 'Daha fazla bilgi edinin' : 'Learn more'));
const placeholder = computed(() => (tr.value ? 'Mesaj' : 'Message'));

const wallStyle = computed(() =>
  s.value.wallpaper === 'image' && s.value.wallpaperImage ? { backgroundImage: `url("${s.value.wallpaperImage}")` } : undefined
);
</script>

<template>
  <div class="mt-top">
    <StatusBar v-if="ctx.status.show" :device="s.device" :time="ctx.status.time" :battery="ctx.status.battery" />
    <div v-if="s.showTop" class="wa-nav">
      <span class="wa-back">
        <span v-html="ios ? IOS.back : MD.back" />
        <span v-if="s.unread.trim()" class="wa-unread">{{ s.unread }}</span>
      </span>
      <span class="av wa-av">
        <img v-if="s.avatar" :src="s.avatar" alt="" />
        <span v-else class="wa-ghost" v-html="MD.person" />
      </span>
      <span class="wa-id">
        <span class="wa-name">{{ s.name }}</span>
        <span v-if="s.subtitle.trim()" class="wa-sub">{{ s.subtitle }}</span>
      </span>
      <span v-if="ios" class="wa-acts">
        <span class="ib" v-html="IOS.video" />
        <span class="ib" v-html="IOS.phone" />
      </span>
      <span v-else class="wa-acts">
        <span class="ib" v-html="MD.video" />
        <span class="ib" v-html="MD.call" />
        <span class="ib" v-html="MD.more" />
      </span>
    </div>
  </div>
  <div class="mt-body">
    <div class="wa-wall" :style="wallStyle" />
    <div class="mt-scroll">
      <div class="wa-thread">
        <div v-if="s.showEncryption" class="wa-e2e">
          <span class="wa-lock" v-html="MD.lock" />
          {{ encryption }} <span class="wa-more">{{ learnMore }}</span>
        </div>
        <template v-for="it in items" :key="it.m.id">
          <div v-if="it.m.kind === 'divider'" class="wa-day">{{ it.m.text }}</div>
          <div v-else class="wa-row" :class="[it.m.side, { g: it.first }]">
            <div class="wa-b" :class="{ tail: hasTail(it.first, it.last), media: it.m.images.length, bare: !it.m.text.trim() }">
              <div v-for="(src, k) in it.m.images" :key="k" class="wa-img">
                <img :src="src" alt="" />
              </div>
              <div v-if="it.m.text.trim()" class="wa-text">
                <span v-html="whatsappHtml(it.m.text)" />
                <span class="wa-meta ghost">
                  <span>{{ time(it.m.time) }}</span>
                  <span v-if="it.m.side === 'me'" class="wa-tick" v-html="TICKS[it.m.receipt]" />
                </span>
              </div>
              <span class="wa-meta" :class="{ over: !it.m.text.trim() }">
                <span>{{ time(it.m.time) }}</span>
                <span v-if="it.m.side === 'me'" class="wa-tick" :class="it.m.receipt" v-html="TICKS[it.m.receipt]" />
              </span>
              <svg v-if="hasTail(it.first, it.last) && ios" class="wa-tail bottom" viewBox="0 0 20 16" width="20" height="16" aria-hidden="true">
                <path d="M0 0H14V7C14 11 16 14.5 19.5 15.6C16.8 16.2 13.8 15.9 11.6 14.7C10.1 15.6 8 16 5.5 16H0Z" fill="currentColor" />
              </svg>
              <svg v-else-if="hasTail(it.first, it.last)" class="wa-tail top" viewBox="0 0 9 13" width="9" height="13" aria-hidden="true">
                <path d="M0 0h6.8c1.6 0 2.3 1.4 1.4 2.6L0 12.5Z" fill="currentColor" />
              </svg>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
  <div v-if="s.showComposer || ctx.status.show" class="mt-bottom">
    <div v-if="s.showComposer && ios" class="wa-comp ios">
      <span class="ib" v-html="IOS.plusThin" />
      <span class="wa-field">
        <span class="wa-ph" />
        <span class="ib" v-html="IOS.sticker" />
      </span>
      <span class="ib" v-html="IOS.camera" />
      <span class="ib" v-html="IOS.mic" />
    </div>
    <div v-else-if="s.showComposer" class="wa-comp android">
      <span class="wa-pill">
        <span class="ib" v-html="MD.mood" />
        <span class="wa-ph">{{ placeholder }}</span>
        <span class="ib wa-clip" v-html="MD.attach" />
        <span class="ib" v-html="MD.camera" />
      </span>
      <span class="ib wa-fab" v-html="MD.mic" />
    </div>
    <div v-if="ctx.status.show" class="wa-safe" />
  </div>
</template>
