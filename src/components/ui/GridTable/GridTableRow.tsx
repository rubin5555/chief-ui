import type { ReactNode } from 'react';
import { useGridTableColumns } from './GridTable.context';
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
  const columns = useGridTableColumns();
  return (
    <TableItem>
      <TableRow
        $columns={columns}
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
