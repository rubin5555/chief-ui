import { type RefObject, useEffect, useState } from 'react';

/** main's gap between the field and its results (TopNavbar.tsx:505). */
const GAP = 8;
const EDGE_MARGIN = 8;
const MAX_HEIGHT = 280;

export interface DropdownAnchor {
  top?: number;
  bottom?: number;
  left: number;
  width: number;
  maxHeight: number;
}

/**
 * Where the results list should sit, in viewport coordinates, so it can be
 * mounted on the body instead of inside the field.
 *
 * Below the field by default, flipping above only when the list does not fit
 * below *and* fits better above — a list that fits has no reason to move. It
 * never overflows an edge: whichever side it lands on, its height is capped to
 * the room actually there, and it scrolls inside that.
 *
 * Remeasured on scroll and resize while open. Anything that moves the field
 * moves the list with it, rather than leaving it floating where the field used
 * to be.
 */
export const useDropdownAnchor = (
  ref: RefObject<HTMLElement | null>,
  open: boolean,
): DropdownAnchor | null => {
  const [anchor, setAnchor] = useState<DropdownAnchor | null>(null);

  useEffect(() => {
    if (!open) {
      setAnchor(null);
      return;
    }
    const element = ref.current;
    if (!element) return;

    const measure = () => {
      const box = element.getBoundingClientRect();
      const roomBelow = window.innerHeight - box.bottom - GAP - EDGE_MARGIN;
      const roomAbove = box.top - GAP - EDGE_MARGIN;
      const placeAbove = roomBelow < Math.min(MAX_HEIGHT, roomAbove);

      setAnchor({
        ...(placeAbove
          ? { bottom: window.innerHeight - box.top + GAP }
          : { top: box.bottom + GAP }),
        left: box.left,
        width: box.width,
        maxHeight: Math.min(MAX_HEIGHT, placeAbove ? roomAbove : roomBelow),
      });
    };

    measure();
    // Capture phase, so a scroll inside any container the field sits in is seen
    // — scroll doesn't bubble.
    window.addEventListener('scroll', measure, true);
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('scroll', measure, true);
      window.removeEventListener('resize', measure);
    };
  }, [ref, open]);

  return anchor;
};
