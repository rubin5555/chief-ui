import { useEffect } from 'react';

/**
 * Marks a `title` this hook wrote, so it can be taken away again without ever
 * touching one the application set itself.
 */
const AUTO_TITLE_ATTR = 'data-auto-title';

/** Sub-pixel layout rounding routinely reports a 0.5px overflow on text that fits. */
const TOLERANCE = 1;

/**
 * How far up from the hovered element to look for the one doing the clipping.
 * The text under the cursor is usually in the clipping element itself, sometimes
 * in a span inside it; past a few levels the answer is some layout container that
 * happens to scroll, which is not a truncated label.
 */
const MAX_ANCESTOR_DEPTH = 4;

const isEditable = (el: HTMLElement) =>
  el.isContentEditable || el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;

/**
 * Whether this element is cutting its own text off — as opposed to merely being
 * a box with more inside it than fits, which describes every scroll container in
 * the app.
 *
 * The measurement comes first because it is nearly free and almost always false;
 * getComputedStyle, which is the expensive half, then runs on a handful of
 * elements per hover rather than on all of them.
 */
const isClipped = (el: HTMLElement) => {
  const overflowsInline = el.scrollWidth - el.clientWidth > TOLERANCE;
  const overflowsBlock = el.scrollHeight - el.clientHeight > TOLERANCE;
  if (!overflowsInline && !overflowsBlock) return false;

  const style = getComputedStyle(el);
  if (overflowsBlock && style.webkitLineClamp !== 'none') return true;
  return overflowsInline && style.textOverflow === 'ellipsis';
};

/**
 * Give this element the tooltip it needs, take away the one it no longer needs,
 * or leave it alone. Returns whether it turned out to be the clipping element.
 */
const syncTitle = (el: HTMLElement) => {
  const isOurs = el.hasAttribute(AUTO_TITLE_ATTR);

  // A title the component wrote is a deliberate one — `השוואת גרסאות` on an icon
  // button says more than the glyph's own text would. Never overwrite it.
  if (el.title && !isOurs) return false;

  const text = el.textContent?.trim() ?? '';
  if (text && !isEditable(el) && isClipped(el)) {
    el.title = text;
    el.setAttribute(AUTO_TITLE_ATTR, '');
    return true;
  }

  // It fits now — the window widened, the title was shortened, the sidebar was
  // dragged open. A tooltip repeating text that is fully visible is noise.
  if (isOurs) {
    el.removeAttribute('title');
    el.removeAttribute(AUTO_TITLE_ATTR);
  }
  return false;
};

/**
 * Any text the interface has had to cut short gets a tooltip with the whole of
 * it, everywhere, without a component having to ask.
 *
 * Truncation is a styling decision — `${ellipsis}` in some `.styles.ts` — and it
 * is settled at layout time by how much room the element got, which is something
 * no component knows about itself. So the tooltip is decided the same way and at
 * the same moment: on hover, by measuring. Threading a `title` through the thirty
 * odd components that use the mixin would mean each of them guessing, and each of
 * them guessing wrong at some window width.
 *
 * Deliberately the native `title` rather than a rendered tooltip: nothing is
 * mounted, nothing is positioned, and the browser handles the delay, the
 * placement near the edge of the screen, and the case where the pointer leaves
 * mid-hover. A styled tooltip would have to re-earn all of that to show a string
 * the reader already half sees.
 *
 * One delegated listener rather than one per element — the elements that could
 * qualify are most of the text in the app, and only the one under the pointer
 * matters.
 */
export const useOverflowTitles = () => {
  useEffect(() => {
    const handle = (event: Event) => {
      let el = event.target instanceof HTMLElement ? event.target : null;

      for (let depth = 0; el && depth < MAX_ANCESTOR_DEPTH; depth += 1) {
        if (syncTitle(el)) return;
        el = el.parentElement;
      }
    };

    // Hover for the pointer, focus for the keyboard: a row reached by tabbing is
    // just as truncated as one reached by hovering, and `title` shows on focus too.
    document.addEventListener('mouseover', handle);
    document.addEventListener('focusin', handle);

    return () => {
      document.removeEventListener('mouseover', handle);
      document.removeEventListener('focusin', handle);
    };
  }, []);
};
