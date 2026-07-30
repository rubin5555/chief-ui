import { defaultRangeExtractor, useVirtualizer } from '@tanstack/react-virtual';
import type { RefObject } from 'react';
import { useLayoutEffect, useState } from 'react';

const ESTIMATED_SUBJECT_HEIGHT = 420;

const OVERSCAN = 2;

interface PaperSubjectVirtualizerOptions {
  ids: string[];
  scrollRef: RefObject<HTMLElement | null>;
  listRef: RefObject<HTMLElement | null>;
  zoomFactor: number;
  pinnedIndexes: number[];
}

export const usePaperSubjectVirtualizer = ({
  ids,
  scrollRef,
  listRef,
  zoomFactor,
  pinnedIndexes,
}: PaperSubjectVirtualizerOptions) => {
  const [scrollMargin, setScrollMargin] = useState(0);

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

    measureElement: (element) => element.getBoundingClientRect().height,
    estimateSize: () => ESTIMATED_SUBJECT_HEIGHT * zoomFactor,
    overscan: OVERSCAN,
    scrollMargin,

    rangeExtractor: (range) => {
      const visible = defaultRangeExtractor(range);
      const pinned = [...new Set(pinnedIndexes)].filter((index) => !visible.includes(index));
      if (pinned.length === 0) return visible;
      return [...visible, ...pinned].sort((a, b) => a - b);
    },
  });

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
