import { X } from 'lucide-react';
import type { KeyboardEvent, ReactNode } from 'react';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { ModalPortal } from '@/components/ui/ModalPortal';
import { useDialogClose } from '@/hooks/useDialogClose';
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

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface ModalHandle {
  // Starts the close animation and, once it finishes, calls the `onClose` prop.
  // Exposed for callers that need to trigger a close from outside the built-in
  // header-close/overlay-click/Escape paths — e.g. a footer button, or a form
  // submit handler that saves and then closes.
  requestClose: () => void;
}

interface ModalProps {
  title: string;
  icon?: ReactNode;
  onClose: () => void;
  // Fired when the built-in header-close button, overlay click, or Escape key
  // requests a close — before the close animation starts. Lets a caller run a
  // side effect (e.g. analytics) on every "user dismissed the dialog" path,
  // not just the ones it renders itself. Defaults to starting the close
  // animation immediately, with no side effect.
  onRequestClose?: () => void;
  // 'confirm' is for a short question with two answers: the title centres over
  // the body with no rule beneath it and no close X, because a confirm dialog's
  // dismissal is one of the two buttons rather than a third, quieter way out.
  // Everything else — focus trap, Escape, overlay click, animation — is
  // unchanged, and 'default' is untouched.
  variant?: 'default' | 'confirm';
  footer?: ReactNode;
  footerAlign?: 'end' | 'between';
  width?: number;
  maxWidth?: string;
  height?: string;
  maxHeight?: string;
  noBodyPadding?: boolean;
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
      footer,
      footerAlign = 'end',
      width,
      maxWidth,
      height,
      maxHeight,
      noBodyPadding,
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
        if (e.key === 'Escape') onChromeCloseRef.current();
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
      <ModalPortal>
        <Overlay data-testid={`${base}-overlay`} onClick={onChromeClose} $closing={isClosing}>
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
                  <ModalTitle>{title}</ModalTitle>
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
