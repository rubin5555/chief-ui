import styled from 'styled-components';
import { resetButton } from '@/styles/mixins';
import { colors, docColors, radii, transitions } from '@/styles/theme';
import { BAR_WIDTH } from '../../document.measurements';

export const Bar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: ${BAR_WIDTH};
  padding: 8px 16px;
  border-radius: ${radii['2xl']};
  background-color: ${docColors.compareBg};
`;

export const VersionLabel = styled.span`
  white-space: nowrap;
  font-size: 12px;
  font-weight: 600;
  color: ${colors.primary};
`;

export const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

export const TogglePill = styled.button<{ $active: boolean }>`
  ${resetButton}
  padding: 4px 10px;
  border-radius: ${radii.full};
  white-space: nowrap;
  font-size: 12px;
  font-weight: 500;
  transition: background-color ${transitions.normal}, color ${transitions.normal};

  ${({ $active }) =>
    $active
      ? `
        background-color: ${colors.primary};
        color: ${colors.surface};
        border: 1px solid ${colors.primary};
      `
      : `
        background-color: ${colors.surface};
        color: ${colors.primary};
        border: 1px solid ${docColors.compareBorder};
      `}
`;

export const Divider = styled.div`
  width: 1px;
  height: 16px;
  background-color: ${docColors.compareBorder};
`;

export const NavGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

export const IconBtn = styled.button`
  ${resetButton}
  display: flex;
  padding: 4px;
  border-radius: ${radii.sm};
  color: ${colors.primary};
  transition: background-color ${transitions.normal};

  &:hover:not(:disabled) {
    background-color: ${docColors.compareBorder};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const NavCounter = styled.span`
  min-width: 28px;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: ${colors.primary};
`;
