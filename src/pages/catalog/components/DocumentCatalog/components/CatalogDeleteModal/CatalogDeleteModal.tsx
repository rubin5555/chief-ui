import { useRef } from 'react';
import type { CatalogDoc } from '@/api/catalog';
import type { ModalHandle } from '@/components/ui/Modal';
import { Modal } from '@/components/ui/Modal';
import { CATALOG_MODAL_IDS } from '../catalogModals.testids';
import {
  ConfirmActions,
  ConfirmBody,
  ConfirmCancelBtn,
  ConfirmPrimaryBtn,
} from '../components.shared.styles';

interface CatalogDeleteModalProps {
  doc: CatalogDoc;
  onClose: () => void;
}

export const CatalogDeleteModal = ({ doc, onClose }: CatalogDeleteModalProps) => {
  const modalRef = useRef<ModalHandle>(null);
  const requestClose = () => modalRef.current?.requestClose();

  return (
    <Modal
      ref={modalRef}
      variant="confirm"
      title={`האם בטוח שתרצה למחוק "${doc.name}"?`}
      width={340}
      noBodyPadding
      onClose={onClose}
      data-testid={CATALOG_MODAL_IDS.delete}
    >
      <ConfirmBody>
        <ConfirmActions>
          <ConfirmCancelBtn type="button" onClick={requestClose}>
            ביטול
          </ConfirmCancelBtn>
          {/* Deleting is not wired to anything on main either — the dialog
              closes and the row stays. */}
          <ConfirmPrimaryBtn type="button" onClick={requestClose}>
            מחיקה
          </ConfirmPrimaryBtn>
        </ConfirmActions>
      </ConfirmBody>
    </Modal>
  );
};
