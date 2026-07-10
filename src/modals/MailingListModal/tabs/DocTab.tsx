import { Filter } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { GridTable, GridTableRow } from '@/components/ui/GridTable';
import { SubTable, SubTableRow } from '@/components/ui/SubTable';
import { SearchSlot } from '@/context/SearchSlotContext';
import { useSearch } from '@/hooks/useSearch';
import { gray } from '@/styles/theme';
import { ColHeader } from '../components/MembersPanel/MembersPanel.styles';
import { ModalSearchInput } from '../components/ModalSearchInput';
import { SelectionCheckbox } from '../components/SelectionCheckbox';
import type { DocItem, Member, PersonMember } from '../MailingListModal.constants';
import { DOC_GRID, LIST_DOCS } from '../MailingListModal.constants';
import { deduplicateMembers } from '../utils/deduplicateMembers';
import { DocFilterPanel } from './DocFilterPanel';
import { ColCenter, FilterBtnInline, SubCell, SubNameCell } from './DocTab.styles';
import { DOC_TAB_IDS } from './DocTab.testids';
import { TabImportBar } from './TabImportBar';
import {
  CheckboxCell,
  CountLabel,
  EmptyState,
  ExpandBtn,
  ExpandChevron,
  NameCell,
  SubTabBar,
  SubTabBtn,
  SubTabIndicator,
  TabRoot,
} from './tabs.shared.styles';
import { useDocFilters } from './useDocFilters';
import { useTabSelection } from './useTabSelection';

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
    const docs = LIST_DOCS.filter((d) => selected.set.has(d.id));
    const members = deduplicateMembers(
      docs.flatMap((d) => d.distribution),
      'imp',
    );
    onImport(members, [...selected.set]);
    selected.reset();
  };

  const handleDocTabChange = (tab: 'distributed' | 'drafts') => () => onDocTabChange(tab);

  const docs = LIST_DOCS.filter(
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
            <GridTableRow
              isSelected={isSelected}
              isAdded={isAdded}
              onClick={handleRowClick(doc.id, isAdded)}
              expansion={
                isExpanded ? (
                  <SubTable
                    columns={DOC_GRID}
                    headers={[
                      null,
                      <ColHeader $align="right">שם מלא</ColHeader>,
                      <ColHeader>תעודת זהות</ColHeader>,
                      null,
                      <ColHeader>ארגון</ColHeader>,
                    ]}
                    items={doc.distribution}
                    getRowKey={(p: PersonMember, i: number) => p.idNumber || i}
                    renderRow={(p: PersonMember) => (
                      <SubTableRow>
                        <span />
                        <SubNameCell>{p.name}</SubNameCell>
                        <SubCell $tabular>{p.idNumber}</SubCell>
                        <span />
                        <SubCell>{p.environment}</SubCell>
                      </SubTableRow>
                    )}
                  />
                ) : null
              }
            >
              <CheckboxCell
                data-testid={DOC_TAB_IDS.rowCheckbox(doc.id)}
                onClick={handleCheckClick(doc.id, isAdded)}
              >
                <SelectionCheckbox isSelected={isSelected} isAdded={isAdded} />
              </CheckboxCell>
              <NameCell>
                {doc.name}
                <CountLabel>({doc.distribution.length})</CountLabel>
              </NameCell>
              <ColCenter>{doc.cmdNum}</ColCenter>
              <ColCenter>{doc.update}</ColCenter>
              <ColCenter>{doc.docType}</ColCenter>
              <ColCenter>{doc.environment}</ColCenter>
              <ColCenter $color={gray[500]}>{doc.lastUpdate}</ColCenter>
              <ColCenter $color={gray[400]}>{doc.refNum}</ColCenter>
              <ExpandBtn
                type="button"
                data-testid={DOC_TAB_IDS.rowExpand(doc.id)}
                onClick={handleToggleExpand(doc.id)}
              >
                <ExpandChevron size={14} color={gray[400]} $isExpanded={isExpanded} />
              </ExpandBtn>
            </GridTableRow>
          );
        }}
      />

      <TabImportBar
        count={selected.set.size}
        noun="מסמכים"
        data-testid={DOC_TAB_IDS.importBtn}
        onImport={onImportSelected}
      />

      {filterOpen && filterPos && (
        <DocFilterPanel
          filters={filters}
          top={filterPos.top}
          left={filterPos.left}
          panelRef={filterPanelRef}
        />
      )}
    </TabRoot>
  );
};
