import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { DateTimePicker } from '@/components/ui/DateTimePicker';
import { Modal } from '@/components/ui/Modal';
import {
  Body,
  Field,
  FieldLabel,
  Notes,
  TextInput,
  Warning,
} from './AcceptenceVerification.styles';
import { ACCEPTENCE_VERIFICATION_IDS } from './AcceptenceVerification.testids';

const FORM_ID = 'acceptence-verification-form';

export interface AcceptenceVerificationData {
  approvedBy: string;
  date: string;
  notes: string;
}

export interface AcceptenceVerificationProps {
  onClose: () => void;
  onSend: (data: AcceptenceVerificationData) => void;
}

// Renamed from main's ViduyKabalahModal — an HML recipient's own confirmation
// that a distributed document was received. Main never reached this from the
// document owner's editing flow either (its warning copy says the details
// "will be sent to the document's distributor"), so it's exposed here as a
// standalone, directly-triggerable action rather than chained after a step
// that doesn't exist in dev's Edit flow.
export const AcceptenceVerification = ({ onClose, onSend }: AcceptenceVerificationProps) => {
  const [approvedBy, setApprovedBy] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleApprovedByChange = (e: ChangeEvent<HTMLInputElement>) =>
    setApprovedBy(e.target.value);
  const handleNotesChange = (e: ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value);
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSend({ approvedBy, date, notes });
  };

  return (
    <Modal
      title="וידוא קבלה — חמ״ל"
      onClose={onClose}
      width={440}
      data-testid={ACCEPTENCE_VERIFICATION_IDS.root}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            ביטול
          </Button>
          <Button type="submit" form={FORM_ID} data-testid={ACCEPTENCE_VERIFICATION_IDS.sendBtn}>
            שלח
          </Button>
        </>
      }
    >
      <Body id={FORM_ID} onSubmit={onSubmit}>
        <Warning>
          <strong>שימו לב:</strong> מידע זה ישוקף במסך ״וידוא קבלה״ של מפיץ המסמך.
        </Warning>

        <Field>
          <FieldLabel>אושר ע״י</FieldLabel>
          <TextInput
            type="text"
            value={approvedBy}
            onChange={handleApprovedByChange}
            placeholder="שם המאשר"
            dir="rtl"
            data-testid={ACCEPTENCE_VERIFICATION_IDS.approvedBy}
          />
        </Field>

        <Field>
          <FieldLabel>תאריך אישור</FieldLabel>
          <DateTimePicker
            value={date}
            onChange={setDate}
            data-testid={ACCEPTENCE_VERIFICATION_IDS.date}
          />
        </Field>

        <Field>
          <FieldLabel>הערות</FieldLabel>
          <Notes
            value={notes}
            onChange={handleNotesChange}
            placeholder="הוסף הערות..."
            dir="rtl"
            data-testid={ACCEPTENCE_VERIFICATION_IDS.notes}
          />
        </Field>
      </Body>
    </Modal>
  );
};
