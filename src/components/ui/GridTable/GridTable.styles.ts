import styled from 'styled-components';
import { colors, gray } from '@/styles/theme';
import { DENSITY } from './GridTable.constants';
import type { Density } from './GridTable.types';

export const TableScrollBody = styled.div`
  flex: 1;
  overflow-y: auto;
`;

export const TableHeader = styled.div<{ $columns: string; $density: Density }>`
  display: grid;
  grid-template-columns: ${({ $columns }) => $columns};
  column-gap: ${({ $density }) => DENSITY[$density].columnGap};
  padding: ${({ $density }) => DENSITY[$density].headerPadding};
  font-size: ${({ $density }) => DENSITY[$density].headerFontSize};
  font-weight: 600;
  color: ${gray[500]};
  background: ${({ $density }) => DENSITY[$density].headerBackground};
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 10;
`;

export const HeaderCell = styled.span<{ $align?: 'right' | 'center' }>`
  display: block;
  width: 100%;
  text-align: ${({ $align }) => $align ?? 'center'};
`;

// Only wraps cells whose column returned a bare string or number — an element
// is placed in the grid untouched, so a cell that needs its own styling keeps
// bringing its own.
export const BodyCell = styled.span<{ $align?: 'right' | 'center' }>`
  display: block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: ${({ $align }) => $align ?? 'center'};
`;

export const VirtualScrollSpacer = styled.div<{ $totalSize: number; $density: Density }>`
  position: relative;
  width: 100%;
  height: ${({ $totalSize }) => $totalSize}px;
  padding-inline: ${({ $density }) => DENSITY[$density].rowsInset};
`;

// Pinned with `inset-inline` rather than `width: 100%` so a row measures
// against the spacer's content box — a percentage width resolves against the
// padding box and would spill past `rowsInset`.
export const VirtualRow = styled.div<{ $start: number }>`
  position: absolute;
  top: 0;
  inset-inline: 0;
  transform: translateY(${({ $start }) => $start}px);
`;

export const TableItem = styled.div<{ $density: Density }>`
  border-bottom: ${({ $density }) => ($density === 'compact' ? `1px solid ${gray[100]}` : 'none')};
`;

export const TableRow = styled.div<{
  $columns: string;
  $density: Density;
  $selected?: boolean;
  $added?: boolean;
  $clickable?: boolean;
}>`
  display: grid;
  grid-template-columns: ${({ $columns }) => $columns};
  align-items: center;
  padding: ${({ $density }) => DENSITY[$density].rowPadding};
  column-gap: ${({ $density }) => DENSITY[$density].columnGap};
  border-radius: ${({ $density }) => DENSITY[$density].rowRadius};
  border-bottom: 1px solid ${({ $density }) => DENSITY[$density].rowDivider};
  border-right: 3px solid ${({ $selected }) => ($selected ? colors.primary : 'transparent')};
  cursor: ${({ $added, $clickable }) => ($added || !$clickable ? 'default' : 'pointer')};
  background: ${({ $selected }) => ($selected ? colors.primaryLight : 'transparent')};
  transition: background 0.1s;

  &:hover {
    background: ${({ $added, $selected, $clickable }) =>
      $added || !$clickable ? 'transparent' : $selected ? colors.primaryLight : gray[50]};
  }
`;
