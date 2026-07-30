import type { RefObject } from 'react';
import { useEffect } from 'react';
import { OUTLINE_NODE_ATTR } from '../../document.constants';
import { ACTIVE_LINE_OFFSET } from './SectionNavigation.constants';
import { useSectionNavigation } from './SectionNavigationContext';

/**
 * Which node the reader is on, reported to the outline as the paper scrolls.
 *
 * Read off the DOM on each scroll rather than tracked with an IntersectionObserver:
 * the topics are virtualized, so the set of section elements changes as you move,
 * and an observer would need subscribing and unsubscribing in step with the
 * virtualizer's window. Querying answers the same question without that
 * bookkeeping, and only ever looks at what is currently mounted — which is a
 * screenful either way.
 *
 * An effect is the right tool: this is an external event source with cleanup, not
 * state derived from props.
 */
export const useActiveSectionSpy = (scrollRef: RefObject<HTMLElement | null>) => {
  const nav = useSectionNavigation();
  const setActiveNodeId = nav?.setActiveNodeId;

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !setActiveNodeId) return;

    // Coalesced to one read per frame. Scroll fires far faster than the answer
    // can change, and every read is a pile of getBoundingClientRect calls.
    let frame = 0;

    const measure = () => {
      frame = 0;
      const box = container.getBoundingClientRect();
      const line = box.top + ACTIVE_LINE_OFFSET;
      const nodes = container.querySelectorAll<HTMLElement>(`[${OUTLINE_NODE_ATTR}]`);

      // Only what is actually on screen counts. Mounted is not the same as
      // visible here: the paper keeps topics mounted that the reader is nowhere
      // near — the signatures topic always, the topic being scrolled towards
      // while it is still being scrolled towards — and each of those sits at its
      // own offset, which may well be above the line. Reporting one of them
      // would have the outline claim the reader is in a section that isn't on
      // the screen.
      let firstVisible: string | null = null;
      let current: string | null = null;

      for (const node of nodes) {
        const rect = node.getBoundingClientRect();
        if (rect.bottom <= box.top || rect.top >= box.bottom) continue;
        const id = node.getAttribute(OUTLINE_NODE_ATTR);
        firstVisible ??= id;
        // The last visible node to have started above the line. DOM order is
        // document order, so later matches simply overwrite earlier ones.
        if (rect.top <= line) current = id;
      }

      // Nothing visible has started above the line — the reader is above the
      // first section on screen, at the letterhead or a topic heading. The
      // section being approached is still the one to point at.
      setActiveNodeId(current ?? firstVisible);
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    schedule();
    container.addEventListener('scroll', schedule, { passive: true });

    // Scrolling is not the only thing that changes the answer, and on first load
    // it isn't the thing that changes it at all: the effect runs before the paper
    // has rendered a single section, so the first measurement has nothing to
    // measure and no scroll follows to correct it. Watching the content covers
    // that, and every later case with it — topics mounting as the virtualizer
    // measures them, a section growing as it is typed into, the zoom changing.
    const content = container.firstElementChild;
    const observer = content ? new ResizeObserver(schedule) : null;
    if (content && observer) observer.observe(content);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      container.removeEventListener('scroll', schedule);
      observer?.disconnect();
    };
  }, [scrollRef, setActiveNodeId]);
};
