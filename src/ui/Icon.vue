<script setup lang="ts">
import { UI_ICONS, type UiIcon } from './icons';

withDefaults(defineProps<{ name: UiIcon; size?: number }>(), { size: 18 });
</script>

<template>
  <svg
    class="ico"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.7"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
    v-html="UI_ICONS[name]"
  />
</template>
