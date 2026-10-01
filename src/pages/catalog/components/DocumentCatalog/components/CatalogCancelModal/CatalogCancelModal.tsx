import { useRef, useState } from 'react';
import type { CatalogDoc } from '@/api/catalog';
import type { ModalHandle } from '@/components/ui/Modal';
import { Modal } from '@/components/ui/Modal';
import { DistributeDoc } from '@/modals/DistributeDoc';
import { CATALOG_MODAL_IDS } from '../catalogModals.testids';
import {
  ConfirmActions,
  ConfirmBody,
  ConfirmCancelBtn,
  ConfirmNote,
} from '../components.shared.styles';
import { CancelConfirmBtn } from './CatalogCancelModal.styles';

interface CatalogCancelModalProps {
  doc: CatalogDoc;
  onClose: () => void;
  onSendCancel: () => void;
}

// Two steps in one dialog: confirm the cancellation, then compose the notice
// that goes out about it. The second step is the same share dialog the document
// page uses, with a different title.
export const CatalogCancelModal = ({ doc, onClose, onSendCancel }: CatalogCancelModalProps) => {
  const [isComposing, setIsComposing] = useState(false);
  const modalRef = useRef<ModalHandle>(null);

  const requestClose = () => modalRef.current?.requestClose();
  const onConfirm = () => setIsComposing(true);
  const onBackToConfirm = () => setIsComposing(false);

  if (isComposing) {
    return (
      <DistributeDoc
        docName={doc.name}
        title="שליחת אגרת ביטול באאוטלוק ובצאט"
        onClose={onBackToConfirm}
        onSend={onSendCancel}
      />
    );
  }

  return (
    <Modal
      ref={modalRef}
      variant="confirm"
      title="האם להעביר את המסמך לסטטוס ׳מבוטל׳?"
      width={420}
      noBodyPadding
      onClose={onClose}
      data-testid={CATALOG_MODAL_IDS.cancel}
    >
      <ConfirmBody>
        <ConfirmNote>פעולה זו אינה הפיכה ותסיים את תוקף הפקודה לאלתר</ConfirmNote>
        <ConfirmActions>
          <ConfirmCancelBtn type="button" onClick={requestClose}>
            ביטול
          </ConfirmCancelBtn>
          <CancelConfirmBtn type="button" onClick={onConfirm}>
            אישור
          </CancelConfirmBtn>
        </ConfirmActions>
      </ConfirmBody>
    </Modal>
  );
};
