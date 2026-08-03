import { Search, Trash2 } from 'lucide-react';
import type { ChangeEvent, MouseEvent } from 'react';
import { useState } from 'react';
import type { CatalogDoc, CatalogTab } from '@/api/catalog';
import { CATALOG_DOCS_FALLBACK, useCatalogDocs } from '@/api/catalog';
import type { RowConfig } from '@/components/ui/GridTable';
import { GridTable } from '@/components/ui/GridTable';
import { InlineSpinner } from '@/components/ui/InlineSpinner';
import { useDebounce } from '@/hooks/useDebounce';
import { ApprovalDetailsModal } from '@/modals/ApprovalDetailsModal';
import { DistributeDoc } from '@/modals/DistributeDoc';
import { useDocPermissions } from '@/modals/DocPermissionsModal';
import { EditDocDetailsModal } from '@/modals/EditDocDetailsModal';
import { ActiveCatalogFilters } from './components/ActiveCatalogFilters';
import { CancelProgressToast } from './components/CancelProgressToast';
import { CatalogCancelModal } from './components/CatalogCancelModal';
import { CatalogDeleteModal } from './components/CatalogDeleteModal';
import type { CatalogFilterValues } from './components/CatalogFilterFunnel';
import { CatalogFilterFunnel } from './components/CatalogFilterFunnel';
import { CatalogPager } from './components/CatalogPager';
import { CatalogTabs } from './components/CatalogTabs';
import { ChildDocRows } from './components/ChildDocRows';
import { DistributionSubTabs } from './components/DistributionSubTabs';
import { DocCreatedToast } from './components/DocCreatedToast';
import { DocHierarchyModal } from './components/DocHierarchyModal';
import { DuplicateSearchModal } from './components/DuplicateSearchModal';
import { NewDocDropdown } from './components/NewDocDropdown';
import { ReceiptConfirmModal } from './components/ReceiptConfirmModal';
import {
  INLINE_PHASE_ACTIONS,
  ROW_ACTIONS,
  RowActionMenu,
  useRowActionPhase,
} from './components/RowActionMenu';
import { VersionHistoryModal } from './components/VersionHistoryModal';
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
import type { CatalogModalState } from './documentCatalog.rowActions';
import {
  catalogDocToHeader,
  duplicateHeader,
  emptyDocHeader,
  modalForAction,
} from './documentCatalog.rowActions';

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
}: DocumentCatalogProps) => {
  // Which parent rows are showing their children. Purely visual and per-visit,
  // so unlike the filters it stays out of the URL.
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  // The open row menu, and the document it belongs to. The trigger lives in
  // this component's columns, so the menu's state and its render do too.
  const [menuRow, setMenuRow] = useState<{ doc: CatalogDoc; triggerRect: DOMRect } | null>(null);
  const { phase, start: startPhase, reset: resetPhase } = useRowActionPhase(() => setMenuRow(null));
  // Every row action resolves to at most one dialog, so one slot holds it. The
  // cancel flow's progress toast outlives its dialog, hence its own flag.
  const [modal, setModal] = useState<CatalogModalState | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  // Creating a document is its own small flow: optionally pick something to
  // copy, fill the form, then confirm. Separate flags because each state is
  // reachable on its own — the picker can be cancelled, and the confirmation
  // outlives the form that produced it.
  const [isPickingSource, setIsPickingSource] = useState(false);
  const [newDocSource, setNewDocSource] = useState<CatalogDoc | null>(null);
  const [isCreatingDoc, setIsCreatingDoc] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  // The permissions dialog is opened through the provider the page wraps this
  // component in, the same way the document page opens it — that is where its
  // lazy chunk and its own state already live.
  const { openDocPermissions } = useDocPermissions();

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
    trackNewDocOpened,
    trackDocCreated,
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

  const openFor = (doc: CatalogDoc, label: string) => {
    const next = modalForAction(label, doc);
    if (next?.kind === 'permissions') {
      openDocPermissions();
      return;
    }
    setModal(next);
  };

  const closeModal = () => setModal(null);

  // Sending the cancellation notice closes the dialog and leaves the progress
  // toast behind, which is the only piece that outlives its own modal.
  const handleSendCancel = () => {
    setModal(null);
    setIsCancelling(true);
  };

  const onCancelToastClose = () => setIsCancelling(false);

  const onNewDocClick = () => {
    setNewDocSource(null);
    setIsCreatingDoc(true);
    trackNewDocOpened('חדש');
  };

  const onDuplicateDocClick = () => setIsPickingSource(true);
  const onPickSourceClose = () => setIsPickingSource(false);

  // Picking a source closes the picker and opens the form seeded from it.
  const onPickSource = (doc: CatalogDoc) => {
    setIsPickingSource(false);
    setNewDocSource(doc);
    setIsCreatingDoc(true);
    trackNewDocOpened('שכפול');
  };

  const onNewDocClose = () => setIsCreatingDoc(false);

  const onNewDocCreated = () => {
    setIsCreatingDoc(false);
    setIsCreated(true);
    trackDocCreated(newDocSource ? 'שכפול' : 'חדש');
  };

  const onCreatedToastClose = () => setIsCreated(false);

  const handleHistoryClick = (doc: CatalogDoc) => (event: MouseEvent) => {
    event.stopPropagation();
    openFor(doc, HISTORY_TITLE);
  };

  const handleMenuClick = (doc: CatalogDoc) => (event: MouseEvent) => {
    event.stopPropagation();
    setMenuRow({ doc, triggerRect: (event.currentTarget as HTMLElement).getBoundingClientRect() });
  };

  const handleReceiptClick = (doc: CatalogDoc) => (event: MouseEvent) => {
    event.stopPropagation();
    openFor(doc, RECEIPTS_ACTION);
    trackReceiptsOpened(doc.name);
  };

  const handleReshareClick = (doc: CatalogDoc) => (event: MouseEvent) => {
    event.stopPropagation();
    openFor(doc, RESHARE_ACTION);
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
    openFor(menuRow.doc, label);
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
          <>
            <RoundIconButton
              type="button"
              title={TRASH_TITLE}
              data-testid={DOCUMENT_CATALOG_IDS.trashBtn}
              onClick={handleTrashClick}
            >
              <Trash2 size={16} />
            </RoundIconButton>
            <NewDocDropdown onNew={onNewDocClick} onDuplicate={onDuplicateDocClick} />
          </>
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
          triggerRect={menuRow.triggerRect}
          phase={phase}
          onAction={handleMenuAction}
          onClose={closeMenu}
        />
      )}

      {modal?.kind === 'details' && modal.detailsMode && (
        <EditDocDetailsModal
          mode={modal.detailsMode}
          header={catalogDocToHeader(modal.doc)}
          docStatus={modal.doc.status}
          onClose={closeModal}
          onSave={closeModal}
        />
      )}

      {modal?.kind === 'approvalRound' && (
        <ApprovalDetailsModal onClose={closeModal} onSubmit={closeModal} />
      )}

      {modal?.kind === 'delete' && <CatalogDeleteModal doc={modal.doc} onClose={closeModal} />}

      {modal?.kind === 'cancel' && (
        <CatalogCancelModal
          key={modal.doc.id}
          doc={modal.doc}
          onClose={closeModal}
          onSendCancel={handleSendCancel}
        />
      )}

      {isCancelling && <CancelProgressToast onClose={onCancelToastClose} />}

      {modal?.kind === 'history' && <VersionHistoryModal doc={modal.doc} onClose={closeModal} />}

      {modal?.kind === 'receipts' && <ReceiptConfirmModal doc={modal.doc} onClose={closeModal} />}

      {modal?.kind === 'hierarchy' && <DocHierarchyModal doc={modal.doc} onClose={closeModal} />}

      {modal?.kind === 'reshare' && (
        <DistributeDoc docName={modal.doc.name} onClose={closeModal} onSend={closeModal} />
      )}

      {isPickingSource && (
        <DuplicateSearchModal onSelect={onPickSource} onClose={onPickSourceClose} />
      )}

      {isCreatingDoc && (
        <EditDocDetailsModal
          key={newDocSource?.id ?? 'blank'}
          mode="new"
          header={newDocSource ? duplicateHeader(newDocSource) : emptyDocHeader()}
          docStatus=""
          onClose={onNewDocClose}
          onSave={onNewDocCreated}
        />
      )}

      {isCreated && <DocCreatedToast onClose={onCreatedToastClose} />}
    </CatalogBody>
  );
};
