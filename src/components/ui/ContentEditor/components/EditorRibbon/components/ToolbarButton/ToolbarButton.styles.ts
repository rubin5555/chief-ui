import styled from 'styled-components';
import { gray } from '@/styles/theme';
import { squareToolButton } from '../../../components.shared.styles';

export const ToolbarButtonRoot = styled.button<{ $active?: boolean }>`
  ${squareToolButton}
  color: ${({ $active }) => ($active ? gray[900] : gray[600])};
  background: ${({ $active }) => ($active ? gray[200] : 'transparent')};

  &:hover:not(:disabled) {
    background: ${({ $active }) => ($active ? gray[200] : gray[100])};
  }
`;
