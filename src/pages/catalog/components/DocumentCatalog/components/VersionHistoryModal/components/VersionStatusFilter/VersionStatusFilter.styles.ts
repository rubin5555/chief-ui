import styled from 'styled-components';
import { FloatingPanel } from '@/components/ui/FloatingPanel';
import { gray, radii, transitions } from '@/styles/theme';

export const StatusPanel = styled(FloatingPanel)`
  padding: 6px 0;
  border-radius: ${radii.xl};
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
  white-space: nowrap;
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
