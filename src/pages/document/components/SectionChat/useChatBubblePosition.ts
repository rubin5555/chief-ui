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

/**
 * Where the bubble's top edge goes, or `null` while its section is scrolled out
 * of view — the bubble is hidden then rather than left pointing at nothing, which
 * is main's behaviour too (Edit.tsx:401).
 *
 * An effect is the right tool: these are external event sources with cleanup, not
 * state derived from props. Scroll is watched in the capture phase because the
 * page that moves is the paper's own scroll container, not the window.
 */
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
      // The tail wants to land on the trigger's middle; the clamps keep the
      // bubble itself fully on screen when that would put it past either edge.
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
