import styled from 'styled-components';
import { flexScroll } from '@/styles/mixins';
import { SECTION_LIST_INDENT } from './DocumentOutlineTree.constants';

export const TreeRoot = styled.nav`
  ${flexScroll}
  display: flex;
  flex-direction: column;
  padding-bottom: 4px;
`;

export const VirtualList = styled.div<{ $height: number }>`
  position: relative;
  width: 100%;
  height: ${({ $height }) => $height}px;
`;

export const VirtualRow = styled.div<{ $top: number; $indented: boolean }>`
  position: absolute;
  top: 0;
  inset-inline-start: 0;
  width: 100%;
  padding-bottom: 4px;
  padding-inline-start: ${({ $indented }) => ($indented ? SECTION_LIST_INDENT : 0)}px;
  transform: translateY(${({ $top }) => $top}px);
`;
