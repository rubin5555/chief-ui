import styled from 'styled-components';
import { colors, docStatusColors, gray, radii, shadows, transitions } from '@/styles/theme';

export const ToastRoot = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 9998;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 300px;
  overflow: hidden;
  padding-bottom: 16px;
  border: 1px solid ${gray[100]};
  border-radius: ${radii['2xl']};
  background: ${colors.surface};
  box-shadow: ${shadows.xl};
`;

export const ToastHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 0;
`;

export const ToastTitle = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: ${gray[800]};
`;

export const CloseBtn = styled.button`
  display: flex;
  padding: 4px;
  border-radius: ${radii.lg};
  color: ${gray[400]};
  transition: background ${transitions.normal};

  &:hover {
    background: ${gray[100]};
  }
`;

export const BarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
`;

export const Bar = styled.div`
  flex: 1;
  height: 6px;
  overflow: hidden;
  border-radius: ${radii.full};
  background: ${gray[200]};
`;

export const BarFill = styled.div<{ $progress: number; $complete: boolean }>`
  height: 100%;
  width: ${({ $progress }) => $progress}%;
  border-radius: ${radii.full};
  background: ${({ $complete }) => ($complete ? docStatusColors.approved : colors.primary)};
  transition: width 75ms linear;
`;

export const Percent = styled.span<{ $complete: boolean }>`
  min-width: 36px;
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: ${({ $complete }) => ($complete ? docStatusColors.approved : colors.primary)};
`;

/* Empty until the cancellation finishes, but always present so the toast does
   not resize under the reader when it does. */
export const ToastFooter = styled.div`
  min-height: 16px;
  padding: 0 16px;
  font-size: 12px;
  color: ${gray[500]};
`;
