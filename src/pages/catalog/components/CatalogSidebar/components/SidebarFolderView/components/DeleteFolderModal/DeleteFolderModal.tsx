import { useRef } from 'react';
import type { ModalHandle } from '@/components/ui/Modal';
import { Modal } from '@/components/ui/Modal';
import { CATALOG_SIDEBAR_IDS } from '../../../../CatalogSidebar.testids';
import { ButtonRow, CancelBtn, ConfirmBody, ConfirmBtn, Warning } from './DeleteFolderModal.styles';

interface DeleteFolderModalProps {
  onConfirm: () => void;
  onClose: () => void;
}

export const DeleteFolderModal = ({ onConfirm, onClose }: DeleteFolderModalProps) => {
  const modalRef = useRef<ModalHandle>(null);

  const handleConfirm = () => {
    onConfirm();
    modalRef.current?.requestClose();
  };

  const handleCancel = () => modalRef.current?.requestClose();

  return (
    <Modal
      ref={modalRef}
      variant="confirm"
      title="האם אתה בטוח שברצונך למחוק?"
      width={360}
      noBodyPadding
      onClose={onClose}
      data-testid={CATALOG_SIDEBAR_IDS.deleteFolderModal}
    >
      <ConfirmBody>
        <Warning>פעולה זו אינה ניתנת לביטול.</Warning>
        <ButtonRow>
          <CancelBtn type="button" onClick={handleCancel}>
            ביטול
          </CancelBtn>
          <ConfirmBtn type="button" onClick={handleConfirm}>
            אישור
          </ConfirmBtn>
        </ButtonRow>
      </ConfirmBody>
    </Modal>
  );
};
