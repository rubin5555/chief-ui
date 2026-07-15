import styled from 'styled-components';
import { flexCenter } from '@/styles/mixins';
import { colors, gray, transitions } from '@/styles/theme';

export const PinButton = styled.button<{ $pinned: boolean }>`
  padding: 4px;
  border-radius: 4px;
  background-color: transparent;
  transition: background-color ${transitions.normal};
  cursor: pointer;
  flex-shrink: 0;
  ${flexCenter}
  &:hover { background-color: ${gray[200]}; }
  color: ${(p) => (p.$pinned ? colors.primary : gray[400])};
`;
