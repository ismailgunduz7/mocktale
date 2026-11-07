<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import EditorPanel from '@/editor/EditorPanel.vue';
import { isTouchDevice } from '@/lib/env';
import { platformBySlug } from '@/platforms';
import StagePanel from '@/stage/StagePanel.vue';
import { current, setPlatform, state } from '@/state/store';
import Icon from '@/ui/Icon.vue';
import { toast } from '@/ui/toast';
import ToastHost from '@/ui/ToastHost.vue';

const view = ref<'edit' | 'preview'>('edit');
const full = ref(false);

// The path picks the platform, so /whatsapp can be bookmarked or shared. An unknown path is
// quietly sent back to the start.
const slug = location.pathname.replace(/^\/+|\/+$/g, '');
const fromPath = slug ? platformBySlug(slug) : undefined;
if (fromPath) setPlatform(fromPath.id);
else if (slug) history.replaceState(null, '', '/');

watch(
  () => state.platform,
  () => {
    const path = `/${current.value.slug}`;
    if (location.pathname !== path) history.replaceState(null, '', path);
  }
);
watch(
  () => current.value.name,
  (name) => {
    document.title = `${name} sohbet görüntüsü · mocktale`;
  },
  { immediate: true }
);

function enterFull(): void {
  full.value = true;
  window.scrollTo(0, 0);
  document.documentElement.requestFullscreen?.().catch(() => undefined);
  toast(
    isTouchDevice
      ? 'Ekran görüntüsünü al. Çıkmak için iki kez dokun.'
      : "Ekran görüntüsünü al. Çıkmak için Esc'ye bas ya da çift tıkla."
  );
}

function exitFull(): void {
  full.value = false;
  if (document.fullscreenElement) document.exitFullscreen().catch(() => undefined);
}

function onKey(e: KeyboardEvent): void {
  if (e.key === 'Escape' && full.value) exitFull();
}

function onFullscreenChange(): void {
  if (!document.fullscreenElement && full.value) full.value = false;
}

// Nothing is saved anywhere, so a reload would lose the work: the browser asks first.
function onBeforeUnload(e: BeforeUnloadEvent): void {
  if (!state.dirty) return;
  e.preventDefault();
  e.returnValue = '';
}

onMounted(() => {
  document.addEventListener('keydown', onKey);
  document.addEventListener('fullscreenchange', onFullscreenChange);
  window.addEventListener('beforeunload', onBeforeUnload);
});
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKey);
  document.removeEventListener('fullscreenchange', onFullscreenChange);
  window.removeEventListener('beforeunload', onBeforeUnload);
});

function show(v: 'edit' | 'preview'): void {
  view.value = v;
  window.scrollTo(0, 0);
}
</script>

<template>
  <div class="app" :class="[`v-${view}`, { full }]">
    <EditorPanel />
    <StagePanel :full="full" @enter-full="enterFull" @exit-full="exitFull" />
    <nav class="tabs" aria-label="Ekran">
      <button type="button" :class="{ on: view === 'edit' }" :aria-pressed="view === 'edit'" @click="show('edit')">
        <Icon name="edit" :size="18" />
        Düzenle
      </button>
      <button type="button" :class="{ on: view === 'preview' }" :aria-pressed="view === 'preview'" @click="show('preview')">
        <Icon name="eye" :size="18" />
        Önizleme
      </button>
    </nav>
    <ToastHost />
  </div>
</template>
