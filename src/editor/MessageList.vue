<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import { readImages } from '@/lib/images';
import {
  addDivider,
  addMessage,
  category,
  current,
  moveMessage,
  removeMessage,
  sideLabels,
  thread,
  touched
} from '@/state/store';
import type { Message, Receipt, Side } from '@/state/types';
import Icon from '@/ui/Icon.vue';
import { toast } from '@/ui/toast';
import { vAutosize } from './autosize';

const list = ref<HTMLElement | null>(null);

const finalId = computed(() => [...thread.value].reverse().find((m) => m.kind === 'message')?.id);

const RECEIPTS: { value: Receipt; label: string }[] = [
  { value: 'sent', label: 'Gönderildi' },
  { value: 'delivered', label: 'İletildi' },
  { value: 'read', label: 'Okundu' }
];

/** Receipts are per message in WhatsApp, and only under the last one elsewhere. */
const showReceipt = (m: Message): boolean =>
  m.side === 'me' && (current.value.receipts === 'each' || (current.value.receipts === 'last' && m.id === finalId.value));

const placeholder = (m: Message): string => {
  if (category.value === 'chat') return 'Mesaj';
  return m.side === 'me' ? 'Sorduğun şey' : 'Yanıt';
};

function flip(m: Message): void {
  m.side = m.side === 'me' ? 'them' : 'me';
  touched();
}

async function attach(m: Message, e: Event): Promise<void> {
  const input = e.target as HTMLInputElement;
  const files = input.files;
  if (!files?.length) return;
  const images = await readImages(files);
  input.value = '';
  if (!images.length) {
    toast('Seçilen dosyalar görsel olarak açılamadı.');
    return;
  }
  m.images.push(...images);
  touched();
}

function dropImage(m: Message, k: number): void {
  m.images.splice(k, 1);
  touched();
}

async function add(side: Side): Promise<void> {
  addMessage(side);
  await nextTick();
  const areas = list.value?.querySelectorAll('textarea');
  areas?.[areas.length - 1]?.focus();
}
</script>

<template>
  <div ref="list" class="msgs">
    <div v-for="(m, i) in thread" :key="m.id" class="msg" :class="[m.kind, m.side]">
      <div v-if="m.kind === 'divider'" class="msg-divider">
        <input v-model="m.text" class="div-input" aria-label="Tarih ayracı" placeholder="Bugün" @input="touched" />
        <div class="tools">
          <button type="button" class="icon-btn" :disabled="i === 0" aria-label="Yukarı taşı" @click="moveMessage(m.id, -1)">
            <Icon name="up" :size="16" />
          </button>
          <button
            type="button"
            class="icon-btn"
            :disabled="i === thread.length - 1"
            aria-label="Aşağı taşı"
            @click="moveMessage(m.id, 1)"
          >
            <Icon name="down" :size="16" />
          </button>
          <button type="button" class="icon-btn" aria-label="Ayracı sil" @click="removeMessage(m.id)">
            <Icon name="trash" :size="16" />
          </button>
        </div>
      </div>
      <template v-else>
        <div class="msg-head">
          <button type="button" class="side" :class="m.side" :title="'Tarafı değiştir'" @click="flip(m)">
            {{ sideLabels[m.side] }}
            <Icon name="swap" :size="13" />
          </button>
          <input v-if="current.times" v-model="m.time" type="time" class="mini" aria-label="Saat" @input="touched" />
          <select v-if="showReceipt(m)" v-model="m.receipt" class="mini" aria-label="İletim durumu" @change="touched">
            <option v-for="r in RECEIPTS" :key="r.value" :value="r.value">{{ r.label }}</option>
          </select>
          <div class="tools">
            <label class="icon-btn" title="Görsel ekle">
              <Icon name="image" :size="16" />
              <input type="file" accept="image/*" multiple hidden aria-label="Görsel ekle" @change="attach(m, $event)" />
            </label>
            <button type="button" class="icon-btn" :disabled="i === 0" aria-label="Yukarı taşı" @click="moveMessage(m.id, -1)">
              <Icon name="up" :size="16" />
            </button>
            <button
              type="button"
              class="icon-btn"
              :disabled="i === thread.length - 1"
              aria-label="Aşağı taşı"
              @click="moveMessage(m.id, 1)"
            >
              <Icon name="down" :size="16" />
            </button>
            <button type="button" class="icon-btn" aria-label="Mesajı sil" @click="removeMessage(m.id)">
              <Icon name="trash" :size="16" />
            </button>
          </div>
        </div>
        <textarea v-model="m.text" v-autosize rows="1" :placeholder="placeholder(m)" :aria-label="`${sideLabels[m.side]} mesajı`" @input="touched" />
        <div v-if="m.images.length" class="thumbs">
          <div v-for="(src, k) in m.images" :key="k" class="thumb">
            <img :src="src" alt="" />
            <button type="button" aria-label="Görseli kaldır" @click="dropImage(m, k)">
              <Icon name="close" :size="12" />
            </button>
          </div>
        </div>
      </template>
    </div>
    <p v-if="!thread.length" class="empty">Henüz mesaj yok. Aşağıdan ilkini ekle.</p>
    <div class="add">
      <button type="button" class="btn" @click="add('me')">
        <Icon name="plus" :size="16" />
        {{ sideLabels.me }}
      </button>
      <button type="button" class="btn" @click="add('them')">
        <Icon name="plus" :size="16" />
        {{ sideLabels.them }}
      </button>
      <button v-if="category === 'chat'" type="button" class="btn quiet" @click="addDivider">
        <Icon name="plus" :size="16" />
        Tarih
      </button>
    </div>
    <p v-if="current.formatHint" class="hint">{{ current.formatHint }}</p>
  </div>
</template>
