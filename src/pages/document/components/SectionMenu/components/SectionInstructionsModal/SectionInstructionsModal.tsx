import type { ChangeEvent } from 'react';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { ModalHandle } from '@/components/ui/Modal';
import { Modal } from '@/components/ui/Modal';
import { InstructionsTextarea } from './SectionInstructionsModal.styles';
import { SECTION_INSTRUCTIONS_MODAL_IDS } from './SectionInstructionsModal.testids';

const TEXTAREA_ROWS = 6;

export interface SectionInstructionsModalProps {
  sectionTitle: string;
  instructions: string;
  onSave: (instructions: string) => void;
  onClose: () => void;
}

export const SectionInstructionsModal = ({
  sectionTitle,
  instructions,
  onSave,
  onClose,
}: SectionInstructionsModalProps) => {
  const modalRef = useRef<ModalHandle>(null);
  const [draft, setDraft] = useState(instructions);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => setDraft(event.target.value);
  const handleCancel = () => modalRef.current?.requestClose();

  const handleSave = () => {
    onSave(draft);
    modalRef.current?.requestClose();
  };

  return (
    <Modal
      ref={modalRef}
      title={sectionTitle ? `יצירת הנחיות לסעיף ״${sectionTitle}״` : 'יצירת הנחיות לסעיף'}
      width={500}
      onClose={onClose}
      footer={
        <>
          <Button
            type="button"
            variant="ghost"
            onClick={handleCancel}
            data-testid={SECTION_INSTRUCTIONS_MODAL_IDS.cancelBtn}
          >
            ביטול
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            data-testid={SECTION_INSTRUCTIONS_MODAL_IDS.saveBtn}
          >
            שמירה
          </Button>
        </>
      }
      data-testid={SECTION_INSTRUCTIONS_MODAL_IDS.root}
    >
      <InstructionsTextarea
        value={draft}
        rows={TEXTAREA_ROWS}
        dir="rtl"
        placeholder="הכנס הנחיות לסעיף..."
        aria-label="הנחיות לסעיף"
        data-testid={SECTION_INSTRUCTIONS_MODAL_IDS.textarea}
        onChange={handleChange}
      />
    </Modal>
  );
};
