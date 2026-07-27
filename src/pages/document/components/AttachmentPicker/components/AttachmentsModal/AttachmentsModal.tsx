import { FileDown, FileText, Paperclip, Trash2 } from 'lucide-react';
import { useRef } from 'react';
import { Button } from '@/components/ui/Button';
import type { ModalHandle } from '@/components/ui/Modal';
import { Modal } from '@/components/ui/Modal';
import type { AttachmentFile } from '../../../../types';
import { downloadAttachment, formatSizeKb } from '../../attachmentPicker.utils';
import {
  AddMoreBtn,
  DeleteBtn,
  DownloadBtn,
  EmptyState,
  FileIcon,
  FileInfo,
  FileList,
  FileName,
  FileRow,
  FileSize,
  RowActions,
} from './AttachmentsModal.styles';
import { ATTACHMENTS_MODAL_IDS } from './AttachmentsModal.testids';

export interface AttachmentsModalProps {
  attachments: AttachmentFile[];
  onAddMore: () => void;
  onRemove: (attachmentId: string) => void;
  onClose: () => void;
}

// What is attached to a node, with a way to add, download or drop one (main,
// Edit.tsx:4848).
//
// Both footer buttons close: main's `ביטול` and `סיום` do the same thing, because
// every change here has already been made — a file is added the moment it is
// picked and removed the moment its bin is clicked. Nothing is staged, so there
// is nothing to cancel. Kept as main has it rather than dropping a button people
// will look for.
export const AttachmentsModal = ({
  attachments,
  onAddMore,
  onRemove,
  onClose,
}: AttachmentsModalProps) => {
  const modalRef = useRef<ModalHandle>(null);

  const handleClose = () => modalRef.current?.requestClose();
  const handleRemove = (attachmentId: string) => () => onRemove(attachmentId);
  const handleDownload = (attachment: AttachmentFile) => () => downloadAttachment(attachment);

  return (
    <Modal
      ref={modalRef}
      title="קבצים מצורפים"
      width={480}
      maxHeight="70vh"
      onClose={onClose}
      footerAlign="end"
      footer={
        <>
          <Button type="button" variant="ghost" onClick={handleClose}>
            ביטול
          </Button>
          <Button type="button" onClick={handleClose} data-testid={ATTACHMENTS_MODAL_IDS.doneBtn}>
            סיום
          </Button>
        </>
      }
      data-testid={ATTACHMENTS_MODAL_IDS.root}
    >
      <FileList>
        {attachments.length === 0 ? (
          <EmptyState data-testid={ATTACHMENTS_MODAL_IDS.emptyState}>אין קבצים מצורפים</EmptyState>
        ) : (
          attachments.map((attachment) => (
            <FileRow key={attachment.id} data-testid={ATTACHMENTS_MODAL_IDS.row(attachment.id)}>
              <FileInfo>
                <FileIcon>
                  <FileText size={16} aria-hidden="true" />
                </FileIcon>
                <FileName>{attachment.name}</FileName>
                <FileSize>{formatSizeKb(attachment.size)}</FileSize>
              </FileInfo>

              <RowActions>
                {/* A server-seeded attachment has no object URL behind it — there
                    is no blob in this tab to hand the browser — so its download
                    is unavailable rather than broken. */}
                <DownloadBtn
                  type="button"
                  title="הורדה"
                  aria-label={`הורדת ${attachment.name}`}
                  disabled={!attachment.objectUrl}
                  data-testid={ATTACHMENTS_MODAL_IDS.downloadBtn(attachment.id)}
                  onClick={handleDownload(attachment)}
                >
                  <FileDown size={14} aria-hidden="true" />
                </DownloadBtn>

                <DeleteBtn
                  type="button"
                  title="מחיקה"
                  aria-label={`מחיקת ${attachment.name}`}
                  data-testid={ATTACHMENTS_MODAL_IDS.deleteBtn(attachment.id)}
                  onClick={handleRemove(attachment.id)}
                >
                  <Trash2 size={14} aria-hidden="true" />
                </DeleteBtn>
              </RowActions>
            </FileRow>
          ))
        )}

        <AddMoreBtn
          type="button"
          data-testid={ATTACHMENTS_MODAL_IDS.addMoreBtn}
          onClick={onAddMore}
        >
          <Paperclip size={14} aria-hidden="true" />
          הוסף קבצים נוספים
        </AddMoreBtn>
      </FileList>
    </Modal>
  );
};
