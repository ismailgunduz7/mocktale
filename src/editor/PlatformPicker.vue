<script setup lang="ts">
import { PLATFORMS } from '@/platforms';
import { setPlatform, state } from '@/state/store';

const groups = [
  { title: 'Yapay zekâ', items: PLATFORMS.filter((p) => p.category === 'ai') },
  { title: 'Mesajlaşma', items: PLATFORMS.filter((p) => p.category === 'chat') }
];
</script>

<template>
  <nav class="picker" aria-label="Platform">
    <div v-for="g in groups" :key="g.title" class="pk-group">
      <h3 class="pk-title">{{ g.title }}</h3>
      <div class="pk-grid">
        <a
          v-for="p in g.items"
          :key="p.id"
          :href="`/${p.slug}`"
          class="pk"
          :class="{ on: state.platform === p.id }"
          :aria-current="state.platform === p.id ? 'page' : undefined"
          @click.prevent="setPlatform(p.id)"
        >
          <span class="pk-dot" :style="{ background: p.swatch }" />
          <span class="pk-name">
            {{ p.name }}
            <small v-if="p.note">{{ p.note }}</small>
          </span>
        </a>
      </div>
    </div>
  </nav>
</template>
