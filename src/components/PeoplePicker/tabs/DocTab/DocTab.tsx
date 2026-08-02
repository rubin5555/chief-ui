import { Filter } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { DOCS_FALLBACK, useDocs } from '@/api/docs';
import type { RowConfig } from '@/components/ui/GridTable';
import { GridTable } from '@/components/ui/GridTable';
import { InlineSpinner } from '@/components/ui/InlineSpinner';
import { SearchSlot } from '@/context/SearchSlotContext';
import { useSearch } from '@/hooks/useSearch';
import { ModalSearchInput } from '../../components/ModalSearchInput';
import type { DocItem, Member } from '../../PeoplePicker.constants';
import { deduplicateMembers } from '../../utils/deduplicateMembers';
import { TabImportBar } from '../components/TabImportBar';
import { useTabSelection } from '../hooks/useTabSelection';
import { EmptyState, SubTabBar, SubTabBtn, SubTabIndicator, TabRoot } from '../tabs.shared.styles';
import { DocFilterPanel } from './components/DocFilterPanel';
import { DocDistribution, docColumns } from './DocTab.columns';
import { FilterBtnInline } from './DocTab.styles';
import { DOC_TAB_IDS } from './DocTab.testids';
import { useDocFilters } from './hooks/useDocFilters';

const docKey = (doc: DocItem) => doc.id;

interface DocTabProps {
  addedDocIds: Set<string>;
  onImport: (members: Member[], docIds: string[]) => void;
}

export const DocTab = ({ addedDocIds, onImport }: DocTabProps) => {
  const [docTab, setDocTab] = useState<'distributed' | 'drafts'>('distributed');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterPos, setFilterPos] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const { selected, expanded, handleRowClick, handleCheckClick, handleToggleExpand } =
    useTabSelection();
  const { search, debouncedSearch, onSearchChange } = useSearch();
  const filters = useDocFilters();

  const { data, loading: docsLoading } = useDocs();
  const allDocs = data ?? DOCS_FALLBACK.docs;

  const filterBtnRef = useRef<HTMLButtonElement>(null);
  const filterPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (
        filterPanelRef.current &&
        !filterPanelRef.current.contains(e.target as Node) &&
        filterBtnRef.current &&
        !filterBtnRef.current.contains(e.target as Node)
      )
        setFilterOpen(false);
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

  const onDocTabChange = (tab: 'distributed' | 'drafts') => setDocTab(tab);

  const onToggleFilter = () => {
    if (!filterOpen && filterBtnRef.current) {
      const r = filterBtnRef.current.getBoundingClientRect();
      setFilterPos({ top: r.bottom + 6, left: r.left - 268 });
    }
    setFilterOpen((o) => !o);
  };

  const onImportSelected = () => {
    const docs = allDocs.filter((d) => selected.set.has(d.id));
    const members = deduplicateMembers(
      docs.flatMap((d) => d.distribution),
      'imp',
    );
    onImport(members, [...selected.set]);
    selected.reset();
  };

  const handleDocTabChange = (tab: 'distributed' | 'drafts') => () => onDocTabChange(tab);

  const docs = allDocs.filter(
    (d) => (!debouncedSearch || d.name.includes(debouncedSearch)) && filters.matches(d),
  );

  const columns = docColumns({
    selectedIds: selected.set,
    addedDocIds,
    expandedId: expanded,
    onCheckClick: handleCheckClick,
    onToggleExpand: handleToggleExpand,
  });

  const rowConfig = (doc: DocItem): RowConfig => ({
    isSelected: selected.set.has(doc.id),
    isAdded: addedDocIds.has(doc.id),
    onClick: handleRowClick(doc.id, addedDocIds.has(doc.id)),
    expansion: expanded === doc.id ? <DocDistribution doc={doc} /> : null,
  });

  return (
    <TabRoot>
      <SubTabBar>
        {(['distributed', 'drafts'] as const).map((tab) => (
          <SubTabBtn key={tab} $active={docTab === tab} onClick={handleDocTabChange(tab)}>
            {tab === 'drafts' ? 'טיוטות' : 'פקודות שהופצו'}
            {docTab === tab && <SubTabIndicator />}
          </SubTabBtn>
        ))}
      </SubTabBar>

      <SearchSlot>
        <ModalSearchInput
          value={search}
          onChange={onSearchChange}
          placeholder="חיפוש מסמך..."
          trailing={
            <FilterBtnInline
              ref={filterBtnRef}
              type="button"
              $active={filters.hasFilter}
              onClick={onToggleFilter}
            >
              <Filter size={14} />
            </FilterBtnInline>
          }
        />
      </SearchSlot>

      {docsLoading ? (
        <InlineSpinner />
      ) : (
        <GridTable
          columns={columns}
          items={docs}
          getRowKey={docKey}
          row={rowConfig}
          emptyState={<EmptyState>לא נמצאו מסמכים</EmptyState>}
        />
      )}

      <TabImportBar
        count={selected.set.size}
        noun="מסמכים"
        data-testid={DOC_TAB_IDS.importBtn}
        onImport={onImportSelected}
      />

      {filterOpen && filterPos && (
        <DocFilterPanel
          docs={allDocs}
          filters={filters}
          top={filterPos.top}
          left={filterPos.left}
          panelRef={filterPanelRef}
        />
      )}
    </TabRoot>
  );
};
