import { useEffect, useState } from 'react';

export interface AnchorRect {
  top: number;
  left: number;
  width: number;
}

const GAP = 6;
const BAR_HEIGHT = 34;

/**
 * Where the bar should sit: under `table`, as wide as it, in viewport pixels.
 *
 * It has to keep up with three things. The page scrolls, the window resizes, and
 * the table itself changes height — typing into a cell, or adding the row the bar
 * was just asked for. main watches the first two (Edit.tsx:934-945) and misses
 * the third, so a table that grows ends up with the strip lying across its last
 * row.
 *
 * `getBoundingClientRect` already returns real viewport pixels even for an
 * element inside the paper's `zoom`, so nothing here has to know about the zoom —
 * which is exactly why the bar is fixed-position and portalled rather than
 * absolute inside the sheet.
 */
export const useTableAnchor = (table: HTMLElement | null): AnchorRect | null => {
  const [rect, setRect] = useState<AnchorRect | null>(null);

  useEffect(() => {
    if (!table) {
      setRect(null);
      return;
    }

    const measure = () => {
      const box = table.getBoundingClientRect();
      setRect({
        // Never below the fold: a bar you have to scroll to reach belongs to a
        // table that has already scrolled away.
        top: Math.min(box.bottom + GAP, window.innerHeight - BAR_HEIGHT),
        left: box.left,
        width: box.width,
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(table);
    // Capture phase: the scroll that moves the table is the paper's own, not the
    // window's, and it doesn't bubble.
    window.addEventListener('scroll', measure, true);
    window.addEventListener('resize', measure);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', measure, true);
      window.removeEventListener('resize', measure);
    };
  }, [table]);

  return rect;
};
