import type { RefObject } from 'react';
import { useEffect, useState } from 'react';
import {
  ANCHOR_BOTTOM_MARGIN,
  ANCHOR_TOP_MARGIN,
  BUBBLE_BOTTOM_MARGIN,
  BUBBLE_MAX_HEIGHT,
  TAIL_CENTER,
  TAIL_MIN_TOP_GAP,
} from './SectionChat.constants';

export const useChatBubblePosition = (
  ref: RefObject<HTMLElement | null>,
  open: boolean,
): number | null => {
  const [top, setTop] = useState<number | null>(null);

  useEffect(() => {
    if (!open) {
      setTop(null);
      return;
    }
    const element = ref.current;
    if (!element) return;

    const measure = () => {
      const box = element.getBoundingClientRect();
      const inView =
        box.bottom > ANCHOR_TOP_MARGIN && box.top < window.innerHeight - ANCHOR_BOTTOM_MARGIN;
      if (!inView) {
        setTop(null);
        return;
      }

      const wanted = box.top + box.height / 2 - TAIL_CENTER;
      const lowest = window.innerHeight - BUBBLE_MAX_HEIGHT - BUBBLE_BOTTOM_MARGIN;
      setTop(Math.max(TAIL_CENTER + TAIL_MIN_TOP_GAP, Math.min(wanted, lowest)));
    };

    measure();
    window.addEventListener('scroll', measure, true);
    window.addEventListener('resize', measure);

    return () => {
      window.removeEventListener('scroll', measure, true);
      window.removeEventListener('resize', measure);
    };
  }, [ref, open]);

  return top;
};
