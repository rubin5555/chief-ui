import styled from 'styled-components';
import { colors, docColors, gray } from '@/styles/theme';

export const TableScroller = styled.div`
  overflow-x: auto;
  padding: 0 8px 8px;
  direction: rtl;
`;

export const Grid = styled.table`
  min-width: 100%;
  border-collapse: collapse;
  font-size: 11px;
  direction: rtl;
`;

export const GridCell = styled.td<{ $active: boolean }>`
  padding: 0;
  min-width: 60px;
  border: 1px solid ${({ $active }) => ($active ? docColors.cellActiveBorder : gray[300])};
  background: ${({ $active }) => ($active ? docColors.cellActiveBg : colors.surface)};
`;
