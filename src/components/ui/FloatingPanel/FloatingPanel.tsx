import type { ComponentPropsWithRef } from 'react';
import { ModalPortal } from '@/components/ui/ModalPortal';
import type { Pos } from '@/hooks/useFloatingPanel';
import { FloatingPanelRoot } from './FloatingPanel.styles';

export interface FloatingPanelProps extends ComponentPropsWithRef<'div'> {
  pos?: Pos | null;
  width?: number;
  // For panels the mock sizes by their content — a menu whose items decide how
  // wide it is, rather than one drawn to a fixed column.
  minWidth?: number;
}

export const FloatingPanel = ({ pos, width, minWidth, ref, ...rest }: FloatingPanelProps) => (
  <ModalPortal>
    <FloatingPanelRoot
      ref={ref}
      tabIndex={-1}
      $pos={pos}
      $width={width}
      $minWidth={minWidth}
      {...rest}
    />
  </ModalPortal>
);
