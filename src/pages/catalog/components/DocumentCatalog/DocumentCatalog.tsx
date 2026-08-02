import { Search, Trash2 } from 'lucide-react';
import type { ChangeEvent, MouseEvent } from 'react';
import { useState } from 'react';
import type { CatalogDoc, CatalogTab } from '@/api/catalog';
import { CATALOG_DOCS_FALLBACK, useCatalogDocs } from '@/api/catalog';
import type { RowConfig } from '@/components/ui/GridTable';
import { GridTable } from '@/components/ui/GridTable';
import { InlineSpinner } from '@/components/ui/InlineSpinner';
import { useDebounce } from '@/hooks/useDebounce';
import { CatalogPager } from './components/CatalogPager';
import { CatalogTabs } from './components/CatalogTabs';
import { ChildDocRows } from './components/ChildDocRows';
import { DistributionSubTabs } from './components/DistributionSubTabs';
import { useDocumentCatalogAnalytics } from './DocumentCatalog.analytics';
import { catalogColumns } from './DocumentCatalog.columns';
import {
  NO_DOCS_TEXT,
  PAGE_SIZE,
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
import { filterCatalogDocs } from './documentCatalog.filters';

const docKey = (doc: CatalogDoc) => doc.id;

export interface DocumentCatalogProps {
  tab: CatalogTab;
  filters: CatalogFilters;
  page: number;
  onTabChange: (tab: CatalogTab) => void;
  onDistSubChange: (label: string) => void;
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onOpenDoc: (doc: CatalogDoc) => void;
  onOpenTrash: () => void;
  onOpenHistory: (doc: CatalogDoc) => void;
  onOpenRowMenu: (doc: CatalogDoc, event: MouseEvent) => void;
  onOpenReceipts: (doc: CatalogDoc) => void;
  onReshare: (doc: CatalogDoc) => void;
}

export const DocumentCatalog = ({
  tab,
  filters,
  page,
  onTabChange,
  onDistSubChange,
  onSearchChange,
  onPageChange,
  onOpenDoc,
  onOpenTrash,
  onOpenHistory,
  onOpenRowMenu,
  onOpenReceipts,
  onReshare,
}: DocumentCatalogProps) => {
  // Which parent rows are showing their children. Purely visual and per-visit,
  // so unlike the filters it stays out of the URL.
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

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

  const handleHistoryClick = (doc: CatalogDoc) => (event: MouseEvent) => {
    event.stopPropagation();
    onOpenHistory(doc);
  };

  const handleMenuClick = (doc: CatalogDoc) => (event: MouseEvent) => {
    event.stopPropagation();
    onOpenRowMenu(doc, event);
  };

  const handleReceiptClick = (doc: CatalogDoc) => (event: MouseEvent) => {
    event.stopPropagation();
    onOpenReceipts(doc);
    trackReceiptsOpened(doc.name);
  };

  const handleReshareClick = (doc: CatalogDoc) => (event: MouseEvent) => {
    event.stopPropagation();
    onReshare(doc);
    trackReshare(doc.name);
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
    </CatalogBody>
  );
};
