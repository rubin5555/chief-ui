import styled from 'styled-components';
import { resetButton } from '@/styles/mixins';
import { colors, gray } from '@/styles/theme';

export const FilterBtnInline = styled.button<{ $active: boolean }>`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  ${resetButton}
  display: flex;
  align-items: center;
  padding: 0;
  color: ${(props) => (props.$active ? colors.primary : gray[400])};
  &:hover {
    color: ${gray[600]};
  }
`;
