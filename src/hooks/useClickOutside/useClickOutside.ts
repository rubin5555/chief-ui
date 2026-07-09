import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';

// Closes a popover/dropdown/menu when a pointerdown lands outside all of `refs`.
// Pass every ref that should count as "inside" (e.g. both the trigger button and
// the floating panel it opens), plus whether the listener should currently be active.
export const useClickOutside = (
  refs: RefObject<HTMLElement | null>[],
  onClickOutside: () => void,
  enabled = true,
) => {
  const onClickOutsideRef = useRef(onClickOutside);
  onClickOutsideRef.current = onClickOutside;

  // Mirrored into a ref so the effect below can skip `refs` in its dependency array —
  // the array literal callers pass inline is recreated every render, but `.current`
  // mutation alone should never re-subscribe the listener, only `enabled` toggling should.
  const refsRef = useRef(refs);
  refsRef.current = refs;

  useEffect(() => {
    if (!enabled) return;

    const handlePointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      const isInside = refsRef.current.some((ref) => ref.current?.contains(target));
      if (!isInside) onClickOutsideRef.current();
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [enabled]);
};
