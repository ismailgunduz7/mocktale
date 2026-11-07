<script setup lang="ts">
import { computed } from 'vue';
import type { Device } from '@/state/types';

const props = defineProps<{ device: Device; time: string; battery: number }>();

const level = computed(() => Math.min(100, Math.max(0, Math.round(props.battery))));
// iOS paints the battery red at 20% and below.
const low = computed(() => level.value <= 20);
</script>

<template>
  <div v-if="device === 'ios'" class="sb sb-ios">
    <span class="sb-time">{{ time }}</span>
    <span class="sb-island" />
    <span class="sb-icons">
      <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor" aria-hidden="true">
        <rect x="0" y="7.5" width="3.2" height="4" rx="0.9" />
        <rect x="4.8" y="5.2" width="3.2" height="6.3" rx="0.9" />
        <rect x="9.6" y="2.8" width="3.2" height="8.7" rx="0.9" />
        <rect x="14.4" y="0.5" width="3.2" height="11" rx="0.9" />
      </svg>
      <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor" aria-hidden="true">
        <path d="M8 2.3c2.3 0 4.4.9 6 2.4l1.1-1.2A10.2 10.2 0 0 0 8 .6 10.2 10.2 0 0 0 .9 3.5L2 4.7a8.6 8.6 0 0 1 6-2.4Z" />
        <path d="M8 5.6c1.4 0 2.6.5 3.6 1.4l1.1-1.2A7 7 0 0 0 8 3.9a7 7 0 0 0-4.7 1.9l1.1 1.2c1-.9 2.2-1.4 3.6-1.4Z" />
        <path d="M8 11.4 10.4 9a3.4 3.4 0 0 0-4.8 0L8 11.4Z" />
      </svg>
      <svg width="27" height="13" viewBox="0 0 27 13" aria-hidden="true">
        <rect x="0.5" y="0.5" width="23" height="12" rx="3.8" fill="none" stroke="currentColor" stroke-opacity="0.35" />
        <path d="M25 4.3v4.4a2.2 2.2 0 0 0 1.3-2.2A2.2 2.2 0 0 0 25 4.3Z" fill="currentColor" fill-opacity="0.4" />
        <rect
          x="2"
          y="2"
          :width="Math.max(1.6, 20 * (level / 100))"
          height="9"
          rx="2.4"
          :fill="low ? '#ff3b30' : 'currentColor'"
        />
      </svg>
    </span>
  </div>
  <div v-else class="sb sb-android">
    <span class="sb-time">{{ time }}</span>
    <span class="sb-icons">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 20.5 1.4 9.9a15 15 0 0 1 21.2 0L12 20.5Z" />
      </svg>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M2.5 21.5h19v-19l-19 19Z" />
      </svg>
      <svg width="16" height="17" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M9.5 2.5h5v1.8h1.6c.9 0 1.6.7 1.6 1.6v14c0 .9-.7 1.6-1.6 1.6H7.9c-.9 0-1.6-.7-1.6-1.6v-14c0-.9.7-1.6 1.6-1.6h1.6V2.5Z"
          fill="currentColor"
          fill-opacity="0.32"
        />
        <rect
          x="6.3"
          :y="21.5 - 17.2 * (level / 100)"
          width="11.4"
          :height="17.2 * (level / 100)"
          rx="1.6"
          fill="currentColor"
        />
      </svg>
    </span>
  </div>
</template>
