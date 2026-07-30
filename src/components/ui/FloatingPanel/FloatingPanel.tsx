import type { ComponentPropsWithRef } from 'react';
import { ModalPortal } from '@/components/ui/ModalPortal';
import type { Pos } from '@/hooks/useFloatingPanel';
import { FloatingPanelRoot } from './FloatingPanel.styles';

export interface FloatingPanelProps extends ComponentPropsWithRef<'div'> {
  pos?: Pos | null;
  width?: number;
}

export const FloatingPanel = ({ pos, width, ref, ...rest }: FloatingPanelProps) => (
  <ModalPortal>
    <FloatingPanelRoot ref={ref} tabIndex={-1} $pos={pos} $width={width} {...rest} />
  </ModalPortal>
);
