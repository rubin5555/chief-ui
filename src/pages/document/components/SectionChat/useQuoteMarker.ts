import { useEffect, useRef } from 'react';
import { DOC_NODE_ATTR } from '../../document.constants';

export interface UseQuoteMarkerOptions {
  enabled: boolean;
  onMarked: (quote: string) => void;
}

const hostElement = (node: Node | null | undefined) =>
  node instanceof Element ? node : (node?.parentElement ?? null);

export const useQuoteMarker = ({ enabled, onMarked }: UseQuoteMarkerOptions) => {
  const onMarkedRef = useRef(onMarked);
  onMarkedRef.current = onMarked;

  useEffect(() => {
    if (!enabled) return;

    const handleMouseUp = () => {
      const selection = window.getSelection();
      const quote = selection?.toString().trim();
      if (!quote) return;
      if (!hostElement(selection?.anchorNode)?.closest(`[${DOC_NODE_ATTR}]`)) return;

      selection?.removeAllRanges();
      onMarkedRef.current(quote);
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [enabled]);
};
