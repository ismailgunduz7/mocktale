<script setup lang="ts">
import { computed } from 'vue';
import { renderMarkdown } from '@/lib/markdown';
import { escapeHtml, initials } from '@/lib/text';
import StatusBar from '@/platforms/shared/StatusBar.vue';
import type { ShotContext } from '@/platforms/types';
import { ICONS } from './icons';

export interface ClaudeSettings {
  title: string;
  model: string;
  font: 'default' | 'sans' | 'system' | 'dyslexic';
  userStyle: 'bubble' | 'classic';
  userName: string;
  placeholder: string;
  showSpark: boolean;
  showActions: boolean;
  showTop: boolean;
  showComposer: boolean;
  showFooter: boolean;
  footer: string;
}

const props = defineProps<{ ctx: ShotContext }>();
const s = computed(() => props.ctx.s as unknown as ClaudeSettings);
const messages = computed(() => props.ctx.messages.filter((m) => m.kind === 'message'));
const lastAnswer = computed(() => [...messages.value].reverse().find((m) => m.side === 'them')?.id);
const userInitials = computed(() => initials(s.value.userName, props.ctx.lang === 'tr' ? 'tr-TR' : 'en-US') || 'A');

const md = (text: string): string =>
  renderMarkdown(text, {
    codeHead: (lang) => (lang ? `<div class="code-head">${lang}</div>` : '')
  });
</script>

<template>
  <div class="mt-top" :class="'f-' + s.font">
    <StatusBar v-if="ctx.status.show" :device="ctx.status.device" :time="ctx.status.time" :battery="ctx.status.battery" />
    <div v-if="s.showTop" class="cl-top">
      <span class="ib" v-html="ICONS.menu" />
      <span class="cl-ttl">
        <span class="cl-ttl-t">{{ s.title }}</span>
        <span class="cl-chev" v-html="ICONS.chev" />
      </span>
      <span class="ib" v-html="ICONS.compose" />
    </div>
  </div>
  <div class="mt-body" :class="'f-' + s.font">
    <div class="mt-scroll">
      <div class="cl-thread">
        <template v-for="m in messages" :key="m.id">
          <div v-if="m.side === 'me'" class="cl-u" :class="s.userStyle">
            <div v-if="m.images.length" class="cl-imgs">
              <img v-for="(src, k) in m.images" :key="k" :src="src" alt="" />
            </div>
            <div v-if="m.text.trim()" class="cl-ub">
              <span v-if="s.userStyle === 'classic'" class="av cl-av">{{ userInitials }}</span>
              <span class="cl-ut" v-html="escapeHtml(m.text)" />
            </div>
          </div>
          <div v-else class="cl-a">
            <div class="md" v-html="md(m.text)" />
            <div v-if="m.images.length" class="cl-imgs">
              <img v-for="(src, k) in m.images" :key="k" :src="src" alt="" />
            </div>
            <div v-if="m.id === lastAnswer && (s.showSpark || s.showActions)" class="cl-after">
              <span v-if="s.showSpark" class="cl-spark" v-html="ICONS.spark" />
              <span v-if="s.showActions" class="cl-acts">
                <span class="ib" v-html="ICONS.copy" />
                <span class="ib" v-html="ICONS.up" />
                <span class="ib" v-html="ICONS.down" />
                <span class="ib" v-html="ICONS.retry" />
              </span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
  <div v-if="s.showComposer || s.showFooter || ctx.status.show" class="mt-bottom" :class="'f-' + s.font">
    <div v-if="s.showComposer" class="cl-comp">
      <div class="cl-in">
        <div class="cl-ph">{{ s.placeholder }}</div>
        <div class="cl-row">
          <span class="ib cl-tb" v-html="ICONS.plus" />
          <span class="ib cl-tb" v-html="ICONS.tools" />
          <span class="cl-model">
            <span>{{ s.model }}</span>
            <span v-html="ICONS.chev" />
          </span>
          <span class="ib cl-send" v-html="ICONS.send" />
        </div>
      </div>
    </div>
    <div v-if="s.showFooter && s.footer.trim()" class="cl-foot">{{ s.footer }}</div>
    <div v-if="ctx.status.show" class="cl-safe" :class="ctx.status.device" />
  </div>
</template>
