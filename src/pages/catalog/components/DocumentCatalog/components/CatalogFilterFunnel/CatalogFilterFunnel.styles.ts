import styled from 'styled-components';
import { FloatingPanel } from '@/components/ui/FloatingPanel';
import { flexCenter } from '@/styles/mixins';
import { catColors, colors, gray, radii, transitions } from '@/styles/theme';

export const FunnelTrigger = styled.button`
  ${flexCenter}
  position: relative;
  flex-shrink: 0;
  padding: 8px;
  border-radius: ${radii.full};
  color: ${gray[600]};
  transition: background ${transitions.normal};

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
`;

// A dot rather than a count: the panel itself shows what is on.
export const ActiveDot = styled.span`
  position: absolute;
  top: 2px;
  left: 2px;
  width: 8px;
  height: 8px;
  border-radius: ${radii.full};
  background: ${colors.primary};
`;

// The panel is a portalled `FloatingPanel` rather than the mock's absolutely
// positioned div: the catalog body clips its overflow, so an in-flow panel gets
// cut off at the bottom of the page. Everything else about it — the width, the
// vertical padding, the dividers — is the mock's.
export const FunnelPanel = styled(FloatingPanel)`
  /* Block, not the panel's own column flex: a scrolling list of sections must
     overflow past the height cap, and flex items would shrink to fit it
     instead — which is how a scrollbar goes missing and a section loses rows. */
  display: block;
  padding: 12px 0;
`;

export const PanelDivider = styled.div`
  margin: 8px 0;
  border-top: 1px solid ${gray[100]};
`;

export const ClearAllWrap = styled.div`
  padding: 0 12px;
`;

export const ClearAllBtn = styled.button`
  width: 100%;
  padding: 6px 0;
  border-radius: ${radii.lg};
  font-size: 12px;
  font-weight: 500;
  color: ${gray[400]};
  transition: all ${transitions.normal};

  &:hover {
    color: ${catColors.dangerSoft};
    background: ${catColors.dangerSoftBg};
  }
`;
