export const isBrowser = typeof window !== 'undefined';
export const isTouch = isBrowser && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
export const isIOS = isTouch && /iPad|iPhone|iPod/.test(navigator.userAgent);
export const isIOSLt15 = isIOS && /Version\/1[0-4]/.test(navigator.userAgent);
