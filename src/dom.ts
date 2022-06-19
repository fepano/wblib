import { isString } from './is';

const SELECTOR_REGEX = /([\w-]+)?(?:#([\w-]+))?((?:\.(?:[\w-]+))*)/;

export function $<T extends HTMLElement>(
  desc?: string,
  attrs?: { [key: string]: any; },
  children?: string | Array<Node>,
  classPrefix = '',
): T {
  let match: string[] = [];

  if (desc) match = SELECTOR_REGEX.exec(desc) || [];

  const el = document.createElement(match[1] || 'div');

  if (match[2]) el.id = match[3];
  if (match[3]) el.className = match[3].replace(/\./g, ` ${classPrefix}`).trim();

  if (attrs) {
    Object.keys(attrs).forEach((name) => {
      const value = attrs[name];
      if (value === undefined) return;

      if (/^on\w+$/.test(name)) {
        (el as any)[name] = value;
      } else if (name === 'selected') {
        if (value) {
          el.setAttribute(name, 'true');
        }
      } else {
        el.setAttribute(name, value);
      }
    });
  }

  if (children) {
    if (isString(children)) {
      el.innerHTML = children;
    } else {
      children.forEach((c) => el.appendChild(c));
    }
  }

  return el as T;
}

export function removeNode(node: Element): void {
  if (!node) return;
  if (node.remove) {
    node.remove();
  } else if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
}

export function show(node: HTMLElement | SVGElement): void {
  node.style.display = '';
}

export function hide(node: HTMLElement | SVGElement): void {
  node.style.display = 'none';
}

export function addClass<T extends Element>(dom: T, cls = '', prefix = ''): T {
  cls = cls.trim();
  if (!cls) return dom;
  if (dom.classList) {
    cls.split(' ').forEach((c) => dom.classList.add(prefix + c));
  } else {
    const oldCls = (dom.className && (dom.className as any).baseVal) || '';
    dom.setAttribute('class', (oldCls ? `${oldCls} ` : '') + cls.split(' ').map((c) => prefix + c).join(' '));
  }
  return dom;
}

export function removeClass<T extends Element>(dom: T, cls: string, prefix = ''): T {
  dom.classList.remove(prefix + cls);
  return dom;
}

export function containClass(dom: Element, cls: string, prefix = ''): boolean {
  return dom.classList.contains(prefix + cls);
}

export function toggleClass(dom: Element, cls: string, force?: boolean, prefix = ''): boolean {
  cls = prefix + cls;
  if (force) {
    dom.classList.add(cls);
    return true;
  } if (force === false) {
    dom.classList.remove(cls);
    return true;
  }
  return dom.classList.toggle(cls, force);
}

export const svgNS = 'http://www.w3.org/2000/svg';
