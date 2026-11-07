<script setup lang="ts">
import { computed } from 'vue';
import { renderMarkdown } from '@/lib/markdown';
import { escapeHtml } from '@/lib/text';
import StatusBar from '@/platforms/shared/StatusBar.vue';
import type { ShotContext } from '@/platforms/types';
import { ICONS } from './icons';

export interface GeminiSettings {
  assistantName: string;
  model: string;
  placeholder: string;
  footer: string;
  showTop: boolean;
  showComposer: boolean;
  showAssistantIcon: boolean;
  assistantIcon: string | null;
  showAvatar: boolean;
  userLetter: string;
  userAvatar: string | null;
}

const props = defineProps<{ ctx: ShotContext }>();
const s = computed(() => props.ctx.s as unknown as GeminiSettings);
const locale = computed(() => (props.ctx.lang === 'tr' ? 'tr-TR' : 'en-US'));
const messages = computed(() => props.ctx.messages.filter((m) => m.kind === 'message'));
const initial = computed(
  () => Array.from(s.value.assistantName.trim())[0]?.toLocaleUpperCase(locale.value) ?? 'G'
);
const md = (text: string): string =>
  renderMarkdown(text, {
    codeHead: (lang) => `<div class="code-head"><span>${lang || 'code'}</span>${ICONS.copy}</div>`
  });
const footer = computed(() => s.value.footer.trim());
</script>

<template>
  <div class="mt-top">
    <StatusBar v-if="ctx.status.show" :device="ctx.status.device" :time="ctx.status.time" :battery="ctx.status.battery" />
    <div v-if="s.showTop" class="g-top">
      <span class="ib g-menu" v-html="ICONS.menu" />
      <span class="g-ttl">
        <span>{{ s.assistantName }}</span>
        <span v-if="s.model.trim()" class="g-model">{{ s.model }}</span>
        <span v-html="ICONS.chev" />
      </span>
      <span class="g-sp" />
      <span class="ib" v-html="ICONS.edit" />
      <span class="ib">
        <span v-if="s.showAvatar" class="av g-av">
          <img v-if="s.userAvatar" :src="s.userAvatar" alt="" />
          <template v-else>{{ s.userLetter }}</template>
        </span>
        <span v-else class="ib" v-html="ICONS.more" />
      </span>
    </div>
  </div>
  <div class="mt-body">
    <div class="mt-scroll">
      <div class="g-thread">
        <template v-for="m in messages" :key="m.id">
          <div v-if="m.side === 'me'" class="g-u">
            <div v-if="m.images.length" class="g-imgs">
              <img v-for="(src, k) in m.images" :key="k" :src="src" alt="" />
            </div>
            <div v-if="m.text.trim()" class="g-b" v-html="escapeHtml(m.text)" />
          </div>
          <div v-else class="g-a">
            <div v-if="s.showAssistantIcon" class="av g-ic">
              <img v-if="s.assistantIcon" :src="s.assistantIcon" alt="" />
              <template v-else>{{ initial }}</template>
            </div>
            <div class="g-t">
              <div class="md" v-html="md(m.text)" />
              <div v-if="m.images.length" class="g-imgs">
                <img v-for="(src, k) in m.images" :key="k" :src="src" alt="" />
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
  <div v-if="s.showComposer || footer || ctx.status.show" class="mt-bottom">
    <div v-if="s.showComposer" class="g-comp" :class="{ wf: footer }">
      <div class="g-in">
        <span v-html="ICONS.plus" />
        <span class="g-ph">{{ s.placeholder }}</span>
        <span v-html="ICONS.mic" />
      </div>
    </div>
    <div v-if="footer" class="g-foot">{{ footer }}</div>
    <div v-if="ctx.status.show" class="g-safe" :class="ctx.status.device" />
  </div>
</template>
