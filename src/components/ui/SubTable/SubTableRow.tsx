import type { ReactNode } from 'react';
import { useSubTableColumns } from './SubTable.context';
import { SubTableRowRoot } from './SubTable.styles';

interface SubTableRowProps {
  children: ReactNode;
}

export const SubTableRow = ({ children }: SubTableRowProps) => {
  const columns = useSubTableColumns();
  return <SubTableRowRoot $columns={columns}>{children}</SubTableRowRoot>;
};
