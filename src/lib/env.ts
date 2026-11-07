const ua = typeof navigator === 'undefined' ? '' : navigator.userAgent;

/** iPhone and iPad, including iPadOS that reports itself as a Mac but has touch. */
export const isIOS =
  /iPad|iPhone|iPod/.test(ua) ||
  (typeof navigator !== 'undefined' && navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

/**
 * Every browser on iOS, and Safari on the Mac. WebKit paints images and fonts inside an SVG
 * picture lazily, which the exporter has to work around.
 */
export const isWebKit = isIOS || (/AppleWebKit/.test(ua) && !/Chrome|Chromium|Edg|OPR|Android/.test(ua));

/** A phone or tablet: the finished image goes to the share sheet instead of a download. */
export const isTouchDevice =
  typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches === true;

/**
 * True when the system font is Apple's San Francisco. No website may serve SF itself, so the
 * Apple-looking mocks use it where the device has it and fall back to Inter elsewhere.
 */
export const hasAppleSystemFont: boolean = (() => {
  try {
    const c = document.createElement('canvas').getContext('2d');
    if (!c) return false;
    const width = (family: string): number => {
      c.font = `40px ${family}`;
      return c.measureText('Mocktale ağırlık 0123').width;
    };
    return width('-apple-system, BlinkMacSystemFont, monospace') !== width('monospace');
  } catch {
    return false;
  }
})();
