import styled from 'styled-components';
import {
  catColors,
  colors,
  docStatusColors,
  gray,
  radii,
  shadows,
  transitions,
} from '@/styles/theme';

// Fixed rather than absolute: the trigger lives inside a virtualised, scrolling
// table, so the menu is positioned against the viewport at the moment it opens.
export const MenuLayer = styled.div<{ $top?: number; $bottom?: number; $left: number }>`
  position: fixed;
  z-index: 9998;
  left: ${({ $left }) => $left}px;
  ${({ $top }) => ($top !== undefined ? `top: ${$top}px;` : '')}
  ${({ $bottom }) => ($bottom !== undefined ? `bottom: ${$bottom}px;` : '')}
`;

export const MenuPanel = styled.div`
  min-width: 210px;
  max-height: 80vh;
  overflow-y: auto;
  padding: 6px 0;
  border: 1px solid ${gray[100]};
  border-radius: ${radii['2xl']};
  background: ${colors.surface};
  box-shadow: ${shadows.xl};
`;

export const MenuItem = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 8px 16px;
  font-size: 14px;
  text-align: right;
  color: ${({ $danger }) => ($danger ? catColors.dangerSoft : gray[700])};
  transition: background ${transitions.normal};

  &:hover {
    background: ${gray[50]};
  }
`;

export const MenuItemIcon = styled.span<{ $danger?: boolean }>`
  display: flex;
  flex-shrink: 0;
  color: ${({ $danger }) => ($danger ? catColors.dangerSoft : gray[400])};
  opacity: ${({ $danger }) => ($danger ? 0.8 : 1)};
`;

export const MenuItemLabel = styled.span`
  flex: 1;
`;

export const MenuSeparator = styled.div`
  margin: 4px 0;
  border-top: 1px solid ${gray[100]};
`;

export const PhaseSpinner = styled.span`
  display: flex;
  flex-shrink: 0;
  color: ${colors.primary};
  animation: row-action-spin 1s linear infinite;

  @keyframes row-action-spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const PhaseDone = styled.span`
  display: flex;
  flex-shrink: 0;
  color: ${docStatusColors.approved};
`;
