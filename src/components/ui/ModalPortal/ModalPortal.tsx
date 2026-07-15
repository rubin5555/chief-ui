import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalPortalProps {
  children: ReactNode;
}

// Mounts dialog chrome onto document.body regardless of where it's rendered in the
// component tree, so a modal opened from deep inside a scrolling/transformed panel
// still escapes to the viewport instead of being clipped or mispositioned.
export const ModalPortal = ({ children }: ModalPortalProps) =>
  createPortal(children, document.body);
