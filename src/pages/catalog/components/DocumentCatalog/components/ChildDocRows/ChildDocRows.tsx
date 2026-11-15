import type { CatalogDoc } from '@/api/catalog';
import type { ColumnDef } from '@/components/ui/GridTable';
import { gridTemplateOf, renderBodyCells } from '@/components/ui/GridTable';
import { DOCUMENT_CATALOG_IDS } from '../../DocumentCatalog.testids';
import { ChildBlock, ChildRow } from './ChildDocRows.styles';

interface ChildDocRowsProps {
  // The child variant of the parent's column array — same widths, lighter
  // cells — so the two grids stay in step by construction.
  columns: ColumnDef<CatalogDoc>[];
  docs: CatalogDoc[];
}

export const ChildDocRows = ({ columns, docs }: ChildDocRowsProps) => {
  const template = gridTemplateOf(columns);

  return (
    <ChildBlock>
      {docs.map((child, index) => (
        <ChildRow
          key={child.id}
          $columns={template}
          $last={index === docs.length - 1}
          data-testid={DOCUMENT_CATALOG_IDS.childRow(child.id)}
        >
          {renderBodyCells(columns, child, index)}
        </ChildRow>
      ))}
    </ChildBlock>
  );
};
