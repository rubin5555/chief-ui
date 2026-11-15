import type { RefObject } from 'react';
import { useLayoutEffect, useState } from 'react';
import type { Pos, PosSpec } from './floatingPosition';
import { computeFloatingPos, estimatePos, measurePanel, samePos } from './floatingPosition';

/**
 * `useFloatingPanel`'s geometry for a panel whose trigger it cannot hold a ref
 * to. A row menu opens from a button inside a virtualised table, so the only
 * thing it can hang off is the rect captured at click time.
 */
export const useRectAnchoredPos = (
  rect: DOMRect,
  spec: PosSpec,
  panelRef: RefObject<HTMLElement | null>,
) => {
  const [pos, setPos] = useState<Pos>(() => estimatePos(rect, spec));

  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const next = computeFloatingPos(rect, spec, measurePanel(panel));
    setPos((prev) => (samePos(prev, next) ? prev : next));
  });

  return pos;
};
