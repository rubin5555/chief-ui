import { Check } from 'lucide-react';
import type { CatalogDoc, HmlReceipt } from '@/api/catalog';
import { HML_RECEIPTS_FALLBACK, useHmlReceipts } from '@/api/catalog';
import { InlineSpinner } from '@/components/ui/InlineSpinner';
import { Modal } from '@/components/ui/Modal';
import { CATALOG_MODAL_IDS } from '../catalogModals.testids';
import { ModalSubtitle } from '../components.shared.styles';
import {
  ReceiptDetail,
  ReceiptDetails,
  ReceiptDot,
  ReceiptIcon,
  ReceiptList,
  ReceiptName,
  ReceiptNote,
  ReceiptRow,
  SeenCount,
} from './ReceiptConfirmModal.styles';

interface ReceiptConfirmModalProps {
  doc: CatalogDoc;
  onClose: () => void;
}

// Unseen first, so the ones still owed attention are the ones at the top.
const byUnseenFirst = (a: HmlReceipt, b: HmlReceipt) => Number(a.seen) - Number(b.seen);

export const ReceiptConfirmModal = ({ doc, onClose }: ReceiptConfirmModalProps) => {
  const { data, loading } = useHmlReceipts(doc.id);
  const receipts = data ?? HML_RECEIPTS_FALLBACK;
  const seenCount = receipts.filter((receipt) => receipt.seen).length;

  return (
    <Modal
      title="וידוא קבלה — חמ״לים מכותבים"
      width={480}
      maxHeight="80vh"
      onClose={onClose}
      headerSlot={<SeenCount>{`${seenCount}/${receipts.length}`}</SeenCount>}
      data-testid={CATALOG_MODAL_IDS.receipts}
    >
      <ModalSubtitle>{doc.name}</ModalSubtitle>

      {loading ? (
        <InlineSpinner />
      ) : (
        <ReceiptList>
          {[...receipts].sort(byUnseenFirst).map((receipt) => (
            <ReceiptRow
              key={receipt.name}
              $seen={receipt.seen}
              data-testid={CATALOG_MODAL_IDS.receiptRow(receipt.name)}
            >
              <ReceiptIcon $seen={receipt.seen}>
                {receipt.seen ? <Check size={14} /> : <ReceiptDot />}
              </ReceiptIcon>
              <div>
                <ReceiptName $seen={receipt.seen}>{receipt.name}</ReceiptName>
                {receipt.seen && (
                  <ReceiptDetails>
                    <ReceiptDetail>{receipt.date}</ReceiptDetail>
                    <ReceiptDetail>{receipt.time}</ReceiptDetail>
                    {receipt.note && <ReceiptNote>{receipt.note}</ReceiptNote>}
                  </ReceiptDetails>
                )}
              </div>
            </ReceiptRow>
          ))}
        </ReceiptList>
      )}
    </Modal>
  );
};
