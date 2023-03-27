import { isBrowser } from './env';
import { isFunction } from './is';

export function throttle(fn: Function, ctx?: any): any {
  let pending = false;
  let first = true;
  let args: typeof arguments | null = null;
  return function () {
    args = arguments;
    if (first) {
      first = false;
      return fn.apply(ctx, args);
    }

    if (pending) return;
    pending = true;

    requestAnimationFrame(() => {
      fn.apply(ctx, args);
      pending = false;
    });
  };
}

export function throttleTime(fn: Function, time = 0, ctx?: any) {
  let pending = false;
  let first = true;
  let args: typeof arguments | null = null;
  return function () {
    args = arguments;
    if (first) {
      first = false;
      return fn.apply(ctx, args);
    }

    if (pending) return;
    pending = true;

    setTimeout(() => {
      fn.apply(ctx, args);
      pending = false;
    }, time);
  };
}

export function getChangedAttrs<T extends Record<string, any>>(newV: Partial<T>, oldV: Partial<T>, updateOld = false) {
  const patch: [keyof T, Partial<T>[keyof T], Partial<T>[keyof T]][] = [];
  Object.keys(newV).forEach((x: keyof T) => {
    if (newV[x] !== oldV[x]) {
      patch.push([x, newV[x], oldV[x]]);
      if (updateOld) oldV[x] = newV[x];
    }
  });
  return patch;
}

export const nextTick = isBrowser && 'queueMicrotask' in window && isFunction(queueMicrotask) ? queueMicrotask : (fn: () => void) => Promise.resolve().then(fn);
