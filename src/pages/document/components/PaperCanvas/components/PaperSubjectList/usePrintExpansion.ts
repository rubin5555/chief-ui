import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

/**
 * Whether the page is being printed right now.
 *
 * A virtualized document holds only the topics you can currently see, which is
 * the wrong document to hand a printer. `beforeprint` fires while the browser
 * will still take changes, so the flip is wrapped in `flushSync`: the handler
 * has to return with the whole document already in the DOM, and React's normal
 * batching would land it after the snapshot is taken.
 */
export const usePrintExpansion = () => {
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    const onBeforePrint = () => flushSync(() => setIsPrinting(true));
    const onAfterPrint = () => setIsPrinting(false);

    window.addEventListener('beforeprint', onBeforePrint);
    window.addEventListener('afterprint', onAfterPrint);
    return () => {
      window.removeEventListener('beforeprint', onBeforePrint);
      window.removeEventListener('afterprint', onAfterPrint);
    };
  }, []);

  return isPrinting;
};
