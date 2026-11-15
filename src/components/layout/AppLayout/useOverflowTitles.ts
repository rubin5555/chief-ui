import { useEffect } from 'react';

const AUTO_TITLE_ATTR = 'data-auto-title';

const TOLERANCE = 1;

const MAX_ANCESTOR_DEPTH = 4;

const isEditable = (el: HTMLElement) =>
  el.isContentEditable || el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;

const isClipped = (el: HTMLElement) => {
  const overflowsInline = el.scrollWidth - el.clientWidth > TOLERANCE;
  const overflowsBlock = el.scrollHeight - el.clientHeight > TOLERANCE;
  if (!overflowsInline && !overflowsBlock) return false;

  const style = getComputedStyle(el);
  if (overflowsBlock && style.webkitLineClamp !== 'none') return true;
  return overflowsInline && style.textOverflow === 'ellipsis';
};

const syncTitle = (el: HTMLElement) => {
  const isOurs = el.hasAttribute(AUTO_TITLE_ATTR);

  if (el.title && !isOurs) return false;

  const text = el.textContent?.trim() ?? '';
  if (text && !isEditable(el) && isClipped(el)) {
    el.title = text;
    el.setAttribute(AUTO_TITLE_ATTR, '');
    return true;
  }

  if (isOurs) {
    el.removeAttribute('title');
    el.removeAttribute(AUTO_TITLE_ATTR);
  }
  return false;
};

export const useOverflowTitles = () => {
  useEffect(() => {
    const handle = (event: Event) => {
      let el = event.target instanceof HTMLElement ? event.target : null;

      for (let depth = 0; el && depth < MAX_ANCESTOR_DEPTH; depth += 1) {
        if (syncTitle(el)) return;
        el = el.parentElement;
      }
    };

    document.addEventListener('mouseover', handle);
    document.addEventListener('focusin', handle);

    return () => {
      document.removeEventListener('mouseover', handle);
      document.removeEventListener('focusin', handle);
    };
  }, []);
};
