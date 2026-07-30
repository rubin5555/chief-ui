import styled from 'styled-components';
import { flexCenter, resetButton } from '@/styles/mixins';
import { gray, radii, transitions } from '@/styles/theme';

export const ToolbarButtonRoot = styled.button<{ $active?: boolean }>`
  ${resetButton}
  ${flexCenter}
  width: 26px;
  height: 26px;
  padding: 0;
  flex-shrink: 0;
  border-radius: ${radii.sm};
  transition: background ${transitions.normal}, color ${transitions.normal};
  color: ${({ $active }) => ($active ? gray[900] : gray[600])};
  background: ${({ $active }) => ($active ? gray[200] : 'transparent')};

  &:hover:not(:disabled) {
    background: ${({ $active }) => ($active ? gray[200] : gray[100])};
  }

  &:disabled {
    color: ${gray[300]};
    cursor: not-allowed;
  }
`;
