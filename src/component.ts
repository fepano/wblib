import { $, removeNode } from './dom';
import { isString } from './is';
import { destroy, Destroyable } from './destroyable';
import { EventEmitter, ValidEventTypes } from './emitter';

function getEl<T>(
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
  return el as unknown as T;
}

export class Component<T extends HTMLElement> implements Destroyable {
  el: T;

  constructor(
    container?: HTMLElement | DocumentFragment,
    desc?: string | HTMLElement,
    attrs?: { [key: string]: any; },
    children?: string | Array<Node>,
    classPrefix?: string,
  ) {
    this.el = getEl<T>(container, desc, attrs, children, classPrefix);
  }

  destroy() {
    removeNode(this.el);
    destroy(this);
  }
}

export class EventEmitterComponent<
  EventTypes extends ValidEventTypes = string | symbol,
  Context = any,
  T extends HTMLElement = HTMLElement,
> extends EventEmitter<EventTypes, Context> implements Component<T> {
  el: T;

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

export function createComponent(
  container2?: HTMLElement | DocumentFragment,
  desc2?: string | HTMLElement,
  attrs2?: { [key: string]: any; },
  children2?: string | Array<Node>,
  classPrefix2?: string,
) {
  return class <T extends HTMLElement> extends Component<T> {
    constructor(
      container?: HTMLElement | DocumentFragment,
      desc?: string | HTMLElement,
      attrs?: { [key: string]: any; },
      children?: string | Array<Node>,
      classPrefix?: string,
    ) {
      super(container || container2, desc || desc2, attrs || attrs2, children || children2, classPrefix || classPrefix2);
    }
  };
}
