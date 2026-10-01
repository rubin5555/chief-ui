import styled from 'styled-components';
import { colors, gray, radii } from '@/styles/theme';

export const SearchInputWrap = styled.div`
  position: relative;
  flex: 1;
`;

export const SearchInput = styled.input<{ $hasTrailing?: boolean }>`
  width: 100%;
  padding: 8px 36px 8px ${({ $hasTrailing }) => ($hasTrailing ? '36px' : '16px')};
  border: 1px solid ${gray[200]};
  border-radius: ${radii.xl};
  font-size: 13px;
  text-align: right;
  background: ${colors.surface};
  outline: none;
  direction: rtl;
  box-sizing: border-box;
  transition: border-color 0.15s;
  &:focus { border-color: ${colors.primary}; }
`;

export const SearchIcon = styled.span`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${gray[400]};
  pointer-events: none;
  display: flex;
  align-items: center;
`;
