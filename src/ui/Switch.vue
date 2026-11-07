<script setup lang="ts">
defineProps<{ label: string }>();
const model = defineModel<boolean>({ required: true });
</script>

<template>
  <button type="button" class="switch" role="switch" :aria-checked="model" :aria-label="label" @click="model = !model">
    <span class="knob" />
  </button>
</template>
