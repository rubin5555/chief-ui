import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  CloseBtn,
  Fill,
  Percent,
  ProgressRow,
  SuccessDetail,
  ToastHeader,
  ToastRoot,
  ToastTitle,
  Track,
} from './DistributeProgressToast.styles';
import { DISTRIBUTE_PROGRESS_TOAST_IDS } from './DistributeProgressToast.testids';

const STEP_PERCENT = 2;
const STEP_MS = 60;

const APPROX_RECIPIENTS = 156;

export interface DistributeProgressToastProps {
  onClose: () => void;
}

export const DistributeProgressToast = ({ onClose }: DistributeProgressToastProps) => {
  const [percent, setPercent] = useState(0);

  const isComplete = percent >= 100;

  useEffect(() => {
    if (isComplete) return;
    const timer = setInterval(
      () => setPercent((prev) => Math.min(100, prev + STEP_PERCENT)),
      STEP_MS,
    );
    return () => clearInterval(timer);
  }, [isComplete]);

  return (
    <ToastRoot dir="rtl" role="status" data-testid={DISTRIBUTE_PROGRESS_TOAST_IDS.root}>
      <ToastHeader>
        <ToastTitle data-testid={DISTRIBUTE_PROGRESS_TOAST_IDS.title}>
          {isComplete ? 'המסמך הופץ בהצלחה' : 'הפצת המסמך מתבצעת'}
        </ToastTitle>
        {isComplete && (
          <CloseBtn
            type="button"
            aria-label="סגירה"
            data-testid={DISTRIBUTE_PROGRESS_TOAST_IDS.closeBtn}
            onClick={onClose}
          >
            <X size={12} aria-hidden="true" />
          </CloseBtn>
        )}
      </ToastHeader>

      <ProgressRow>
        <Track>
          <Fill $percent={percent} $complete={isComplete} />
        </Track>
        <Percent $complete={isComplete} data-testid={DISTRIBUTE_PROGRESS_TOAST_IDS.percent}>
          {percent}%
        </Percent>
      </ProgressRow>

      {isComplete && (
        <SuccessDetail data-testid={DISTRIBUTE_PROGRESS_TOAST_IDS.detail}>
          הופץ לכ- {APPROX_RECIPIENTS} משתמשים
        </SuccessDetail>
      )}
    </ToastRoot>
  );
};
