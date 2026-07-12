import { useCallback, useEffect, useRef, useState } from 'react';
import { MODAL_EXIT_DURATION_MS } from '@/styles/animations';

// Defers a dialog's real close (unmount) until its CSS exit animation has
// played, so every modal gets a close animation without each call site
// managing its own timer. Skips the delay under prefers-reduced-motion —
// there's nothing to wait for once the animation itself is off.
export const useDialogClose = (onClose: () => void) => {
  const [isClosing, setIsClosing] = useState(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const requestClose = useCallback(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      onCloseRef.current();
      return;
    }
    setIsClosing(true);
  }, []);

  useEffect(() => {
    if (!isClosing) return;
    const timer = window.setTimeout(() => onCloseRef.current(), MODAL_EXIT_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [isClosing]);

  return { isClosing, requestClose };
};
