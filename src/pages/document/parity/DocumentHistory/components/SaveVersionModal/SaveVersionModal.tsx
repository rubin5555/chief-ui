import { useRef } from 'react';
import { Button } from '@/components/ui/Button';
import type { ModalHandle } from '@/components/ui/Modal';
import { Modal } from '@/components/ui/Modal';
import { DOCUMENT_HISTORY_IDS } from '../../DocumentHistory.testids';
import { ConfirmNote } from './SaveVersionModal.styles';

export interface SaveVersionModalProps {
  onConfirm: () => void;
  onClose: () => void;
}

export const SaveVersionModal = ({ onConfirm, onClose }: SaveVersionModalProps) => {
  const modalRef = useRef<ModalHandle>(null);

  const handleCancel = () => modalRef.current?.requestClose();

  const handleConfirm = () => {
    onConfirm();
    modalRef.current?.requestClose();
  };

  return (
    <Modal
      ref={modalRef}
      variant="confirm"
      title="לשמור את הגרסה הנוכחית?"
      width={320}
      onClose={onClose}
      data-testid={DOCUMENT_HISTORY_IDS.saveConfirm}
      footer={
        <>
          <Button type="button" variant="outline" size="sm" onClick={handleCancel}>
            ביטול
          </Button>
          <Button type="button" size="sm" onClick={handleConfirm}>
            שמור
          </Button>
        </>
      }
    >
      <ConfirmNote>השינויים שבוטלו לא יהיו ניתנים לשחזור</ConfirmNote>
    </Modal>
  );
};
