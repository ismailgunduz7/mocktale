<script setup lang="ts">
import { computed } from 'vue';
import { renderMarkdown } from '@/lib/markdown';
import { escapeHtml } from '@/lib/text';
import StatusBar from '@/platforms/shared/StatusBar.vue';
import type { ShotContext } from '@/platforms/types';
import { ICONS } from './icons';

export interface ChatGPTSettings {
  title: string;
  placeholder: string;
  showActions: boolean;
  showTop: boolean;
  showComposer: boolean;
  showFooter: boolean;
  footer: string;
}

const props = defineProps<{ ctx: ShotContext }>();
const s = computed(() => props.ctx.s as unknown as ChatGPTSettings);
const messages = computed(() => props.ctx.messages.filter((m) => m.kind === 'message'));
const lastAnswer = computed(() => [...messages.value].reverse().find((m) => m.side === 'them')?.id);
const copyLabel = computed(() => (props.ctx.lang === 'tr' ? 'Kopyala' : 'Copy'));

const md = (text: string): string =>
  renderMarkdown(text, {
    codeHead: (lang) =>
      `<div class="code-head"><span>${lang}</span><span class="cp">${ICONS.codeCopy}${copyLabel.value}</span></div>`
  });
</script>

<template>
  <div class="mt-top">
    <StatusBar v-if="ctx.status.show" :device="ctx.status.device" :time="ctx.status.time" :battery="ctx.status.battery" />
    <div v-if="s.showTop" class="c-top">
      <span class="ib" v-html="ICONS.menu" />
      <span class="c-ttl">
        <span>{{ s.title }}</span>
        <span class="c-chev" v-html="ICONS.chev" />
      </span>
      <span class="c-sp" />
      <span class="ib" v-html="ICONS.compose" />
    </div>
  </div>
  <div class="mt-body">
    <div class="mt-scroll">
      <div class="c-thread">
        <template v-for="m in messages" :key="m.id">
          <div v-if="m.side === 'me'" class="c-u">
            <div v-if="m.images.length" class="c-imgs">
              <img v-for="(src, k) in m.images" :key="k" :src="src" alt="" />
            </div>
            <div v-if="m.text.trim()" class="c-ub ml"><span class="ml-text" v-html="escapeHtml(m.text)" /></div>
          </div>
          <div v-else class="c-a">
            <div class="md" v-html="md(m.text)" />
            <div v-if="m.images.length" class="c-imgs">
              <img v-for="(src, k) in m.images" :key="k" :src="src" alt="" />
            </div>
            <div v-if="s.showActions && m.id === lastAnswer" class="c-acts">
              <span class="ib" v-html="ICONS.copy" />
              <span class="ib" v-html="ICONS.up" />
              <span class="ib" v-html="ICONS.down" />
              <span class="ib" v-html="ICONS.share" />
              <span class="ib" v-html="ICONS.retry" />
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
  <div v-if="s.showComposer || s.showFooter || ctx.status.show" class="mt-bottom">
    <div v-if="s.showComposer" class="c-comp">
      <div class="c-in">
        <span class="ib" v-html="ICONS.plus" />
        <span class="c-ph">{{ s.placeholder }}</span>
        <span class="ib" v-html="ICONS.mic" />
        <span class="ib c-voice" v-html="ICONS.voice" />
      </div>
    </div>
    <div v-if="s.showFooter && s.footer.trim()" class="c-foot">{{ s.footer }}</div>
    <div v-if="ctx.status.show" class="c-safe" :class="ctx.status.device" />
  </div>
</template>
