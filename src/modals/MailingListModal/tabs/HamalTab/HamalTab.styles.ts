import styled from 'styled-components';
import { flexCenter } from '@/styles/mixins';
import { colors, gray } from '@/styles/theme';

export const IconActionBtn = styled.button`
  ${flexCenter}
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: ${gray[400]};
  transition: background 0.1s, color 0.1s;
  padding: 0;
  &:hover { background: ${colors.primaryLight}; color: ${colors.primary}; }
`;
