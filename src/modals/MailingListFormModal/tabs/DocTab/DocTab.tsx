import { Filter } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { DOCS_FALLBACK, useDocs } from '@/api/docs';
import { GridTable } from '@/components/ui/GridTable';
import { InlineSpinner } from '@/components/ui/InlineSpinner';
import { SearchSlot } from '@/context/SearchSlotContext';
import { useSearch } from '@/hooks/useSearch';
import { ModalSearchInput } from '../../components/ModalSearchInput';
import type { DocItem, Member } from '../../MailingListFormModal.constants';
import { DOC_GRID } from '../../MailingListFormModal.constants';
import { ColHeader } from '../../MailingListFormModal.shared.styles';
import { deduplicateMembers } from '../../utils/deduplicateMembers';
import { TabImportBar } from '../components/TabImportBar';
import { useTabSelection } from '../hooks/useTabSelection';
import { EmptyState, SubTabBar, SubTabBtn, SubTabIndicator, TabRoot } from '../tabs.shared.styles';
import { DocFilterPanel } from './components/DocFilterPanel';
import { DocRow } from './components/DocRow';
import { FilterBtnInline } from './DocTab.styles';
import { DOC_TAB_IDS } from './DocTab.testids';
import { useDocFilters } from './hooks/useDocFilters';

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
          columns={DOC_GRID}
          headers={[
            null,
            <ColHeader $align="right">שם המסמך</ColHeader>,
            <ColHeader>פקודה</ColHeader>,
            <ColHeader>עדכון</ColHeader>,
            <ColHeader>סוג</ColHeader>,
            <ColHeader>ארגון</ColHeader>,
            <ColHeader>תאריך</ColHeader>,
            <ColHeader>מ"פ</ColHeader>,
            null,
          ]}
          items={docs}
          getRowKey={(doc) => doc.id}
          emptyState={<EmptyState>לא נמצאו מסמכים</EmptyState>}
          renderRow={(doc: DocItem) => {
            const isSelected = selected.set.has(doc.id);
            const isAdded = addedDocIds.has(doc.id);
            const isExpanded = expanded === doc.id;

            return (
              <DocRow
                doc={doc}
                isSelected={isSelected}
                isAdded={isAdded}
                isExpanded={isExpanded}
                onRowClick={handleRowClick(doc.id, isAdded)}
                onCheckClick={handleCheckClick(doc.id, isAdded)}
                onToggleExpand={handleToggleExpand(doc.id)}
              />
            );
          }}
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
