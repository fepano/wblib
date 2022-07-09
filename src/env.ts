export const isBrowser = typeof window !== 'undefined';
export const isTouch = isBrowser && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
