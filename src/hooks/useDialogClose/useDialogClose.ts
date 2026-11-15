import { useCallback, useEffect, useRef, useState } from 'react';
import { MODAL_EXIT_DURATION_MS } from '@/styles/animations';

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
