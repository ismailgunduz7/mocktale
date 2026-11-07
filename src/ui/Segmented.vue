<script setup lang="ts" generic="T extends string | number">
defineProps<{ options: { value: T; label: string }[]; label?: string }>();
const model = defineModel<T>({ required: true });
</script>

<template>
  <div class="seg" role="radiogroup" :aria-label="label">
    <button
      v-for="o in options"
      :key="String(o.value)"
      type="button"
      role="radio"
      :aria-checked="model === o.value"
      :class="{ on: model === o.value }"
      @click="model = o.value"
    >
      {{ o.label }}
    </button>
  </div>
</template>
