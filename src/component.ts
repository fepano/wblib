import { $, removeNode } from './dom';
import { isString } from './is';
import { destroy, Destroyable } from './destroyable';

export class Component implements Destroyable {
  el: HTMLElement;

  constructor(
    container?: HTMLElement | DocumentFragment,
    desc?: string | HTMLElement,
    attrs?: { [key: string]: any; },
    children?: string | Array<Node>,
    classPrefix?: string,
  ) {
    if (desc && !isString(desc)) {
      this.el = desc;
    } else {
      this.el = $(desc, attrs, children, classPrefix);
    }
    if (container) container.appendChild(this.el);
  }

  destroy() {
    removeNode(this.el);
    destroy(this);
  }
}
