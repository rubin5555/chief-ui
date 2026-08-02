import { Search, Trash2 } from 'lucide-react';
import type { ChangeEvent, MouseEvent } from 'react';
import { useState } from 'react';
import type { CatalogDoc, CatalogTab } from '@/api/catalog';
import { CATALOG_DOCS_FALLBACK, useCatalogDocs } from '@/api/catalog';
import type { RowConfig } from '@/components/ui/GridTable';
import { GridTable } from '@/components/ui/GridTable';
import { InlineSpinner } from '@/components/ui/InlineSpinner';
import { useDebounce } from '@/hooks/useDebounce';
import { ActiveCatalogFilters } from './components/ActiveCatalogFilters';
import type { CatalogFilterValues } from './components/CatalogFilterFunnel';
import { CatalogFilterFunnel } from './components/CatalogFilterFunnel';
import { CatalogPager } from './components/CatalogPager';
import { CatalogTabs } from './components/CatalogTabs';
import { ChildDocRows } from './components/ChildDocRows';
import { DistributionSubTabs } from './components/DistributionSubTabs';
import type { RowMenuAnchor } from './components/RowActionMenu';
import {
  INLINE_PHASE_ACTIONS,
  ROW_ACTIONS,
  RowActionMenu,
  rowMenuAnchor,
  useRowActionPhase,
} from './components/RowActionMenu';
import { useDocumentCatalogAnalytics } from './DocumentCatalog.analytics';
import { catalogColumns } from './DocumentCatalog.columns';
import {
  HISTORY_TITLE,
  NO_DOCS_TEXT,
  PAGE_SIZE,
  RECEIPTS_ACTION,
  RESHARE_ACTION,
  SEARCH_PLACEHOLDER,
  TRASH_TITLE,
} from './DocumentCatalog.constants';
import {
  CatalogBody,
  NoDocs,
  PillDivider,
  RoundIconButton,
  SearchFieldWrap,
  SearchIcon,
  SearchInput,
  SearchPill,
  TableCard,
  ToolbarRow,
} from './DocumentCatalog.styles';
import { DOCUMENT_CATALOG_IDS } from './DocumentCatalog.testids';
import type { CatalogFilters } from './documentCatalog.filters';
import { filterCatalogDocs, uniqueValues } from './documentCatalog.filters';

const docKey = (doc: CatalogDoc) => doc.id;

export interface DocumentCatalogProps {
  tab: CatalogTab;
  filters: CatalogFilters;
  page: number;
  onTabChange: (tab: CatalogTab) => void;
  onDistSubChange: (label: string) => void;
  onSearchChange: (value: string) => void;
  onFiltersChange: (patch: Partial<CatalogFilterValues>) => void;
  onClearFilters: () => void;
  onPageChange: (page: number) => void;
  onOpenDoc: (doc: CatalogDoc) => void;
  onOpenTrash: () => void;
  // What a row action ultimately opens is a modal, and those land with the
  // modals themselves. Until then the label travels out so the wiring is
  // visible rather than silently dropped.
  onRowAction: (doc: CatalogDoc, label: string) => void;
}

export const DocumentCatalog = ({
  tab,
  filters,
  page,
  onTabChange,
  onDistSubChange,
  onSearchChange,
  onFiltersChange,
  onClearFilters,
  onPageChange,
  onOpenDoc,
  onOpenTrash,
  onRowAction,
}: DocumentCatalogProps) => {
  // Which parent rows are showing their children. Purely visual and per-visit,
  // so unlike the filters it stays out of the URL.
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  // The open row menu, and the document it belongs to. The trigger lives in
  // this component's columns, so the menu's state and its render do too.
  const [menuRow, setMenuRow] = useState<{ doc: CatalogDoc; anchor: RowMenuAnchor } | null>(null);
  const { phase, start: startPhase, reset: resetPhase } = useRowActionPhase(() => setMenuRow(null));

  const { data, loading } = useCatalogDocs(tab);
  const docs = data ?? CATALOG_DOCS_FALLBACK[tab];

  const {
    trackTabChanged,
    trackDistSubTabChanged,
    trackSearch,
    trackPageChanged,
    trackDocOpened,
    trackChildrenToggled,
    trackReceiptsOpened,
    trackReshare,
    trackTrashOpened,
  } = useDocumentCatalogAnalytics();

  // The URL takes every keystroke; the filtering runs off the settled value.
  const debouncedSearch = useDebounce(filters.search);
  const filtered = filterCatalogDocs(docs, { ...filters, search: debouncedSearch });

  // Status and organisation offer only what this shelf actually holds, so a
  // filter can never select something that would match nothing.
  const statusOptions = uniqueValues(docs, (doc) => doc.status);
  const orgOptions = uniqueValues(docs, (doc) => doc.env);

  const filterValues: CatalogFilterValues = {
    templates: filters.templates,
    statuses: filters.statuses,
    depts: filters.depts,
    orgs: filters.orgs,
    from: filters.from,
    to: filters.to,
  };

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  // A filter change can strand the reader past the last page; clamping on the
  // way out beats an effect that resets the page after the fact.
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleTabChange = (next: CatalogTab) => {
    onTabChange(next);
    trackTabChanged(next);
  };

  const handleDistSubChange = (label: string) => {
    onDistSubChange(label);
    trackDistSubTabChanged(label);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
    trackSearch(event.target.value);
  };

  const handlePageChange = (next: number) => {
    onPageChange(next);
    trackPageChanged(next);
  };

  const handleTrashClick = () => {
    onOpenTrash();
    trackTrashOpened();
  };

  const handleToggleExpand = (id: string) => (event: MouseEvent) => {
    event.stopPropagation();
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    trackChildrenToggled(id);
  };

  const closeMenu = () => {
    setMenuRow(null);
    resetPhase();
  };

  const handleHistoryClick = (doc: CatalogDoc) => (event: MouseEvent) => {
    event.stopPropagation();
    onRowAction(doc, HISTORY_TITLE);
  };

  const handleMenuClick = (doc: CatalogDoc) => (event: MouseEvent) => {
    event.stopPropagation();
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    setMenuRow({ doc, anchor: rowMenuAnchor(rect) });
  };

  const handleReceiptClick = (doc: CatalogDoc) => (event: MouseEvent) => {
    event.stopPropagation();
    onRowAction(doc, RECEIPTS_ACTION);
    trackReceiptsOpened(doc.name);
  };

  const handleReshareClick = (doc: CatalogDoc) => (event: MouseEvent) => {
    event.stopPropagation();
    onRowAction(doc, RESHARE_ACTION);
    trackReshare(doc.name);
  };

  // An inline action reports progress in place and closes the menu when it is
  // done; everything else is handed straight up.
  const handleMenuAction = (label: string) => {
    if (!menuRow) return;
    if (INLINE_PHASE_ACTIONS.has(label)) {
      startPhase(label);
      return;
    }
    onRowAction(menuRow.doc, label);
  };

  const handleRowClick = (doc: CatalogDoc) => () => {
    onOpenDoc(doc);
    trackDocOpened(doc.name);
  };

  const columnDeps = {
    tab,
    isAllDocs: filters.isAllDocs,
    expandedIds,
    onToggleExpand: handleToggleExpand,
    onHistoryClick: handleHistoryClick,
    onMenuClick: handleMenuClick,
    onReceiptClick: handleReceiptClick,
    onReshareClick: handleReshareClick,
  };

  const columns = catalogColumns({ ...columnDeps, variant: 'parent' });
  const childColumns = catalogColumns({ ...columnDeps, variant: 'child' });

  const rowConfig = (doc: CatalogDoc): RowConfig => ({
    onClick: handleRowClick(doc),
    expansion:
      expandedIds.has(doc.id) && doc.children?.length ? (
        <ChildDocRows columns={childColumns} docs={doc.children} />
      ) : null,
  });

  return (
    <CatalogBody data-testid={DOCUMENT_CATALOG_IDS.root}>
      <CatalogTabs activeTab={tab} onTabChange={handleTabChange} />

      <ToolbarRow>
        <SearchPill>
          <SearchFieldWrap>
            <SearchIcon>
              <Search size={16} />
            </SearchIcon>
            <SearchInput
              value={filters.search}
              placeholder={SEARCH_PLACEHOLDER}
              data-testid={DOCUMENT_CATALOG_IDS.search}
              onChange={handleSearchChange}
            />
          </SearchFieldWrap>
          <PillDivider />
          <CatalogFilterFunnel
            values={filterValues}
            statusOptions={statusOptions}
            orgOptions={orgOptions}
            isAllDocs={filters.isAllDocs}
            onChange={onFiltersChange}
            onClearAll={onClearFilters}
          />
        </SearchPill>

        {tab === 'drafts' && (
          <RoundIconButton
            type="button"
            title={TRASH_TITLE}
            data-testid={DOCUMENT_CATALOG_IDS.trashBtn}
            onClick={handleTrashClick}
          >
            <Trash2 size={16} />
          </RoundIconButton>
        )}
      </ToolbarRow>

      <ActiveCatalogFilters
        values={filterValues}
        isAllDocs={filters.isAllDocs}
        onChange={onFiltersChange}
      />

      {filters.isDistribution && (
        <DistributionSubTabs active={filters.distSub} onChange={handleDistSubChange} />
      )}

      <TableCard data-testid={DOCUMENT_CATALOG_IDS.table}>
        {loading ? (
          <InlineSpinner />
        ) : (
          <GridTable
            columns={columns}
            items={pageRows}
            getRowKey={docKey}
            row={rowConfig}
            density="comfortable"
            emptyState={<NoDocs data-testid={DOCUMENT_CATALOG_IDS.noDocs}>{NO_DOCS_TEXT}</NoDocs>}
          />
        )}
      </TableCard>

      <CatalogPager page={safePage} totalPages={totalPages} onPageChange={handlePageChange} />

      {menuRow && (
        <RowActionMenu
          actions={ROW_ACTIONS[tab]}
          anchor={menuRow.anchor}
          phase={phase}
          onAction={handleMenuAction}
          onClose={closeMenu}
        />
      )}
    </CatalogBody>
  );
};
