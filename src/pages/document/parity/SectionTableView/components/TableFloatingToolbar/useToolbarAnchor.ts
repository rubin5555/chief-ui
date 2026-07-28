import type { RefObject } from 'react';
import { useEffect, useState } from 'react';

export interface AnchorRect {
  top: number;
  left: number;
  width: number;
}

const GAP = 6;
const TOOLBAR_HEIGHT = 50;

// The toolbar sits under the table and has to keep up with it: the page scrolls,
// the window resizes, and a cell that grows makes the table taller. main watches
// the first two (Edit.tsx:934-945) and misses the third, so typing enough to add
// a line leaves the toolbar overlapping the row it belongs to.
//
// An effect is the right tool here — these are external event sources with
// cleanup, not state derived from props.
export const useToolbarAnchor = (
  ref: RefObject<HTMLElement | null>,
  enabled: boolean,
): AnchorRect | null => {
  const [rect, setRect] = useState<AnchorRect | null>(null);

  useEffect(() => {
    if (!enabled) {
      setRect(null);
      return;
    }
    const element = ref.current;
    if (!element) return;

    const measure = () => {
      const box = element.getBoundingClientRect();
      setRect({
        // Never below the fold: a toolbar you have to scroll to reach is one the
        // table has already scrolled away from.
        top: Math.min(box.bottom + GAP, window.innerHeight - TOOLBAR_HEIGHT),
        left: box.left,
        width: box.width,
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    window.addEventListener('scroll', measure, true);
    window.addEventListener('resize', measure);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', measure, true);
      window.removeEventListener('resize', measure);
    };
  }, [ref, enabled]);

  return rect;
};
