import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

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
