<script setup lang="ts">
import { ref } from 'vue';
import { readImage } from '@/lib/images';
import { toast } from './toast';

const props = defineProps<{ value: string | null; round?: boolean; label: string }>();
const emit = defineEmits<{ change: [value: string | null] }>();

const input = ref<HTMLInputElement | null>(null);
const busy = ref(false);

async function picked(): Promise<void> {
  const file = input.value?.files?.[0];
  if (input.value) input.value.value = '';
  if (!file) return;
  busy.value = true;
  try {
    // Avatars and icons are small on screen; wallpapers need more pixels.
    emit('change', await readImage(file, props.round ? 320 : 1600));
  } catch {
    toast('Bu dosya görsel olarak açılamadı.');
  } finally {
    busy.value = false;
  }
}
</script>

<template>
  <div class="pick">
    <span class="pick-thumb" :class="{ round }">
      <img v-if="value" :src="value" alt="" />
    </span>
    <button type="button" class="btn small" :disabled="busy" @click="input?.click()">
      {{ busy ? 'Okunuyor…' : value ? 'Değiştir' : 'Görsel seç' }}
    </button>
    <button v-if="value" type="button" class="btn small quiet" @click="emit('change', null)">Kaldır</button>
    <input ref="input" type="file" accept="image/*" hidden :aria-label="label" @change="picked" />
  </div>
</template>
