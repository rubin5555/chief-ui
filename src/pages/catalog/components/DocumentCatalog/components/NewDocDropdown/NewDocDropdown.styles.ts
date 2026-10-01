import styled from 'styled-components';
import { FloatingPanel } from '@/components/ui/FloatingPanel';
import { colors, gray, radii, shadows, transitions } from '@/styles/theme';

export const NewDocButton = styled.button`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: ${radii.full};
  font-size: 14px;
  font-weight: 600;
  color: ${colors.surface};
  background: ${colors.primary};
  box-shadow: ${shadows.primary};
  transition: all ${transitions.slow};

  &:hover {
    opacity: 0.9;
  }
  &:active {
    transform: scale(0.95);
  }
`;

// Portalled rather than absolutely positioned, for the same reason as the
// filter funnel: the catalog body clips its overflow.
export const DropdownPanel = styled(FloatingPanel)`
  display: block;
  padding: 4px 0;
  box-shadow: ${shadows.lg};
`;

export const DropdownItem = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 16px;
  font-size: 14px;
  text-align: right;
  color: ${gray[700]};
  transition: background ${transitions.normal};

  &:hover {
    background: ${gray[50]};
  }
`;

export const DropdownItemIcon = styled.span`
  display: flex;
  flex-shrink: 0;
  color: ${gray[400]};
`;
