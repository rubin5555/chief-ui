import { useRef } from 'react';
import type { ModalHandle } from '@/components/ui/Modal';
import { Modal } from '@/components/ui/Modal';
import {
  BackBtn,
  ButtonRow,
  ContinueBtn,
  WarningBody,
  WarningText,
} from './ApprovalDirtyWarningModal.styles';
import { APPROVAL_DIRTY_WARNING_IDS } from './ApprovalDirtyWarningModal.testids';

export interface ApprovalDirtyWarningModalProps {
  onBack: () => void;
  onContinue: () => void;
}

export const ApprovalDirtyWarningModal = ({
  onBack,
  onContinue,
}: ApprovalDirtyWarningModalProps) => {
  const modalRef = useRef<ModalHandle>(null);

  const handleBack = () => modalRef.current?.requestClose();

  const handleContinue = () => {
    onContinue();
    modalRef.current?.requestClose();
  };

  return (
    <Modal
      ref={modalRef}
      variant="confirm"
      title="שים לב"
      width={380}
      noBodyPadding
      onClose={onBack}
      data-testid={APPROVAL_DIRTY_WARNING_IDS.root}
    >
      <WarningBody>
        <WarningText>
          שינוי ערכי המסמך יעודכנו רק במסמך הנוכחי ולא בשאר הגרסאות הקודמות שלו
        </WarningText>
        <ButtonRow>
          <BackBtn
            type="button"
            data-testid={APPROVAL_DIRTY_WARNING_IDS.backBtn}
            onClick={handleBack}
          >
            ביטול
          </BackBtn>
          <ContinueBtn
            type="button"
            data-testid={APPROVAL_DIRTY_WARNING_IDS.continueBtn}
            onClick={handleContinue}
          >
            אישור
          </ContinueBtn>
        </ButtonRow>
      </WarningBody>
    </Modal>
  );
};
