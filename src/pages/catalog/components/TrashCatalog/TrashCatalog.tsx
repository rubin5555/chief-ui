import { ChevronRight, Search, Trash2 } from 'lucide-react';
import type { ChangeEvent, MouseEvent } from 'react';
import { useState } from 'react';
import type { TrashDoc } from '@/api/catalog';
import { TRASH_DOCS_FALLBACK, useTrashDocs } from '@/api/catalog';
import { GridTable } from '@/components/ui/GridTable';
import { InlineSpinner } from '@/components/ui/InlineSpinner';
import { useDebounce } from '@/hooks/useDebounce';
import type { RowMenuAnchor } from '../DocumentCatalog/components/RowActionMenu';
import {
  RowActionMenu,
  rowMenuAnchor,
  TRASH_ROW_ACTIONS,
} from '../DocumentCatalog/components/RowActionMenu';
import { NO_DOCS_TEXT, SEARCH_PLACEHOLDER } from '../DocumentCatalog/DocumentCatalog.constants';
import {
  CatalogBody,
  NoDocs,
  SearchFieldWrap,
  SearchIcon,
  SearchInput,
  SearchPill,
  TableCard,
  ToolbarRow,
} from '../DocumentCatalog/DocumentCatalog.styles';
import { trashColumns } from './TrashCatalog.columns';
import { BACK_LABEL, TRASH_CATALOG_IDS, TRASH_HEADING, TRASH_NOTE } from './TrashCatalog.constants';
import {
  BackButton,
  HeaderDivider,
  TrashHeader,
  TrashIcon,
  TrashNote,
  TrashTitle,
} from './TrashCatalog.styles';

const docKey = (doc: TrashDoc) => doc.id;

interface TrashCatalogProps {
  onBack: () => void;
}

// The recycle bin is its own view rather than a fifth shelf: no tabs, no
// filters, no pager, and a row menu with two entries. Its search stays local —
// unlike the catalog's, there is no state around it worth sharing in a link.
export const TrashCatalog = ({ onBack }: TrashCatalogProps) => {
  const [search, setSearch] = useState('');
  const [menuRow, setMenuRow] = useState<{ doc: TrashDoc; anchor: RowMenuAnchor } | null>(null);

  const { data, loading } = useTrashDocs();
  const docs = data ?? TRASH_DOCS_FALLBACK;

  const debouncedSearch = useDebounce(search);
  const query = debouncedSearch.trim();
  const filtered = docs.filter(
    (doc) => !query || doc.name.includes(query) || doc.orderNum.includes(query),
  );

  const onSearchChange = (event: ChangeEvent<HTMLInputElement>) => setSearch(event.target.value);

  const handleMenuClick = (doc: TrashDoc) => (event: MouseEvent) => {
    event.stopPropagation();
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    setMenuRow({ doc, anchor: rowMenuAnchor(rect) });
  };

  const closeMenu = () => setMenuRow(null);

  // Restore and purge close the menu and do nothing else, exactly as on main —
  // there is no mutation behind either yet.
  const handleMenuAction = () => closeMenu();

  return (
    <CatalogBody data-testid={TRASH_CATALOG_IDS.root}>
      <TrashHeader>
        <BackButton type="button" data-testid={TRASH_CATALOG_IDS.back} onClick={onBack}>
          <ChevronRight size={16} />
          <span>{BACK_LABEL}</span>
        </BackButton>
        <HeaderDivider />
        <TrashIcon>
          <Trash2 size={16} />
        </TrashIcon>
        <TrashTitle>{TRASH_HEADING}</TrashTitle>
        <TrashNote>{TRASH_NOTE}</TrashNote>
      </TrashHeader>

      <ToolbarRow>
        <SearchPill>
          <SearchFieldWrap>
            <SearchIcon>
              <Search size={16} />
            </SearchIcon>
            <SearchInput
              value={search}
              placeholder={SEARCH_PLACEHOLDER}
              data-testid={TRASH_CATALOG_IDS.search}
              onChange={onSearchChange}
            />
          </SearchFieldWrap>
        </SearchPill>
      </ToolbarRow>

      <TableCard data-testid={TRASH_CATALOG_IDS.table}>
        {loading ? (
          <InlineSpinner />
        ) : (
          <GridTable
            columns={trashColumns({ onMenuClick: handleMenuClick })}
            items={filtered}
            getRowKey={docKey}
            density="comfortable"
            emptyState={<NoDocs data-testid={TRASH_CATALOG_IDS.noDocs}>{NO_DOCS_TEXT}</NoDocs>}
          />
        )}
      </TableCard>

      {menuRow && (
        <RowActionMenu
          actions={TRASH_ROW_ACTIONS}
          anchor={menuRow.anchor}
          phase={null}
          onAction={handleMenuAction}
          onClose={closeMenu}
        />
      )}
    </CatalogBody>
  );
};
