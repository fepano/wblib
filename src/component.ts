import { $, removeNode } from './dom';
import { isString } from './is';
import { destroy, Destroyable } from './destroyable';
import { EventEmitter, ValidEventTypes } from './emitter';

function getEl(
  container?: HTMLElement | DocumentFragment,
  desc?: string | HTMLElement,
  attrs?: { [key: string]: any; },
  children?: string | Array<Node>,
  classPrefix?: string,
) {
  let el;
  if (desc && !isString(desc)) {
    el = desc;
  } else {
    el = $(desc, attrs, children, classPrefix);
  }
  if (container) container.appendChild(el);
  return el;
}

export class Component implements Destroyable {
  el: HTMLElement;

  constructor(
    container?: HTMLElement | DocumentFragment,
    desc?: string | HTMLElement,
    attrs?: { [key: string]: any; },
    children?: string | Array<Node>,
    classPrefix?: string,
  ) {
    this.el = getEl(container, desc, attrs, children, classPrefix);
  }

  destroy() {
    removeNode(this.el);
    destroy(this);
  }
}

export class EventEmitterComponent<
  EventTypes extends ValidEventTypes = string | symbol,
  Context = any
> extends EventEmitter<EventTypes, Context> implements Component {
  el: HTMLElement;

  constructor(
    container?: HTMLElement | DocumentFragment,
    desc?: string | HTMLElement,
    attrs?: { [key: string]: any; },
    children?: string | Array<Node>,
    classPrefix?: string,
  ) {
    super();
    this.el = getEl(container, desc, attrs, children, classPrefix);
  }

  destroy() {
    removeNode(this.el);
    destroy(this);
  }
}
