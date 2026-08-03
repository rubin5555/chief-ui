import styled from 'styled-components';
import { DENSITY } from '@/components/ui/GridTable';
import { catColors, radii } from '@/styles/theme';

export const ChildBlock = styled.div`
  margin-bottom: 4px;
  overflow: hidden;
  border-radius: ${radii.xl};
  background: ${catColors.childRowBg};
  border-right: 3px solid ${catColors.childRowAccent};
`;

// Repeats the parent table's tracks and its comfortable-density metrics,
// because these rows have to line up under the columns above them — including
// the base font size, since these cells are rendered outside a `TableRow`.
export const ChildRow = styled.div<{ $columns: string; $last: boolean }>`
  display: grid;
  grid-template-columns: ${({ $columns }) => $columns};
  align-items: center;
  column-gap: ${DENSITY.comfortable.columnGap};
  font-size: ${DENSITY.comfortable.rowFontSize};
  padding: 10px 16px;
  border-bottom: ${({ $last }) => ($last ? 'none' : `1px solid ${catColors.childRowDivider}`)};
`;
