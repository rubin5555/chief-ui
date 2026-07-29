import { defaultRangeExtractor, useVirtualizer } from '@tanstack/react-virtual';
import type { RefObject } from 'react';
import { useLayoutEffect, useState } from 'react';

/** A heading and a few sections, standing in until the topic has been measured. */
const ESTIMATED_SUBJECT_HEIGHT = 420;

/** A topic either side of the viewport, so a fast scroll lands on rendered content. */
const OVERSCAN = 2;

interface PaperSubjectVirtualizerOptions {
  /** One id per topic, in document order — the virtualizer's identity and count. */
  ids: string[];
  scrollRef: RefObject<HTMLElement | null>;
  listRef: RefObject<HTMLElement | null>;
  /** The paper's zoom as a factor: 1 at 100%. */
  zoomFactor: number;
  /**
   * Topics that stay mounted wherever the scroll goes, because something other
   * than the view depends on their being there.
   */
  pinnedIndexes: number[];
}

/**
 * Which topics the sheet actually has to hold right now.
 *
 * Two coordinate spaces meet here, and keeping them straight is most of the job.
 * The scroll container sits *outside* the paper's `zoom`, so everything the
 * virtualizer reads or reports — `scrollTop`, item sizes, item offsets — is in
 * post-zoom pixels. The topics are laid out *inside* the zoom, where a pixel is
 * `zoomFactor` times bigger. Every number crossing that boundary is divided in
 * one place, at the bottom of this hook.
 */
export const usePaperSubjectVirtualizer = ({
  ids,
  scrollRef,
  listRef,
  zoomFactor,
  pinnedIndexes,
}: PaperSubjectVirtualizerOptions) => {
  const [scrollMargin, setScrollMargin] = useState(0);

  // Everything above the topics — the sticky toolbar, the letterhead, an
  // emphasis card — is real content the virtualizer doesn't own, and it has to
  // know how much of it there is to map a scroll position onto a topic.
  // Measured rather than derived: none of those blocks has a fixed height.
  //
  // A stale margin costs nothing visible: it shifts *which* window is rendered,
  // while the topics themselves are placed from their own measurements.
  //
  // `zoomFactor` and the topic count are triggers, not inputs — the body reads
  // neither, but both change what a fresh measurement would say.
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-measure triggers, see above
  useLayoutEffect(() => {
    const scrollEl = scrollRef.current;
    const listEl = listRef.current;
    if (!scrollEl || !listEl) return;

    setScrollMargin(
      listEl.getBoundingClientRect().top -
        scrollEl.getBoundingClientRect().top +
        scrollEl.scrollTop,
    );
  }, [scrollRef, listRef, zoomFactor, ids.length]);

  const virtualizer = useVirtualizer({
    count: ids.length,
    getScrollElement: () => scrollRef.current,
    getItemKey: (index) => ids[index],
    // Stated rather than left to the default, which prefers the ResizeObserver's
    // border-box size: that reports the element's own layout pixels, while
    // `scrollTop` is read outside the zoom. `getBoundingClientRect` is the one
    // measurement that is unambiguously in the same space as the scroll.
    measureElement: (element) => element.getBoundingClientRect().height,
    estimateSize: () => ESTIMATED_SUBJECT_HEIGHT * zoomFactor,
    overscan: OVERSCAN,
    scrollMargin,
    // Deduplicated, not just concatenated: the same topic is routinely pinned
    // twice — click into the signatures block and it is both the pinned topic
    // and the focused one — and a repeated index renders a second copy under a
    // key React already has, which remounts the first and wipes its state.
    rangeExtractor: (range) => {
      const visible = defaultRangeExtractor(range);
      const pinned = [...new Set(pinnedIndexes)].filter((index) => !visible.includes(index));
      if (pinned.length === 0) return visible;
      return [...visible, ...pinned].sort((a, b) => a - b);
    },
  });

  // Every cached measurement is in post-zoom pixels, so every one of them is
  // wrong the moment the zoom changes. Throw them out and measure again rather
  // than laying the page out from two different scales at once.
  //
  // `zoomFactor` is the trigger; the body doesn't read it.
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-measure trigger, see above
  useLayoutEffect(() => {
    virtualizer.measure();
  }, [virtualizer, zoomFactor]);

  const toPaperPx = (value: number) => value / zoomFactor;

  return {
    measureElement: virtualizer.measureElement,
    listHeight: toPaperPx(virtualizer.getTotalSize()),
    items: virtualizer.getVirtualItems().map((item) => ({
      key: item.key,
      index: item.index,
      top: toPaperPx(item.start - scrollMargin),
    })),
  };
};
