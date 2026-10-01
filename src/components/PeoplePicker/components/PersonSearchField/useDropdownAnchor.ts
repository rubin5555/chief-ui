import { type RefObject, useEffect, useState } from 'react';

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

    window.addEventListener('scroll', measure, true);
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('scroll', measure, true);
      window.removeEventListener('resize', measure);
    };
  }, [ref, open]);

  return anchor;
};
