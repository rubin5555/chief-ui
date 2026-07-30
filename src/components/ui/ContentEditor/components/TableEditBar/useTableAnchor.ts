import { useEffect, useState } from 'react';

export interface AnchorRect {
  top: number;
  left: number;
  width: number;
}

const GAP = 6;
const BAR_HEIGHT = 34;

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
        top: Math.min(box.bottom + GAP, window.innerHeight - BAR_HEIGHT),
        left: box.left,
        width: box.width,
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(table);

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
