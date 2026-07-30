import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';

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
      const isInside = refsRef.current.some((ref) => ref.current?.contains(target));
      if (!isInside) onClickOutsideRef.current();
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [enabled]);
};
