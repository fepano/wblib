import { Destroyable } from './destroyable';
import { isIOSLt15 } from './env';

export interface DragEvent {
  clientX: number;
  clientY: number;
}

type Fn = (ev: DragEvent) => any;

function getDragEvent(ev: TouchEvent) {
  const t = ev.changedTouches[0] || {};
  return { clientX: t.clientX || 0, clientY: t.clientY || 0 };
}

export class Drag implements Destroyable {
  private pending = false;

  private lastEv!: PointerEvent | TouchEvent;

  private rafId!: any;

  constructor(private el: HTMLElement, private start: Fn, private move: Fn, private end?: Fn) {
    this.el = el;
    this.start = start;
    this.move = move;
    this.end = end;

    if (isIOSLt15) {
      el.addEventListener('touchstart', this.touchDownHandler, true);
      el.addEventListener('touchmove', this.touchMoveHandler, true);
      el.addEventListener('touchend', this.touchUpHandler, true);
      el.addEventListener('touchcancel', this.touchUpHandler, true);
    } else {
      el.addEventListener('pointerdown', this.downHandler, true);
    }
  }

  private downHandler = (ev: PointerEvent) => {
    this.el.setPointerCapture(ev.pointerId);
    this.el.addEventListener('pointermove', this.moveHandler, true);
    this.el.addEventListener('pointerup', this.upHandler, true);
    this.el.addEventListener('pointercancel', this.upHandler, true);
    this.start(ev);
  };

  private touchDownHandler = (ev: TouchEvent) => {
    ev.preventDefault();
    this.start(getDragEvent(ev));
  };

  private moveHandler = (ev: PointerEvent) => {
    this.lastEv = ev;
    if (this.pending) return;
    this.pending = true;
    this.rafId = requestAnimationFrame(this.handlerMove);
  };

  private handlerMove = () => {
    this.move(this.lastEv as PointerEvent);
    this.pending = false;
  };

  private touchMoveHandler = (ev: TouchEvent) => {
    this.lastEv = ev;
    if (this.pending) return;
    this.pending = true;
    this.rafId = requestAnimationFrame(this.handlerTouchMove);
  };

  private handlerTouchMove = () => {
    this.move(getDragEvent(this.lastEv as TouchEvent));
    this.pending = false;
  };

  private upHandler = (ev: PointerEvent) => {
    this.removePointerEvents();
    this.pending = false;
    if (this.end) {
      cancelAnimationFrame(this.rafId);
      this.end(ev);
    }
  };

  private touchUpHandler = (ev: TouchEvent) => {
    this.pending = false;
    if (this.end) {
      cancelAnimationFrame(this.rafId);
      this.end(getDragEvent(ev));
    }
  };

  private removePointerEvents() {
    this.el.removeEventListener('pointermove', this.moveHandler, true);
    this.el.removeEventListener('pointerup', this.upHandler, true);
    this.el.removeEventListener('pointercancel', this.upHandler, true);
  }

  destroy() {
    if (!this.el) return;
    this.el.removeEventListener('touchstart', this.touchDownHandler, true);
    this.el.removeEventListener('touchmove', this.touchMoveHandler, true);
    this.el.removeEventListener('touchend', this.touchUpHandler, true);
    this.el.removeEventListener('touchcancel', this.touchUpHandler, true);
    this.el.removeEventListener('pointerdown', this.downHandler, true);
    this.removePointerEvents();
    this.el = null!;
  }
}
