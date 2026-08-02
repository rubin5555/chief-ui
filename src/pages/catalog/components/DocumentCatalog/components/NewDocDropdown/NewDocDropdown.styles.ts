import styled from 'styled-components';
import { colors, gray, radii, shadows, transitions } from '@/styles/theme';

export const DropdownAnchor = styled.div`
  position: relative;
  flex-shrink: 0;
`;

export const NewDocButton = styled.button`
  display: flex;
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

export const DropdownPanel = styled.div`
  position: absolute;
  left: 0;
  top: 100%;
  z-index: 50;
  min-width: 200px;
  margin-top: 8px;
  padding: 4px 0;
  border: 1px solid ${gray[100]};
  border-radius: ${radii['2xl']};
  background: ${colors.surface};
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
