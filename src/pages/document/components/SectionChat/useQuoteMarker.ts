import { useEffect, useRef } from 'react';
import { DOC_NODE_ATTR } from '../../document.constants';

export interface UseQuoteMarkerOptions {
  /** Marker mode is on and a passage is being waited for. */
  enabled: boolean;
  onMarked: (quote: string) => void;
}

/** The element a selection starts in, whichever kind of node that turns out to be. */
const hostElement = (node: Node | null | undefined) =>
  node instanceof Element ? node : (node?.parentElement ?? null);

/**
 * Reports the passage the reader marks in the sheet while marker mode is on
 * (main's selection capture, Edit.tsx:355).
 *
 * An effect is the right tool here: a document-level listener is an external
 * event source with cleanup, not state derived from props.
 *
 * Two things make this work where the naive version doesn't. It listens on the
 * document rather than the paper, because a drag that starts in one section and
 * ends in the next has no single element to hang off; and it only accepts a
 * selection anchored inside a section's body, so selecting text in the bubble
 * itself — or anywhere else in the page chrome — isn't mistaken for marking the
 * document. The other half of the fix is in EditableSectionBody, which stops
 * clicks opening the editor for as long as this is listening.
 */
export const useQuoteMarker = ({ enabled, onMarked }: UseQuoteMarkerOptions) => {
  // Read at mouseup, not at subscribe time, so the effect doesn't resubscribe on
  // every render just because the callback closes over fresh state.
  const onMarkedRef = useRef(onMarked);
  onMarkedRef.current = onMarked;

  useEffect(() => {
    if (!enabled) return;

    const handleMouseUp = () => {
      const selection = window.getSelection();
      const quote = selection?.toString().trim();
      if (!quote) return;
      if (!hostElement(selection?.anchorNode)?.closest(`[${DOC_NODE_ATTR}]`)) return;

      // Cleared once captured: the passage is now shown in the bubble's draft
      // strip, and leaving it selected as well would say the same thing twice.
      selection?.removeAllRanges();
      onMarkedRef.current(quote);
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [enabled]);
};
