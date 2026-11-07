<script setup lang="ts">
import { toastText } from './toast';
</script>

<template>
  <div class="toast" :class="{ show: toastText }" role="status" aria-live="polite">{{ toastText }}</div>
</template>
