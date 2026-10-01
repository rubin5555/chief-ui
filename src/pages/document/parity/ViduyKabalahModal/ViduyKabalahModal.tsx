import type { ChangeEvent } from 'react';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { DateTimePicker } from '@/components/ui/DateTimePicker';
import type { ModalHandle } from '@/components/ui/Modal';
import { Modal } from '@/components/ui/Modal';
import {
  Field,
  FieldLabel,
  FieldStack,
  NotesField,
  TextField,
  WarningText,
} from './ViduyKabalahModal.styles';
import { VIDUY_KABALAH_MODAL_IDS } from './ViduyKabalahModal.testids';

export interface ViduyKabalahDetails {
  approvedBy: string;
  date: string;
  notes: string;
}

export interface ViduyKabalahModalProps {
  onSend: (details: ViduyKabalahDetails) => void;
  onClose: () => void;
}

export const ViduyKabalahModal = ({ onSend, onClose }: ViduyKabalahModalProps) => {
  const modalRef = useRef<ModalHandle>(null);
  const [approvedBy, setApprovedBy] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleApprovedByChange = (event: ChangeEvent<HTMLInputElement>) =>
    setApprovedBy(event.target.value);

  const handleNotesChange = (event: ChangeEvent<HTMLTextAreaElement>) =>
    setNotes(event.target.value);

  const handleCancel = () => modalRef.current?.requestClose();

  const handleSend = () => {
    onSend({ approvedBy, date, notes });
    modalRef.current?.requestClose();
  };

  return (
    <Modal
      ref={modalRef}
      title="וידוא קבלה — חמ״ל"
      width={440}
      footerAlign="between"
      onClose={onClose}
      data-testid={VIDUY_KABALAH_MODAL_IDS.root}
      footer={
        <>
          <Button type="button" variant="outline" size="sm" onClick={handleCancel}>
            ביטול
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSend}
            data-testid={VIDUY_KABALAH_MODAL_IDS.send}
          >
            שלח
          </Button>
        </>
      }
    >
      <WarningText>
        <strong>שימו לב:</strong> מידע זה יועבר למפיץ המסמך וישוקף במסך ״וידוא קבלה״. נדרש למלא את
        הפרטים טרם הצפייה במסך.
      </WarningText>

      <FieldStack>
        <Field>
          <FieldLabel htmlFor="viduy-approved-by">אושר ע״י</FieldLabel>
          <TextField
            id="viduy-approved-by"
            type="text"
            value={approvedBy}
            placeholder="שם המאשר"
            onChange={handleApprovedByChange}
            data-testid={VIDUY_KABALAH_MODAL_IDS.approvedBy}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="viduy-date">תאריך אישור</FieldLabel>
          <DateTimePicker
            id="viduy-date"
            value={date}
            aria-label="תאריך אישור"
            onChange={setDate}
            data-testid={VIDUY_KABALAH_MODAL_IDS.date}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="viduy-notes">הערות</FieldLabel>
          <NotesField
            id="viduy-notes"
            rows={4}
            value={notes}
            placeholder="הוסף הערות..."
            onChange={handleNotesChange}
            data-testid={VIDUY_KABALAH_MODAL_IDS.notes}
          />
        </Field>
      </FieldStack>
    </Modal>
  );
};
