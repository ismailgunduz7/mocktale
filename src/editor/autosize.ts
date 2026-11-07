import type { Directive } from 'vue';

const fit = (el: HTMLTextAreaElement): void => {
  el.style.height = 'auto';
  el.style.height = `${el.scrollHeight + 2}px`;
};

/** A textarea that grows with its text instead of scrolling inside itself. */
export const vAutosize: Directive<HTMLTextAreaElement> = {
  mounted(el) {
    fit(el);
    el.addEventListener('input', () => fit(el));
  },
  updated(el) {
    fit(el);
  }
};
