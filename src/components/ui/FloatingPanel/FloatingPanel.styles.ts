import styled from 'styled-components';
import type { Pos } from '@/hooks/useFloatingPanel';
import { colors, radii, shadows } from '@/styles/theme';
import { FLOATING_PANEL_IDS } from './FloatingPanel.testids';

interface FloatingPanelProps {
  'data-testid'?: string;
  $pos?: Pos | null;
  $width?: number;
}

// $pos/$width land on the style attr (not CSS interpolation) so styled-components
// doesn't mint a new class for every reposition.
export const FloatingPanel = styled.div.attrs<FloatingPanelProps>((props) => ({
  'data-testid': props['data-testid'] ?? FLOATING_PANEL_IDS.root,
  style: { ...props.$pos, width: props.$width },
}))<FloatingPanelProps>`
  position: fixed;
  background: ${colors.surface};
  border-radius: ${radii['2xl']};
  box-shadow: ${shadows.xl};
  border: 1px solid ${colors.border};
  z-index: 99999;
  display: flex;
  flex-direction: column;
  /* Vertically scrollable rather than clipped: useFloatingPanel caps the height
     to the room the panel actually has, and when a menu is taller than that the
     options past the cap have to stay reachable. Horizontally still hidden, so
     the rounded corners keep their shape. */
  overflow-x: hidden;
  overflow-y: auto;
`;
