import styled from 'styled-components';
import { colors, gray } from '@/styles/theme';

export const CheckBox = styled.button<{ $checked: boolean; $disabled: boolean; $size?: number }>`
  width: ${(props) => props.$size ?? 20}px;
  height: ${(props) => props.$size ?? 20}px;
  border-radius: 4px;
  border: 1.5px solid ${(props) => (props.$disabled ? gray[200] : props.$checked ? colors.primary : gray[300])};
  background: ${(props) => (props.$disabled ? colors.surface : props.$checked ? colors.primary : 'transparent')};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${(props) => (props.$disabled ? 'default' : 'pointer')};
  flex-shrink: 0;
  transition: border-color 0.15s, background 0.15s;
  &:hover:not(:disabled) { border-color: ${colors.primary}; }
`;
