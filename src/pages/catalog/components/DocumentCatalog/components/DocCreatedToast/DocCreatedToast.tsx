import { Check, X } from 'lucide-react';
import { ModalPortal } from '@/components/ui/ModalPortal';
import { CATALOG_MODAL_IDS } from '../catalogModals.testids';
import {
  ToastCard,
  ToastCloseBtn,
  ToastIcon,
  ToastLayer,
  ToastText,
  ToastTitle,
} from './DocCreatedToast.styles';

interface DocCreatedToastProps {
  onClose: () => void;
}

// A centred confirmation card rather than a corner toast — main puts it over
// the page and lets clicks through everywhere except the card itself.
export const DocCreatedToast = ({ onClose }: DocCreatedToastProps) => (
  <ModalPortal>
    <ToastLayer>
      <ToastCard dir="rtl" data-testid={CATALOG_MODAL_IDS.docCreatedToast}>
        <ToastCloseBtn type="button" aria-label="סגירה" onClick={onClose}>
          <X size={16} />
        </ToastCloseBtn>
        <ToastIcon>
          <Check size={24} />
        </ToastIcon>
        <ToastTitle>המסמך נוצר בהצלחה</ToastTitle>
        <ToastText>המסמך נוסף לרשימת הטיוטות</ToastText>
      </ToastCard>
    </ToastLayer>
  </ModalPortal>
);
