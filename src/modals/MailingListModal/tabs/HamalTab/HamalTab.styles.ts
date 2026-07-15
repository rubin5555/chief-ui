import styled from 'styled-components';
import { colors, gray } from '@/styles/theme';

export const IconActionBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
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
