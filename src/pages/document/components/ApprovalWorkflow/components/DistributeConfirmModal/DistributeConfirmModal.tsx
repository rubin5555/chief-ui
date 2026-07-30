import { useRef } from 'react';
import type { ModalHandle } from '@/components/ui/Modal';
import { Modal } from '@/components/ui/Modal';
import {
  ButtonRow,
  ConfirmBody,
  Consequence,
  DistributeBtn,
  DocName,
  LaterBtn,
  Question,
} from './DistributeConfirmModal.styles';
import { DISTRIBUTE_CONFIRM_MODAL_IDS } from './DistributeConfirmModal.testids';

export interface DistributeConfirmModalProps {
  docName: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const DistributeConfirmModal = ({
  docName,
  onConfirm,
  onClose,
}: DistributeConfirmModalProps) => {
  const modalRef = useRef<ModalHandle>(null);

  const handleLater = () => modalRef.current?.requestClose();

  const handleConfirm = () => {
    onConfirm();
    modalRef.current?.requestClose();
  };

  return (
    <Modal
      ref={modalRef}
      variant="confirm"
      title="הפצת המסמך"
      width={400}
      noBodyPadding
      onClose={onClose}
      data-testid={DISTRIBUTE_CONFIRM_MODAL_IDS.root}
    >
      <ConfirmBody>
        <Question>
          האם ברצונך להפיץ את המסמך <DocName>״{docName}״</DocName>?
        </Question>
        <Consequence>הפצת המסמך יעביר את המסמך מטיוטות למסמכים שהופצו</Consequence>
        <ButtonRow>
          <LaterBtn
            type="button"
            data-testid={DISTRIBUTE_CONFIRM_MODAL_IDS.laterBtn}
            onClick={handleLater}
          >
            לא כרגע
          </LaterBtn>
          <DistributeBtn
            type="button"
            data-testid={DISTRIBUTE_CONFIRM_MODAL_IDS.confirmBtn}
            onClick={handleConfirm}
          >
            הפצת המסמך
          </DistributeBtn>
        </ButtonRow>
      </ConfirmBody>
    </Modal>
  );
};
