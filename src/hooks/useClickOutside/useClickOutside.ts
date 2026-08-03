import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';
import { isOnLayerAbove } from '@/utils/layerStack';

export const useClickOutside = (
  refs: RefObject<HTMLElement | null>[],
  onClickOutside: () => void,
  enabled = true,
) => {
  const onClickOutsideRef = useRef(onClickOutside);
  onClickOutsideRef.current = onClickOutside;

  const refsRef = useRef(refs);
  refsRef.current = refs;

  useEffect(() => {
    if (!enabled) return;

    const handlePointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      // A popover opened from inside one of these elements portals out to
      // `body`, so containment alone would call its clicks "outside".
      const isInside = refsRef.current.some(
        (ref) =>
          ref.current?.contains(target) || (ref.current && isOnLayerAbove(ref.current, target)),
      );
      if (!isInside) onClickOutsideRef.current();
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [enabled]);
};
