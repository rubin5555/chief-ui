import type { RefObject } from 'react';
import { useEffect } from 'react';

const PAGE_HEIGHT_MM = 297;
const TOP_MARGIN_MM = 16;
const PAGE_BOX_SELECTOR = '[data-page-box]';

let cachedPageHeightPx: number | null = null;

const measurePageHeightPx = () => {
  if (cachedPageHeightPx !== null) return cachedPageHeightPx;
  const probe = document.createElement('div');
  probe.style.cssText =
    'position:fixed;top:0;left:0;width:297mm;height:0;visibility:hidden;pointer-events:none;';
  document.body.appendChild(probe);
  cachedPageHeightPx = probe.getBoundingClientRect().width;
  probe.remove();
  return cachedPageHeightPx;
};

const topPadding = (pageHeightPx: number) => (pageHeightPx / PAGE_HEIGHT_MM) * TOP_MARGIN_MM;

const crossesBreak = (relTop: number, height: number, pageHeightPx: number) => {
  const breakY = (Math.floor(relTop / pageHeightPx) + 1) * pageHeightPx;
  return relTop + height > breakY ? breakY : null;
};

const reflow = (paper: HTMLElement) => {
  const pageHeightPx = measurePageHeightPx();
  const boxes = Array.from(paper.querySelectorAll<HTMLElement>(PAGE_BOX_SELECTOR));

  for (const box of boxes) box.style.marginTop = '';

  for (const box of boxes) {
    const paperTop = paper.getBoundingClientRect().top;
    const rect = box.getBoundingClientRect();
    const relTop = rect.top - paperTop;
    const breakY = crossesBreak(relTop, rect.height, pageHeightPx);
    if (breakY === null) continue;

    const previous = box.previousElementSibling as HTMLElement | null;
    const collapsedAbove = previous
      ? Number.parseFloat(window.getComputedStyle(previous).marginBottom)
      : 0;
    box.style.marginTop = `${breakY - relTop + topPadding(pageHeightPx) + collapsedAbove}px`;
  }

  for (const box of boxes) {
    const paperTop = paper.getBoundingClientRect().top;
    const rect = box.getBoundingClientRect();
    const relTop = rect.top - paperTop;
    const breakY = crossesBreak(relTop, rect.height, pageHeightPx);
    if (breakY === null) continue;

    const current = Number.parseFloat(box.style.marginTop || '0');
    box.style.marginTop = `${current + (breakY - relTop) + 2}px`;
  }
};

export const usePageBreaks = (paperRef: RefObject<HTMLElement | null>) => {
  useEffect(() => {
    const paper = paperRef.current;
    if (!paper) return;

    let frame = 0;

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => reflow(paper));
    };

    schedule();

    const lastHeights = new WeakMap<Element, number>();
    const observer = new ResizeObserver((entries) => {
      const grewOrShrank = entries.some((entry) => {
        const height = entry.contentRect.height;
        const previous = lastHeights.get(entry.target);
        lastHeights.set(entry.target, height);
        return previous === undefined || Math.abs(previous - height) > 0.5;
      });
      if (grewOrShrank) schedule();
    });
    for (const box of paper.querySelectorAll<HTMLElement>(PAGE_BOX_SELECTOR)) observer.observe(box);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [paperRef]);
};
