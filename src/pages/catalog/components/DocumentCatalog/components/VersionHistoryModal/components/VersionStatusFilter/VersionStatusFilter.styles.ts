import styled from 'styled-components';
import { colors, gray, radii, shadows, transitions } from '@/styles/theme';

export const FilterAnchor = styled.div`
  position: relative;
`;

export const StatusPanel = styled.div`
  position: absolute;
  left: 0;
  top: 100%;
  z-index: 100;
  min-width: 180px;
  margin-top: 6px;
  padding: 6px 0;
  border: 1px solid ${gray[100]};
  border-radius: ${radii.xl};
  background: ${colors.surface};
  box-shadow: ${shadows.xl};
`;

export const StatusOption = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background ${transitions.normal};

  &:hover {
    background: ${gray[50]};
  }
`;

export const StatusPill = styled.span<{ $bg: string; $ink: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 8px;
  border-radius: ${radii.full};
  font-size: 12px;
  font-weight: 500;
  background: ${({ $bg }) => $bg};
  color: ${({ $ink }) => $ink};
`;

export const StatusPillDot = styled.span<{ $ink: string }>`
  flex-shrink: 0;
  width: 6px;
  height: 6px;
  border-radius: ${radii.full};
  background: ${({ $ink }) => $ink};
`;
