import type { RefObject } from 'react';
import { useEffect } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// The only sanctioned direct-DOM *writer* in this codebase.
//
// Everything else here renders; this measures laid-out boxes and pushes the ones
// that straddle an A4 page boundary down to the top of the next page, which is
// not something CSS can express — there is no "don't split me across a page" in a
// scrolling viewport, only in print.
//
// It is parked because the page-break lines a reader actually sees are the pure
// CSS repeating gradient on the paper (PaperCanvas), and that needs no JS. Promote
// this into PaperCanvas only if the reflow itself is wanted.
//
// Against main (Edit.tsx:3599-3647): main runs this exactly once on mount, with
// `[]` deps and no observer, so it is stale the moment anyone types; and it builds
// and destroys a measuring probe on every run. Here a ResizeObserver re-runs it as
// content grows, the probe is measured once per session, and both passes share one
// animation frame.
// ─────────────────────────────────────────────────────────────────────────────

const PAGE_HEIGHT_MM = 297;
const TOP_MARGIN_MM = 16;
const PAGE_BOX_SELECTOR = '[data-page-box]';

// 297mm in CSS pixels. A constant for the life of the document, so it is measured
// once rather than per pass — main appends a fresh probe to <body> each time.
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

/** How far into the next page a pushed box lands. */
const topPadding = (pageHeightPx: number) => (pageHeightPx / PAGE_HEIGHT_MM) * TOP_MARGIN_MM;

const crossesBreak = (relTop: number, height: number, pageHeightPx: number) => {
  const breakY = (Math.floor(relTop / pageHeightPx) + 1) * pageHeightPx;
  return relTop + height > breakY ? breakY : null;
};

const reflow = (paper: HTMLElement) => {
  const pageHeightPx = measurePageHeightPx();
  const boxes = Array.from(paper.querySelectorAll<HTMLElement>(PAGE_BOX_SELECTOR));

  // Start from a clean slate, or yesterday's offsets compound into today's.
  for (const box of boxes) box.style.marginTop = '';

  // Pass 1 — land each straddling box one top-margin below the break. The previous
  // sibling's bottom margin collapses with the one being set, so it is added back
  // to move the box by exactly the distance intended.
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

  // Pass 2 — a box moved in pass 1 can land straddling the *next* break. Nudge it
  // clear, without the top margin: this is a correction, not a placement.
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
    // One frame for both passes, and never more than one in flight: a ResizeObserver
    // fires per resized element, and a table growing a row would otherwise queue a
    // full reflow for every box on the page.
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => reflow(paper));
    };

    schedule();

    // Only the boxes, never the paper: the paper's height is an *output* of this
    // reflow — pushing a box down makes the sheet taller — so observing it feeds
    // straight back in.
    //
    // And only their *heights*. A box's width changes for reasons this reflow
    // causes but doesn't care about: pushing content past the bottom of a
    // scrolling container makes a scrollbar appear, which narrows every box by
    // its width. Reacting to that is the loop — grow, narrow, re-measure, clear
    // the margins, shrink, widen, set them again, forever. Height is the only
    // input that can actually move a page break.
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
