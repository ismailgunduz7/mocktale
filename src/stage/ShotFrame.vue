<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { hasAppleSystemFont } from '@/lib/env';
import { frameHeight } from '@/state/frames';
import { current, device, shotContext, state } from '@/state/store';
import { shotEl, shotInfo } from './shot';

const props = defineProps<{ width: number; full?: boolean }>();

const root = ref<HTMLElement | null>(null);
const height = computed(() => (props.full ? null : frameHeight(state.frame, props.width, device.value)));
const fixed = computed(() => height.value !== null);

const offset = ref(0);
const topH = ref(0);
const bottomH = ref(0);

const rootClass = computed(() => [
  'shot',
  current.value.rootClass ?? `p-${current.value.id}`,
  state.theme,
  `d-${device.value}`,
  {
    fixed: fixed.value,
    'anchor-bottom': current.value.anchor === 'bottom',
    sf: hasAppleSystemFont,
    nosf: !hasAppleSystemFont
  }
]);

const rootStyle = computed(() => ({
  width: props.full ? '100%' : `${props.width}px`,
  height: height.value === null ? undefined : `${height.value}px`,
  '--offset': `${offset.value}px`,
  '--top-h': `${topH.value}px`,
  '--bottom-h': `${bottomH.value}px`
}));

/**
 * Bubbles that wrap get roomier padding in some apps (ChatGPT). Whether a bubble wraps is only
 * known after layout, so it is read from the line boxes and written back as data-lines.
 */
function markLines(el: HTMLElement): void {
  el.querySelectorAll<HTMLElement>('.ml').forEach((box) => {
    const text = box.querySelector('.ml-text');
    if (!text) return;
    const tops = new Set(Array.from(text.getClientRects(), (r) => Math.round(r.top)));
    const lines = tops.size > 1 ? 'multi' : 'one';
    if (box.dataset.lines !== lines) box.dataset.lines = lines;
  });
}

function measure(): void {
  const el = root.value;
  if (!el) return;
  markLines(el);
  const top = el.querySelector<HTMLElement>(':scope > .mt-top');
  const bottom = el.querySelector<HTMLElement>(':scope > .mt-bottom');
  const content = el.querySelector<HTMLElement>(':scope > .mt-body > .mt-scroll > :first-child');
  if (fixed.value && height.value !== null) {
    topH.value = top?.offsetHeight ?? 0;
    bottomH.value = bottom?.offsetHeight ?? 0;
    const total = topH.value + (content?.offsetHeight ?? 0) + bottomH.value;
    const range = Math.max(0, total - height.value);
    shotInfo.scrollRange = range;
    offset.value = Math.round(range * Math.min(1, Math.max(0, state.scroll)));
  } else {
    topH.value = 0;
    bottomH.value = 0;
    offset.value = 0;
    shotInfo.scrollRange = 0;
  }
  shotInfo.width = el.offsetWidth;
  shotInfo.height = el.offsetHeight;
}

let frame = 0;
let resizeObserver: ResizeObserver | null = null;
let mutationObserver: MutationObserver | null = null;

/** Watches the parts whose size moves the conversation: they change with every edit. */
function observeParts(): void {
  const el = root.value;
  if (!el || !resizeObserver) return;
  resizeObserver.disconnect();
  resizeObserver.observe(el);
  el.querySelectorAll<HTMLElement>(':scope > .mt-top, :scope > .mt-bottom, :scope > .mt-body > .mt-scroll > :first-child').forEach(
    (part) => resizeObserver?.observe(part)
  );
}

function schedule(): void {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(() => {
    observeParts();
    measure();
  });
}

onMounted(() => {
  shotEl.value = root.value;
  resizeObserver = new ResizeObserver(schedule);
  mutationObserver = new MutationObserver(schedule);
  if (root.value) mutationObserver.observe(root.value, { childList: true, subtree: true, characterData: true });
  // Late web fonts change line breaks without any mutation.
  document.fonts?.addEventListener?.('loadingdone', schedule);
  schedule();
});

onBeforeUnmount(() => {
  cancelAnimationFrame(frame);
  resizeObserver?.disconnect();
  mutationObserver?.disconnect();
  document.fonts?.removeEventListener?.('loadingdone', schedule);
  if (shotEl.value === root.value) shotEl.value = null;
});

watch(() => [state.scroll, state.frame, state.platform, props.width, props.full], schedule);
</script>

<template>
  <div ref="root" :class="rootClass" :style="rootStyle" role="img" :aria-label="`${current.name} önizlemesi`">
    <component :is="current.component" :ctx="shotContext" />
  </div>
</template>
