import { Destroyable } from './destroyable';

export class Rect implements Destroyable {
  private rect!: DOMRect;

  constructor(private el: HTMLElement) {
    this.rect = {} as DOMRect;
  }

  get width() {
    this.tryUpdate(this.rect.width);
    return this.rect.width;
  }

  get height() {
    this.tryUpdate(this.rect.height);
    return this.rect.height;
  }

  get x() {
    this.tryUpdate(this.rect.left);
    return this.rect.left;
  }

  get y() {
    this.tryUpdate(this.rect.top);
    return this.rect.top;
  }

  get bottom() {
    return this.rect.bottom;
  }

  get right() {
    return this.rect.right;
  }

  get changed() {
    const newRect = this.el.getBoundingClientRect();
    const ret = (
      newRect.top !== this.rect.top
      || newRect.left !== this.rect.left
      || newRect.width !== this.rect.width
      || newRect.height !== this.rect.height
    );
    if (ret) this.rect = newRect;
    return ret;
  }

  private tryUpdate(v: number) {
    if (!v) this.update();
  }

  update = () => {
    this.rect = this.el.getBoundingClientRect();
  };

  destroy() {
    this.el = null!;
    this.rect = null!;
  }
}
