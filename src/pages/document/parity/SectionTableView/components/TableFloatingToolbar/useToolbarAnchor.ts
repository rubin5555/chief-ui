import type { RefObject } from 'react';
import { useEffect, useState } from 'react';

export interface AnchorRect {
  top: number;
  left: number;
  width: number;
}

const GAP = 6;
const TOOLBAR_HEIGHT = 50;

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
