import { X } from 'lucide-react';
import type { KeyboardEvent, ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { useDialogClose } from '@/hooks/useDialogClose';
import {
  CloseButton,
  ModalBody,
  ModalCard,
  ModalHeader,
  ModalHeaderIcon,
  ModalHeaderLeft,
  ModalTitle,
  Overlay,
} from './Modal.styles';
import { MODAL_IDS } from './Modal.testids';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface ModalProps {
  title: string;
  icon?: ReactNode;
  onClose: () => void;
  children: ReactNode;
  'data-testid'?: string;
}

export const Modal = ({ title, icon, onClose, children, 'data-testid': testId }: ModalProps) => {
  const base = testId ?? MODAL_IDS.root;
  const cardRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const { isClosing, requestClose } = useDialogClose(onClose);
  const onCloseRef = useRef(requestClose);
  onCloseRef.current = requestClose;

  useEffect(() => {
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

    const focusable = cardRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    if (focusable && focusable.length > 0) {
      focusable[0].focus();
    } else {
      cardRef.current?.focus();
    }

    return () => {
      previouslyFocusedRef.current?.focus();
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const onTrapFocus = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab') return;
    const focusable = cardRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    if (!focusable || focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <Overlay data-testid={`${base}-overlay`} onClick={requestClose} $closing={isClosing}>
      <ModalCard
        ref={cardRef}
        data-testid={base}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onTrapFocus}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        dir="rtl"
        $closing={isClosing}
      >
        <ModalHeader data-testid={`${base}-header`}>
          <ModalHeaderLeft>
            {icon && <ModalHeaderIcon>{icon}</ModalHeaderIcon>}
            <ModalTitle>{title}</ModalTitle>
          </ModalHeaderLeft>
          <CloseButton data-testid={`${base}-close`} onClick={requestClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>
        <ModalBody data-testid={`${base}-body`}>{children}</ModalBody>
      </ModalCard>
    </Overlay>
  );
};
