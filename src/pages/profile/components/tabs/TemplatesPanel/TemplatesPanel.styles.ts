import styled from 'styled-components';
import { colors, gray, transitions } from '@/styles/theme';

export const PinButton = styled.button<{ $pinned: boolean }>`
  padding: 4px;
  border-radius: 4px;
  background-color: transparent;
  transition: background-color ${transitions.normal};
  cursor: pointer;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover { background-color: ${gray[200]}; }
  color: ${(p) => (p.$pinned ? colors.primary : gray[400])};
`;
