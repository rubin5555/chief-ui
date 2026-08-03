import styled from 'styled-components';
import { FloatingPanel } from '@/components/ui/FloatingPanel';
import { catColors, colors, docStatusColors, gray, transitions } from '@/styles/theme';

// The trigger lives inside a virtualised, scrolling table, so the menu is
// positioned against the viewport from the rect it was opened at — and it is
// portalled, because the catalog body clips its overflow.
export const MenuPanel = styled(FloatingPanel)`
  /* Block, not the panel's own column flex: a distributed row's menu is
     fourteen items tall, and flex items would shrink to fit the height cap
     rather than let it scroll. */
  display: block;
  padding: 6px 0;
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
