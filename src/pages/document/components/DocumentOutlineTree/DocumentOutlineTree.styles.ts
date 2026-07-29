import styled from 'styled-components';
import { flexScroll } from '@/styles/mixins';
import { SECTION_LIST_INDENT } from './DocumentOutlineTree.constants';

// The tree is the one part of the sidebar that scrolls: the status block above it
// and the button row below it stay put while the outline grows.
export const TreeRoot = styled.nav`
  ${flexScroll}
  display: flex;
  flex-direction: column;
  padding-bottom: 4px;
`;

/** As tall as every row, rendered or not, so the scrollbar means what it says. */
export const VirtualList = styled.div<{ $height: number }>`
  position: relative;
  width: 100%;
  height: ${({ $height }) => $height}px;
`;

/**
 * Where a row's nesting lives now. Flattening the tree cost the containers that
 * indented each level and spaced the rows apart, so the indent — and the 4px the
 * level lists got from `gap` — rides on the row instead. `padding` rather than
 * `margin`, so both are inside the measured height.
 */
export const VirtualRow = styled.div<{ $top: number; $indented: boolean }>`
  position: absolute;
  top: 0;
  inset-inline-start: 0;
  width: 100%;
  padding-bottom: 4px;
  padding-inline-start: ${({ $indented }) => ($indented ? SECTION_LIST_INDENT : 0)}px;
  transform: translateY(${({ $top }) => $top}px);
`;
