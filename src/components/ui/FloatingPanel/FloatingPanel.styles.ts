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

// $pos/$width land on the style attr (not CSS interpolation) so styled-components
// doesn't mint a new class for every reposition.
//
// Exported for the dropdowns that extend it with `styled(FloatingPanelRoot)`.
// Rendering one directly skips the portal — reach for FloatingPanel instead.
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
  /* Vertically scrollable rather than clipped: useFloatingPanel caps the height
     to the room the panel actually has, and when a menu is taller than that the
     options past the cap have to stay reachable. Horizontally still hidden, so
     the rounded corners keep their shape. */
  overflow-x: hidden;
  overflow-y: auto;
  /* The platform scrollbar is 16px wide, which on a 180px menu is a grey gutter
     down one side, drawn over the 16px rounded corner it sits inside. */
  ${subtleScrollbar}
`;
