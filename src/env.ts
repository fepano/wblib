export const isBrowser = typeof window !== 'undefined';
export const isMobile = isBrowser && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
