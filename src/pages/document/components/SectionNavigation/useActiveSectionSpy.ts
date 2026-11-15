import type { RefObject } from 'react';
import { useEffect } from 'react';
import { OUTLINE_NODE_ATTR } from '../../document.constants';
import { ACTIVE_LINE_OFFSET } from './SectionNavigation.constants';
import { useSectionNavigation } from './SectionNavigationContext';

export const useActiveSectionSpy = (scrollRef: RefObject<HTMLElement | null>, zoom: number) => {
  const nav = useSectionNavigation();
  const setActiveNodeId = nav?.setActiveNodeId;

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !setActiveNodeId) return;

    let frame = 0;

    const measure = () => {
      frame = 0;
      const box = container.getBoundingClientRect();

      const line = box.top + (ACTIVE_LINE_OFFSET * zoom) / 100;
      const nodes = container.querySelectorAll<HTMLElement>(`[${OUTLINE_NODE_ATTR}]`);

      let firstVisible: string | null = null;
      let current: string | null = null;

      for (const node of nodes) {
        const rect = node.getBoundingClientRect();
        if (rect.bottom <= box.top || rect.top >= box.bottom) continue;
        const id = node.getAttribute(OUTLINE_NODE_ATTR);
        firstVisible ??= id;

        if (rect.top <= line) current = id;
      }

      setActiveNodeId(current ?? firstVisible);
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    schedule();
    container.addEventListener('scroll', schedule, { passive: true });

    const content = container.firstElementChild;
    const observer = content ? new ResizeObserver(schedule) : null;
    if (content && observer) observer.observe(content);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      container.removeEventListener('scroll', schedule);
      observer?.disconnect();
    };
  }, [scrollRef, setActiveNodeId, zoom]);
};
