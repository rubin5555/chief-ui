import { useLayoutEffect, useState } from 'react';

export interface AnchorRect {
  top: number;
  left: number;
  // Set when the bar had to go above the table because there was no room
  // under it, so the pointer can be drawn on the other edge.
  flipped: boolean;
}

const GAP = 6;
const EDGE_MARGIN = 8;

const same = (a: AnchorRect | null, b: AnchorRect) =>
  a !== null && a.top === b.top && a.left === b.left && a.flipped === b.flipped;

export const useTableAnchor = (
  table: HTMLElement | null,
  bar: HTMLElement | null,
): AnchorRect | null => {
  const [rect, setRect] = useState<AnchorRect | null>(null);

  useLayoutEffect(() => {
    if (!table || !bar) {
      setRect(null);
      return;
    }

    let frame = 0;

    const measure = () => {
      // The table sits inside the zoomed page and the bar does not, but a
      // client rect is already in screen pixels — so the bar borrows the
      // table's position and keeps its own, unscaled, size.
      const box = table.getBoundingClientRect();
      const width = bar.offsetWidth;
      const height = bar.offsetHeight;

      const below = box.bottom + GAP;
      const flipped = below + height > window.innerHeight - EDGE_MARGIN;
      const top = flipped ? Math.max(box.top - GAP - height, EDGE_MARGIN) : below;

      // Right edge to right edge: the bar hangs off the table the way the
      // page reads, right to left.
      const maxLeft = Math.max(window.innerWidth - width - EDGE_MARGIN, EDGE_MARGIN);
      const left = Math.min(Math.max(box.right - width, EDGE_MARGIN), maxLeft);

      const next: AnchorRect = { top: Math.round(top), left: Math.round(left), flipped };
      setRect((prev) => (same(prev, next) ? prev : next));

      // Zoom, a collapsing sidebar, a cell growing as it is typed into: the
      // table moves for reasons no single observer reports, so the bar
      // re-reads it per frame for as long as a table is selected.
      frame = requestAnimationFrame(measure);
    };

    measure();
    return () => cancelAnimationFrame(frame);
  }, [table, bar]);

  return rect;
};
