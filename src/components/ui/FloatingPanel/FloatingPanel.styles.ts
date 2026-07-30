import styled from 'styled-components';
import type { Pos } from '@/hooks/useFloatingPanel';
import { subtleScrollbar } from '@/styles/mixins';
import { colors, radii, shadows } from '@/styles/theme';
import { FLOATING_PANEL_IDS } from './FloatingPanel.testids';

interface FloatingPanelRootProps {
  'data-testid'?: string;
  $pos?: Pos | null;
  $width?: number;
}

export const FloatingPanelRoot = styled.div.attrs<FloatingPanelRootProps>((props) => ({
  'data-testid': props['data-testid'] ?? FLOATING_PANEL_IDS.root,
  style: { ...props.$pos, width: props.$width },
}))<FloatingPanelRootProps>`
  position: fixed;
  background: ${colors.surface};
  border-radius: ${radii['2xl']};
  box-shadow: ${shadows.xl};
  border: 1px solid ${colors.border};
  z-index: 99999;
  display: flex;
  flex-direction: column;

  overflow-x: hidden;
  overflow-y: auto;

  ${subtleScrollbar}
`;
