import { X } from 'lucide-react';
import type { KeyboardEvent, MouseEvent, ReactNode } from 'react';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { ModalPortal } from '@/components/ui/ModalPortal';
import { useDialogClose } from '@/hooks/useDialogClose';
import { getFocusable } from '@/utils/focusable';
import {
  CloseButton,
  ConfirmHeader,
  ConfirmTitle,
  ModalBody,
  ModalCard,
  ModalFooter,
  ModalHeader,
  ModalHeaderIcon,
  ModalHeaderLeft,
  ModalTitle,
  Overlay,
} from './Modal.styles';
import { MODAL_IDS } from './Modal.testids';

export interface ModalHandle {
  requestClose: () => void;
}

interface ModalProps {
  title: string;
  icon?: ReactNode;
  onClose: () => void;
  onRequestClose?: () => void;
  variant?: 'default' | 'confirm';
  headerSlot?: ReactNode;
  footer?: ReactNode;
  footerAlign?: 'end' | 'between';
  width?: number;
  maxWidth?: string;
  height?: string;
  maxHeight?: string;
  noBodyPadding?: boolean;
  // Stamped on the overlay, for callers whose dialog has to say in the DOM who
  // it belongs to — a portal breaks the ancestry the owner would be found by.
  overlayAttrs?: Record<string, string>;
  children: ReactNode;
  'data-testid'?: string;
}

export const Modal = forwardRef<ModalHandle, ModalProps>(
  (
    {
      title,
      icon,
      onClose,
      onRequestClose,
      variant = 'default',
      headerSlot,
      footer,
      footerAlign = 'end',
      width,
      maxWidth,
      height,
      maxHeight,
      noBodyPadding,
      overlayAttrs,
      children,
      'data-testid': testId,
    },
    ref,
  ) => {
    const base = testId ?? MODAL_IDS.root;
    const cardRef = useRef<HTMLDivElement>(null);
    const previouslyFocusedRef = useRef<HTMLElement | null>(null);
    const { isClosing, requestClose } = useDialogClose(onClose);

    useImperativeHandle(ref, () => ({ requestClose }), [requestClose]);

    const onChromeClose = onRequestClose ?? requestClose;
    const onChromeCloseRef = useRef(onChromeClose);
    onChromeCloseRef.current = onChromeClose;

    useEffect(() => {
      previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

      const card = cardRef.current;
      const focusable = card ? getFocusable(card) : [];
      if (focusable.length > 0) {
        focusable[0].focus();
      } else {
        card?.focus();
      }

      return () => {
        previouslyFocusedRef.current?.focus();
      };
    }, []);

    useEffect(() => {
      const onKeyDown = (e: globalThis.KeyboardEvent) => {
        if (e.key === 'Escape') onChromeCloseRef.current();
      };
      document.addEventListener('keydown', onKeyDown);
      return () => document.removeEventListener('keydown', onKeyDown);
    }, []);

    const onCardClick = (e: MouseEvent<HTMLDivElement>) => e.stopPropagation();

    const onTrapFocus = (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key !== 'Tab') return;
      const card = cardRef.current;
      const focusable = card ? getFocusable(card) : [];
      if (focusable.length === 0) return;

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
      <ModalPortal>
        <Overlay
          {...overlayAttrs}
          data-testid={`${base}-overlay`}
          onClick={onChromeClose}
          $closing={isClosing}
        >
          <ModalCard
            ref={cardRef}
            data-testid={base}
            onClick={onCardClick}
            onKeyDown={onTrapFocus}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            dir="rtl"
            $closing={isClosing}
            $width={width}
            $maxWidth={maxWidth}
            $height={height}
            $maxHeight={maxHeight}
          >
            {variant === 'confirm' ? (
              <ConfirmHeader data-testid={`${base}-header`}>
                <ConfirmTitle>{title}</ConfirmTitle>
              </ConfirmHeader>
            ) : (
              <ModalHeader data-testid={`${base}-header`}>
                <ModalHeaderLeft>
                  {icon && <ModalHeaderIcon>{icon}</ModalHeaderIcon>}
                  {headerSlot ?? <ModalTitle>{title}</ModalTitle>}
                </ModalHeaderLeft>
                <CloseButton data-testid={`${base}-close`} onClick={onChromeClose}>
                  <X size={20} />
                </CloseButton>
              </ModalHeader>
            )}
            <ModalBody data-testid={`${base}-body`} $noPadding={noBodyPadding}>
              {children}
            </ModalBody>
            {footer && (
              <ModalFooter data-testid={`${base}-footer`} $align={footerAlign}>
                {footer}
              </ModalFooter>
            )}
          </ModalCard>
        </Overlay>
      </ModalPortal>
    );
  },
);

Modal.displayName = 'Modal';
