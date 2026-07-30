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

/**
 * main's figure, verbatim (Edit.tsx:5078) — and "לכ-", approximately, because it
 * is one. Nothing in the flow counts recipients: a distributed document goes to
 * whoever the approval round's חמ״ל groups cover, which this page never resolves
 * to people. When it does, this line is what changes.
 */
const APPROX_RECIPIENTS = 156;

export interface DistributeProgressToastProps {
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
