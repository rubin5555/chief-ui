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

/** main's ramp: 2% every 60ms, so distribution takes three seconds (Edit.tsx:3436). */
const STEP_PERCENT = 2;
const STEP_MS = 60;

export interface DistributeProgressToastProps {
  /** How many people it went to, shown once it lands. */
  recipientCount: number;
  onClose: () => void;
}

// Distribution running in the corner while you carry on with the document (main,
// Edit.tsx:5047).
//
// The interval is a real effect — a browser timer with its own cleanup, which is
// the sanctioned kind. It is not deriving state from props; it is driving a clock.
// No close button until it lands: there is nothing useful to do with a
// half-distributed document, and dismissing the only indication that it is
// happening would leave nothing to come back to.
export const DistributeProgressToast = ({
  recipientCount,
  onClose,
}: DistributeProgressToastProps) => {
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

      {/* main says "הופץ לכ- 156 משתמשים" from a hardcoded 156. This counts the
          recipients actually picked, which is the number the sender chose. */}
      {isComplete && (
        <SuccessDetail data-testid={DISTRIBUTE_PROGRESS_TOAST_IDS.detail}>
          הופץ ל{recipientCount} משתמשים
        </SuccessDetail>
      )}
    </ToastRoot>
  );
};
