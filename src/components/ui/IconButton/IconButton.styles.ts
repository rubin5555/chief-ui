import styled from 'styled-components';
import { colors, gray } from '@/styles/theme';

export const IconButtonRoot = styled.button<{ $isActive: boolean }>`
  position: relative;
  padding: 6px;
  border-radius: 9999px;
  transition: background-color 0.15s, color 0.15s;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(p) => (p.$isActive ? colors.primary : 'transparent')};
  color: ${(p) => (p.$isActive ? colors.surface : gray[400])};
  &:hover { background-color: ${(p) => (p.$isActive ? colors.primary : gray[100])}; }
`;

export const IconButtonBadge = styled.span`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background-color: ${colors.primary};
`;
