import { useRef } from 'react';
import { Button } from '@/components/ui/Button';
import type { ModalHandle } from '@/components/ui/Modal';
import { Modal } from '@/components/ui/Modal';
import { SECTION_TABLE_VIEW_IDS } from '../../SectionTableView.testids';
import { ConfirmNote } from './DeleteTableModal.styles';

export interface DeleteTableModalProps {
  onConfirm: () => void;
  onClose: () => void;
}

export const DeleteTableModal = ({ onConfirm, onClose }: DeleteTableModalProps) => {
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
      title="האם אתה בטוח שברצונך למחוק?"
      width={320}
      onClose={onClose}
      data-testid={SECTION_TABLE_VIEW_IDS.deleteConfirm}
      footer={
        <>
          <Button type="button" variant="outline" size="sm" onClick={handleCancel}>
            ביטול
          </Button>
          <Button type="button" size="sm" onClick={handleConfirm}>
            אישור
          </Button>
        </>
      }
    >
      <ConfirmNote>פעולה זו אינה ניתנת לביטול</ConfirmNote>
    </Modal>
  );
};
