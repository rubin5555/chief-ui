import { useEffect, useRef, useState } from 'react';
import type { RowActionPhase } from './RowActionMenu';
import { INLINE_PHASE_MS } from './RowActionMenu.constants';

// `העתקת קישור` and its two siblings don't open anything — they report inside
// the menu: a spinner, then a tick, then the menu closes itself. Two timers,
// cleared on unmount so a row that scrolls out of the virtualiser mid-animation
// can't call back into a gone component.
export const useRowActionPhase = (onFinish: () => void) => {
  const [phase, setPhase] = useState<RowActionPhase | null>(null);
  const timersRef = useRef<number[]>([]);
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  const clearTimers = () => {
    for (const id of timersRef.current) window.clearTimeout(id);
    timersRef.current = [];
  };

  // Inlined rather than returning `clearTimers`, which is a fresh function
  // every render and would make the effect look like it depends on it.
  useEffect(
    () => () => {
      for (const id of timersRef.current) window.clearTimeout(id);
    },
    [],
  );

  const start = (label: string) => {
    clearTimers();
    setPhase({ label, phase: 'loading' });
    timersRef.current.push(
      window.setTimeout(() => setPhase({ label, phase: 'done' }), INLINE_PHASE_MS.done),
      window.setTimeout(() => {
        setPhase(null);
        onFinishRef.current();
      }, INLINE_PHASE_MS.close),
    );
  };

  const reset = () => {
    clearTimers();
    setPhase(null);
  };

  return { phase, start, reset };
};
