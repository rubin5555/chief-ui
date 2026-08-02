import styled from 'styled-components';
import { colors, gray } from '@/styles/theme';

export const TableScrollBody = styled.div`
  flex: 1;
  overflow-y: auto;
`;

export const TableHeader = styled.div<{ $columns: string }>`
  display: grid;
  grid-template-columns: ${({ $columns }) => $columns};
  column-gap: 6px;
  padding: 8px 12px;
  font-size: 10px;
  font-weight: 600;
  color: ${gray[500]};
  background: ${gray[200]};
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

export const VirtualScrollSpacer = styled.div<{ $totalSize: number }>`
  position: relative;
  width: 100%;
  height: ${({ $totalSize }) => $totalSize}px;
`;

export const VirtualRow = styled.div<{ $start: number }>`
  position: absolute;
  top: 0;
  inset-inline-start: 0;
  width: 100%;
  transform: translateY(${({ $start }) => $start}px);
`;

export const TableItem = styled.div`
  border-bottom: 1px solid ${gray[100]};
`;

export const TableRow = styled.div<{
  $columns: string;
  $selected?: boolean;
  $added?: boolean;
  $clickable?: boolean;
}>`
  display: grid;
  grid-template-columns: ${({ $columns }) => $columns};
  align-items: center;
  padding: 10px 12px;
  column-gap: 6px;
  border-bottom: 1px solid ${gray[100]};
  border-right: 3px solid ${({ $selected }) => ($selected ? colors.primary : 'transparent')};
  cursor: ${({ $added, $clickable }) => ($added || !$clickable ? 'default' : 'pointer')};
  background: ${({ $selected }) => ($selected ? colors.primaryLight : 'transparent')};
  transition: background 0.1s;

  &:hover {
    background: ${({ $added, $selected, $clickable }) =>
      $added || !$clickable ? 'transparent' : $selected ? colors.primaryLight : gray[50]};
  }
`;
