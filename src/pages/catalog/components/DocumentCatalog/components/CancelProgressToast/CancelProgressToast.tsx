import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ModalPortal } from '@/components/ui/ModalPortal';
import { CATALOG_MODAL_IDS } from '../catalogModals.testids';
import {
  Bar,
  BarFill,
  BarRow,
  CloseBtn,
  Percent,
  ToastFooter,
  ToastHeader,
  ToastRoot,
  ToastTitle,
} from './CancelProgressToast.styles';

const TICK_MS = 60;
const STEP = 2;

export const CancelProgressToast = ({ onClose }: { onClose: () => void }) => {
  const [progress, setProgress] = useState(0);
  const isComplete = progress >= 100;

  // One interval that stops itself at 100. `isComplete` is derived from the
  // progress rather than kept alongside it, so the two can't disagree.
  useEffect(() => {
    if (isComplete) return;
    const timer = window.setInterval(
      () => setProgress((prev) => Math.min(100, prev + STEP)),
      TICK_MS,
    );
    return () => window.clearInterval(timer);
  }, [isComplete]);

  return (
    <ModalPortal>
      <ToastRoot dir="rtl" data-testid={CATALOG_MODAL_IDS.cancelToast}>
        <ToastHeader>
          <ToastTitle>{isComplete ? 'המסמך בוטל בהצלחה' : 'ביטול המסמך מתבצע'}</ToastTitle>
          {isComplete && (
            <CloseBtn type="button" onClick={onClose}>
              <X size={12} />
            </CloseBtn>
          )}
        </ToastHeader>

        <BarRow>
          <Bar>
            <BarFill $progress={progress} $complete={isComplete} />
          </Bar>
          <Percent $complete={isComplete}>{progress}%</Percent>
        </BarRow>

        <ToastFooter>{isComplete ? 'אגרת ביטול נשלחה למכותבים' : ''}</ToastFooter>
      </ToastRoot>
    </ModalPortal>
  );
};
