import type { ChangeEvent, FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { FooterActions, Notes } from '../../ApprovalRotation.shared.styles';
import { APPROVAL_ROTATION_IDS } from '../../ApprovalRotation.testids';
import { RejectBox } from './RejectForm.styles';

const FORM_ID = 'approval-rotation-reject-form';

export interface RejectFormProps {
  reason: string;
  onReasonChange: (reason: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

// Why the document is being sent back. A form rather than a pair of buttons, so
// Enter submits it and the reason can't be lost to a stray click.
export const RejectForm = ({ reason, onReasonChange, onSubmit, onCancel }: RejectFormProps) => {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) =>
    onReasonChange(event.target.value);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <RejectBox id={FORM_ID} onSubmit={handleSubmit}>
      <Notes
        value={reason}
        onChange={handleChange}
        placeholder="פרט את סיבת הדחייה..."
        dir="rtl"
        aria-label="סיבת הדחייה"
        // The view exists to be typed into; anything else would be a click wasted.
        autoFocus
        data-testid={APPROVAL_ROTATION_IDS.rejectReason}
      />
      <FooterActions>
        <Button type="button" variant="ghost" onClick={onCancel}>
          ביטול
        </Button>
        <Button type="submit" form={FORM_ID} data-testid={APPROVAL_ROTATION_IDS.confirmRejectBtn}>
          דחייה
        </Button>
      </FooterActions>
    </RejectBox>
  );
};
