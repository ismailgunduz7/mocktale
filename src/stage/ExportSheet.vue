<script setup lang="ts">
import { computed, onBeforeUnmount } from 'vue';
import { isIOS } from '@/lib/env';
import { canShareFiles, download, shareImage } from '@/export/deliver';
import Icon from '@/ui/Icon.vue';
import { toast } from '@/ui/toast';

const props = defineProps<{ blob: Blob; name: string; width: number; height: number }>();
const emit = defineEmits<{ close: []; saved: [] }>();

const url = URL.createObjectURL(props.blob);
onBeforeUnmount(() => URL.revokeObjectURL(url));

const shareable = computed(() => canShareFiles());

async function share(): Promise<void> {
  try {
    if (await shareImage(props.blob, props.name)) emit('saved');
  } catch {
    toast('Paylaşım açılamadı. Görsele basılı tutarak kaydedebilirsin.');
  }
}

function save(): void {
  download(props.blob, props.name);
  emit('saved');
}
</script>

<template>
  <div class="sheet-back" @click.self="emit('close')">
    <div class="sheet" role="dialog" aria-modal="true" aria-label="Görsel hazır">
      <div class="sheet-head">
        <strong>Görsel hazır</strong>
        <span class="sheet-size">{{ width }} × {{ height }}</span>
        <button type="button" class="icon-btn" aria-label="Kapat" @click="emit('close')">
          <Icon name="close" :size="18" />
        </button>
      </div>
      <div class="sheet-img">
        <img :src="url" alt="Hazırlanan sohbet görüntüsü" />
      </div>
      <p v-if="isIOS" class="note">Görsele basılı tutup “Fotoğraflar'a Ekle”yi de seçebilirsin.</p>
      <div class="sheet-acts">
        <button v-if="shareable" type="button" class="btn primary" @click="share">
          <Icon name="share" :size="17" />
          Paylaş veya kaydet
        </button>
        <button type="button" class="btn" :class="{ primary: !shareable }" @click="save">
          <Icon name="download" :size="17" />
          İndir
        </button>
      </div>
    </div>
  </div>
</template>
