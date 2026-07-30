import styled from 'styled-components';
import { flexCenter, resetButton } from '@/styles/mixins';
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
  padding-bottom: 4px;
  border: 1px solid ${gray[100]};
  border-radius: ${radii['2xl']};
  background-color: ${colors.surface};
  box-shadow: ${shadows.xl};
  overflow: hidden;
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
  ${resetButton}
  ${flexCenter}
  padding: 4px;
  border-radius: ${radii.lg};
  color: ${gray[400]};
  transition: background-color ${transitions.normal};

  &:hover {
    background-color: ${gray[100]};
  }
`;

export const ProgressRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
`;

export const Track = styled.div`
  flex: 1;
  height: 6px;
  border-radius: ${radii.full};
  background-color: ${gray[200]};
  overflow: hidden;
`;

export const Fill = styled.div<{ $percent: number; $complete: boolean }>`
  height: 100%;
  width: ${({ $percent }) => $percent}%;
  border-radius: ${radii.full};
  background-color: ${({ $complete }) => ($complete ? docStatusColors.approved : colors.primary)};
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

export const SuccessDetail = styled.span`
  padding: 0 16px 16px;
  font-size: 12px;
  color: ${gray[500]};
`;
