import styled from 'styled-components';
import { flexGap, resetButton } from '@/styles/mixins';
import { colors, docColors, gray, radii } from '@/styles/theme';

export const MenuBody = styled.div`
  padding: 10px 12px;
  direction: rtl;
`;

export const MenuTitle = styled.p`
  margin-bottom: 8px;
  font-size: 10px;
  font-weight: 600;
  color: ${gray[400]};
`;

export const SwatchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 6px;
  margin-bottom: 10px;
`;

export const Swatch = styled.button<{ $color: string; $selected: boolean }>`
  ${resetButton}
  width: 22px;
  height: 22px;
  border-radius: ${radii.md};
  background: ${({ $color }) => $color};
  border: ${({ $selected }) =>
    $selected ? `2px solid ${colors.primary}` : `1px solid ${gray[200]}`};
`;

export const CustomRow = styled.div`
  padding-top: 8px;
  border-top: 1px solid ${docColors.hairline};
`;

export const CustomButton = styled.button`
  ${resetButton}
  ${flexGap(8)}
  width: 100%;
  padding: 2px 0;
`;

export const CustomPreview = styled.span<{ $color: string }>`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  border-radius: ${radii.md};
  border: 1px solid ${gray[200]};
  background: ${({ $color }) => $color};
`;

export const CustomLabel = styled.span`
  font-size: 11px;
  color: ${gray[700]};
`;
