import { reactive, shallowRef } from 'vue';
import baseCss from '@/shot/base.css?inline';
import { renderPng, type RenderOutput } from '@/export/render';
import { frameById } from '@/state/frames';
import { current, state } from '@/state/store';

/** The mounted mock, for the exporter. Only one is mounted at a time. */
export const shotEl = shallowRef<HTMLElement | null>(null);

/** Live facts about the mock, measured after every layout change. */
export const shotInfo = reactive({ width: 0, height: 0, scrollRange: 0 });

export const SHOT_BASE_CSS = baseCss;

export async function exportShot(): Promise<RenderOutput> {
  const node = shotEl.value;
  if (!node) throw new Error('no shot');
  return renderPng({
    node,
    css: `${SHOT_BASE_CSS}\n${current.value.css}`,
    scale: state.scale,
    size: frameById(state.frame).out
  });
}
