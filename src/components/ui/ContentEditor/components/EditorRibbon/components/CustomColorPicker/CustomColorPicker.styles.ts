import styled from 'styled-components';
import { flexGap } from '@/styles/mixins';
import { colors, gray, radii } from '@/styles/theme';

export const PickerCard = styled.div<{ $top: number; $right: number }>`
  position: fixed;
  top: ${({ $top }) => $top}px;
  right: ${({ $right }) => $right}px;
  z-index: 99999;
  width: 272px;
  padding: 14px;
  direction: rtl;
  background: ${colors.surface};
  border: 1px solid ${gray[200]};
  border-radius: ${radii['2xl']};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
`;

export const SliderRow = styled.div`
  ${flexGap(10)}
  margin-bottom: 12px;

  direction: ltr;
`;

export const PreviewDot = styled.span<{ $color: string }>`
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: ${radii.full};
  border: 1.5px solid ${gray[200]};
  background: ${({ $color }) => $color};
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 8px;

  > button {
    flex: 1;
    justify-content: center;
  }
`;
