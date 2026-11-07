// @vitest-environment happy-dom
import { createApp, nextTick } from 'vue';
import { describe, expect, it } from 'vitest';
import App from './App.vue';
import { PLATFORMS } from './platforms';
import { state, thread } from './state/store';

const tick = async (): Promise<void> => {
  await nextTick();
  await new Promise((r) => setTimeout(r, 0));
};

describe('the app', () => {
  it('mounts, switches every platform and edits a conversation', async () => {
    document.body.innerHTML = '<div id="app"></div>';
    const app = createApp(App);
    app.mount('#app');
    await tick();

    expect(document.querySelector('.shot.p-gemini')).not.toBeNull();
    expect(document.title).toContain('Gemini');

    for (const p of PLATFORMS) {
      const link = document.querySelector<HTMLAnchorElement>(`a.pk[href="/${p.slug}"]`);
      expect(link).not.toBeNull();
      link?.click();
      await tick();
      expect(state.platform).toBe(p.id);
      // The start page already is Gemini, so its address stays "/" until another platform is picked.
      expect([`/${p.slug}`, '/']).toContain(location.pathname);
      const shot = document.querySelector('.shot');
      expect(shot?.className).toContain(p.rootClass ?? `p-${p.id}`);
    }

    // On a messaging app now: add a message and a divider, then change the frame.
    const before = thread.value.length;
    const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('.add .btn'));
    buttons[0]?.click();
    buttons[2]?.click();
    await tick();
    expect(thread.value.length).toBe(before + 2);
    expect(state.dirty).toBe(true);

    state.frame = 'ig45';
    await tick();
    expect(document.querySelector('.shot.fixed')).not.toBeNull();

    app.unmount();
  });
});
