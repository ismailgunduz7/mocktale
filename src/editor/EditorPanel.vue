<script setup lang="ts">
import { current, resetAll, setLang, settings, state } from '@/state/store';
import type { Lang, Theme } from '@/state/types';
import Icon from '@/ui/Icon.vue';
import Segmented from '@/ui/Segmented.vue';
import MessageList from './MessageList.vue';
import PlatformPicker from './PlatformPicker.vue';
import SettingsFields from './SettingsFields.vue';

const THEMES: { value: Theme; label: string }[] = [
  { value: 'light', label: 'Açık' },
  { value: 'dark', label: 'Koyu' }
];
const LANGS: { value: Lang; label: string }[] = [
  { value: 'tr', label: 'Türkçe' },
  { value: 'en', label: 'English' }
];

function reset(): void {
  if (window.confirm('Bütün mesajlar, görseller ve ayarlar silinsin mi?')) resetAll();
}
</script>

<template>
  <aside class="editor">
    <header class="ed-head">
      <div class="brand">
        <svg class="brand-mark" viewBox="0 0 64 64" width="22" height="22" aria-hidden="true">
          <rect width="64" height="64" rx="15" fill="currentColor" />
          <path
            d="M17 17h30a6 6 0 0 1 6 6v13a6 6 0 0 1-6 6H32.5L23 49.5V42h-6a6 6 0 0 1-6-6V23a6 6 0 0 1 6-6Z"
            fill="var(--paper)"
          />
        </svg>
        <span>mocktale</span>
      </div>
      <p class="promise">
        <Icon name="lock" :size="14" />
        <span>Yazdıkların ve eklediğin görseller bu sekmeden hiçbir yere gitmez. Sekmeyi kapattığında hepsi silinir.</span>
      </p>
    </header>

    <PlatformPicker />

    <section class="sec">
      <h2 class="sec-title">Mesajlar</h2>
      <MessageList />
    </section>

    <section class="sec">
      <h2 class="sec-title">{{ current.name }}</h2>
      <SettingsFields section="platform" />
    </section>

    <section class="sec">
      <h2 class="sec-title">Görünüm</h2>
      <div class="fields">
        <div class="field">
          <span class="lbl">Tema</span>
          <Segmented v-model="state.theme" label="Tema" :options="THEMES" />
        </div>
        <div class="field">
          <span class="lbl">Ekrandaki dil</span>
          <Segmented :model-value="state.lang" label="Ekrandaki dil" :options="LANGS" @update:model-value="setLang" />
          <small class="note">“Bugün”, “Okundu”, giriş kutusu gibi uygulama yazıları ve saat biçimi bu dile göre değişir.</small>
        </div>
      </div>
      <SettingsFields section="look" />
      <div v-if="settings.statusBar === true" class="fields pair">
        <div class="field">
          <label class="lbl" for="sb-clock">Saat</label>
          <input id="sb-clock" v-model="state.clock" type="text" maxlength="8" autocomplete="off" />
        </div>
        <div class="field">
          <label class="lbl" for="sb-battery">Pil · %{{ state.battery }}</label>
          <input id="sb-battery" v-model.number="state.battery" type="range" min="1" max="100" step="1" />
        </div>
      </div>
    </section>

    <footer class="ed-foot">
      <button type="button" class="link" @click="reset">Baştan başla</button>
      <a class="link" href="/licenses.txt" target="_blank" rel="noopener">Lisanslar</a>
    </footer>
  </aside>
</template>
