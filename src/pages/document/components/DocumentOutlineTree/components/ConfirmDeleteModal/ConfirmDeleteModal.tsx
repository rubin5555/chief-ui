import { useRef } from 'react';
import type { ModalHandle } from '@/components/ui/Modal';
import { Modal } from '@/components/ui/Modal';
import type { OutlineDeleteTarget } from '../../DocumentOutlineTree.types';
import { DELETE_LABEL, DELETE_WARNING } from './ConfirmDeleteModal.constants';
import {
  ButtonRow,
  CancelBtn,
  ConfirmBody,
  ConfirmBtn,
  Warning,
} from './ConfirmDeleteModal.styles';
import { CONFIRM_DELETE_MODAL_IDS } from './ConfirmDeleteModal.testids';

export interface ConfirmDeleteModalProps {
  /** Only its `level` is read here — the wording is all this dialog needs to know. */
  target: OutlineDeleteTarget;
  onConfirm: () => void;
  onClose: () => void;
}

// "Are you sure you want to delete this topic?" — main, Edit.tsx:5123.
//
// Closes through Modal's handle rather than calling `onClose` directly, so
// confirming plays the same close animation as cancelling; the deletion runs
// first, while the dialog is still on screen.
export const ConfirmDeleteModal = ({ target, onConfirm, onClose }: ConfirmDeleteModalProps) => {
  const modalRef = useRef<ModalHandle>(null);
  const warning = DELETE_WARNING[target.level];

  const handleConfirm = () => {
    onConfirm();
    modalRef.current?.requestClose();
  };

  const handleCancel = () => modalRef.current?.requestClose();

  return (
    <Modal
      ref={modalRef}
      variant="confirm"
      title={`בטוח שתרצה למחוק ${DELETE_LABEL[target.level]}?`}
      width={340}
      noBodyPadding
      onClose={onClose}
      data-testid={CONFIRM_DELETE_MODAL_IDS.root}
    >
      <ConfirmBody>
        {warning && <Warning data-testid={CONFIRM_DELETE_MODAL_IDS.warning}>{warning}</Warning>}

        <ButtonRow>
          <CancelBtn
            type="button"
            data-testid={CONFIRM_DELETE_MODAL_IDS.cancelBtn}
            onClick={handleCancel}
          >
            ביטול
          </CancelBtn>
          <ConfirmBtn
            type="button"
            data-testid={CONFIRM_DELETE_MODAL_IDS.confirmBtn}
            onClick={handleConfirm}
          >
            מחיקה
          </ConfirmBtn>
        </ButtonRow>
      </ConfirmBody>
    </Modal>
  );
};
