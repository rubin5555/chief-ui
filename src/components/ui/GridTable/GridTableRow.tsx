import type { ReactNode } from 'react';
import { useGridTableLayout } from './GridTable.context';
import { TableItem, TableRow } from './GridTable.styles';

interface GridTableRowProps {
  isSelected?: boolean;
  isAdded?: boolean;
  onClick?: () => void;
  expansion?: ReactNode;
  children: ReactNode;
}

export const GridTableRow = ({
  isSelected,
  isAdded,
  onClick,
  expansion,
  children,
}: GridTableRowProps) => {
  const { template, density } = useGridTableLayout();
  return (
    <TableItem $density={density}>
      <TableRow
        $columns={template}
        $density={density}
        $selected={isSelected}
        $added={isAdded}
        $clickable={!!onClick}
        onClick={onClick}
      >
        {children}
      </TableRow>
      {expansion}
    </TableItem>
  );
};
