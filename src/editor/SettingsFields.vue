<script setup lang="ts">
import { computed } from 'vue';
import { current, setSetting, settings } from '@/state/store';
import ImagePick from '@/ui/ImagePick.vue';
import Segmented from '@/ui/Segmented.vue';
import Switch from '@/ui/Switch.vue';

const props = defineProps<{ section: 'platform' | 'look' }>();

const fields = computed(() =>
  current.value.fields.filter(
    (f) => (f.section ?? 'platform') === props.section && (!f.when || f.when(settings.value))
  )
);

const text = (key: string): string => String(settings.value[key] ?? '');
const flag = (key: string): boolean => settings.value[key] === true;
const image = (key: string): string | null => (typeof settings.value[key] === 'string' ? (settings.value[key] as string) : null);
const id = (key: string): string => `f-${current.value.id}-${key}`;
</script>

<template>
  <div class="fields">
    <template v-for="f in fields" :key="f.key">
      <div v-if="f.type === 'toggle'" class="field inline">
        <label class="lbl" :for="id(f.key)">{{ f.label }}</label>
        <Switch :id="id(f.key)" :label="f.label" :model-value="flag(f.key)" @update:model-value="setSetting(f.key, $event)" />
        <small v-if="f.hint" class="note">{{ f.hint }}</small>
      </div>
      <div v-else-if="f.type === 'choice'" class="field">
        <span class="lbl">{{ f.label }}</span>
        <Segmented
          v-if="f.options.length <= 3"
          :label="f.label"
          :options="f.options"
          :model-value="text(f.key)"
          @update:model-value="setSetting(f.key, $event)"
        />
        <select v-else :id="id(f.key)" :value="text(f.key)" :aria-label="f.label" @change="setSetting(f.key, ($event.target as HTMLSelectElement).value)">
          <option v-for="o in f.options" :key="o.value" :value="o.value">{{ o.label }}</option>
        </select>
        <small v-if="f.hint" class="note">{{ f.hint }}</small>
      </div>
      <div v-else-if="f.type === 'image'" class="field">
        <span class="lbl">{{ f.label }}</span>
        <ImagePick :label="f.label" :value="image(f.key)" :round="f.round" @change="setSetting(f.key, $event)" />
        <small v-if="f.hint" class="note">{{ f.hint }}</small>
      </div>
      <div v-else class="field">
        <label class="lbl" :for="id(f.key)">{{ f.label }}</label>
        <input
          :id="id(f.key)"
          type="text"
          :value="text(f.key)"
          :placeholder="f.placeholder"
          :maxlength="f.maxlength"
          autocomplete="off"
          @input="setSetting(f.key, ($event.target as HTMLInputElement).value)"
        />
        <small v-if="f.hint" class="note">{{ f.hint }}</small>
      </div>
    </template>
  </div>
</template>
