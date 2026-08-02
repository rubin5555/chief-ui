import styled from 'styled-components';
import { flexCenter } from '@/styles/mixins';
import { catColors, colors, gray, radii, shadows, transitions } from '@/styles/theme';

export const FunnelAnchor = styled.div`
  position: relative;
  flex-shrink: 0;
`;

export const FunnelTrigger = styled.button`
  ${flexCenter}
  position: relative;
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

export const FunnelPanel = styled.div`
  position: absolute;
  left: 0;
  top: 100%;
  z-index: 50;
  width: 288px;
  margin-top: 8px;
  padding: 12px 0;
  max-height: 82vh;
  overflow-y: auto;
  border: 1px solid ${gray[100]};
  border-radius: ${radii['2xl']};
  background: ${colors.surface};
  box-shadow: ${shadows.xl};
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
