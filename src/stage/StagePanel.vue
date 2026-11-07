<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { canCopyImage, copyImage, download, fileName } from '@/export/deliver';
import { isTouchDevice } from '@/lib/env';
import { FRAMES, WIDTHS, frameById } from '@/state/frames';
import { current, state } from '@/state/store';
import type { Scale } from '@/state/types';
import Icon from '@/ui/Icon.vue';
import Segmented from '@/ui/Segmented.vue';
import { toast } from '@/ui/toast';
import ExportSheet from './ExportSheet.vue';
import ShotFrame from './ShotFrame.vue';
import { exportShot, shotInfo } from './shot';

defineProps<{ full: boolean }>();
const emit = defineEmits<{ enterFull: []; exitFull: [] }>();

const SCALES: { value: Scale; label: string }[] = [
  { value: 1, label: '1×' },
  { value: 2, label: '2×' },
  { value: 3, label: '3×' }
];

const viewport = ref<HTMLElement | null>(null);
const available = ref(390);
const narrow = ref(window.matchMedia('(max-width: 899px)').matches);
let observer: ResizeObserver | null = null;
const media = window.matchMedia('(max-width: 899px)');
const onMedia = (e: MediaQueryListEvent): void => {
  narrow.value = e.matches;
};

onMounted(() => {
  observer = new ResizeObserver(([entry]) => {
    if (entry) available.value = Math.floor(entry.contentRect.width);
  });
  if (viewport.value) observer.observe(viewport.value);
  media.addEventListener('change', onMedia);
});
onBeforeUnmount(() => {
  observer?.disconnect();
  media.removeEventListener('change', onMedia);
});

// "Fit" means the phone's own screen width, so it is offered where the preview is a phone.
const widths = computed(() => WIDTHS.filter((w) => w.value !== 'fit' || narrow.value || state.width === 'fit'));
const shotWidth = computed(() =>
  state.width === 'fit' ? Math.max(320, Math.min(1000, available.value)) : state.width
);

function setWidth(e: Event): void {
  const v = (e.target as HTMLSelectElement).value;
  state.width = v === 'fit' ? 'fit' : Number(v);
}

const fixedOut = computed(() => frameById(state.frame).out);
const outputSize = computed(() => {
  const out = fixedOut.value;
  if (out) return `${out[0]} × ${out[1]}`;
  return `${Math.round(shotInfo.width * state.scale)} × ${Math.round(shotInfo.height * state.scale)}`;
});

const busy = ref(false);
const result = ref<{ blob: Blob; name: string; width: number; height: number } | null>(null);

async function save(): Promise<void> {
  if (busy.value) return;
  busy.value = true;
  try {
    const r = await exportShot();
    const name = fileName(current.value.slug);
    if (isTouchDevice) {
      result.value = { blob: r.blob, name, width: r.width, height: r.height };
    } else {
      download(r.blob, name);
      state.dirty = false;
      const lowered = !fixedOut.value && r.scale < state.scale - 0.01;
      toast(lowered ? 'PNG indirildi. Görüntü çok uzun olduğu için çözünürlüğü biraz düşürüldü.' : 'PNG indirildi.');
    }
  } catch (e) {
    console.error(e);
    toast('Görsel hazırlanamadı. Tam ekranı açıp ekran görüntüsü alabilirsin.', 4000);
  } finally {
    busy.value = false;
  }
}

async function copy(): Promise<void> {
  if (busy.value) return;
  busy.value = true;
  try {
    await copyImage(exportShot().then((r) => r.blob));
    state.dirty = false;
    toast('Görsel panoya kopyalandı.');
  } catch (e) {
    console.error(e);
    toast('Bu tarayıcı görseli panoya kopyalamaya izin vermedi.');
  } finally {
    busy.value = false;
  }
}

let lastTap = 0;
function tap(): void {
  const now = Date.now();
  if (now - lastTap < 350) emit('exitFull');
  lastTap = now;
}
</script>

<template>
  <main class="stage">
    <div v-if="!full" class="toolbar">
      <div class="tb-group">
        <label class="tb-field">
          <span>Çerçeve</span>
          <select v-model="state.frame">
            <option v-for="f in FRAMES" :key="f.id" :value="f.id">{{ f.label }}</option>
          </select>
        </label>
        <label class="tb-field">
          <span>Genişlik</span>
          <select :value="String(state.width)" @change="setWidth">
            <option v-for="w in widths" :key="String(w.value)" :value="String(w.value)">{{ w.label }}</option>
          </select>
        </label>
        <label v-if="state.frame !== 'auto'" class="tb-field tb-scroll">
          <span>Görünen kısım</span>
          <input v-model.number="state.scroll" type="range" min="0" max="1" step="0.001" :disabled="!shotInfo.scrollRange" />
        </label>
      </div>
      <div class="tb-group tb-end">
        <Segmented v-if="!fixedOut" v-model="state.scale" label="Çözünürlük" :options="SCALES" />
        <button type="button" class="btn" title="Tam ekran" @click="emit('enterFull')">
          <Icon name="expand" :size="17" />
          <span class="hide-sm">Tam ekran</span>
        </button>
        <button v-if="canCopyImage && !isTouchDevice" type="button" class="btn" :disabled="busy" @click="copy">
          <Icon name="copy" :size="17" />
          Kopyala
        </button>
        <button type="button" class="btn primary" :disabled="busy" @click="save">
          <Icon name="download" :size="17" />
          {{ busy ? 'Hazırlanıyor…' : isTouchDevice ? 'Kaydet' : 'PNG indir' }}
        </button>
      </div>
    </div>
    <div ref="viewport" class="viewport" :class="{ full }" @dblclick="full && emit('exitFull')" @touchend="full && tap()">
      <div class="shot-wrap">
        <ShotFrame :width="shotWidth" :full="full" />
      </div>
      <p v-if="!full" class="out-size">{{ outputSize }} piksel</p>
    </div>
    <ExportSheet v-if="result" v-bind="result" @close="result = null" @saved="state.dirty = false" />
  </main>
</template>
