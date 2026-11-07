import { ref } from 'vue';

export const toastText = ref('');
let timer = 0;

/** A short note at the top of the screen that goes away by itself. */
export function toast(text: string, ms = 2600): void {
  toastText.value = text;
  clearTimeout(timer);
  timer = window.setTimeout(() => (toastText.value = ''), ms);
}
