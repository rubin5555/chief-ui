import { Check, Filter } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { GridTable, GridTableRow } from '@/components/ui/GridTable';
import { SubTable, SubTableRow } from '@/components/ui/SubTable';
import { SearchSlot } from '@/context/SearchSlotContext';
import { useFilterList } from '@/hooks/useFilterList';
import { useSearch } from '@/hooks/useSearch';
import { useTabSelection } from '@/hooks/useTabSelection';
import { colors, gray } from '@/styles/theme';
import { ColHeader } from '../components/MembersPanel/MembersPanel.styles';
import { ModalSearchInput } from '../components/ModalSearchInput';
import { SelectionCheckbox } from '../components/SelectionCheckbox';
import { CheckBox } from '../components/SelectionCheckbox/SelectionCheckbox.styles';
import type { DocItem, Member, PersonMember } from '../MailingListModal.constants';
import { DOC_GRID, LIST_DOCS } from '../MailingListModal.constants';
import { deduplicateMembers } from '../utils/deduplicateMembers';
import {
  ClearFiltersBtn,
  ColCenter,
  DateFilterSection,
  DateInput,
  DateLabel,
  DateRow,
  FilterBtnInline,
  FilterDivider,
  FilterDropdown,
  FilterOption,
  FilterSectionTitle,
  SubCell,
  SubNameCell,
} from './DocTab.styles';
import { DOC_TAB_IDS } from './DocTab.testids';
import {
  CheckboxCell,
  CountLabel,
  EmptyState,
  ExpandBtn,
  ExpandChevron,
  ImportBar,
  ImportBarLabel,
  NameCell,
  SubTabBar,
  SubTabBtn,
  SubTabIndicator,
  TabRoot,
} from './tabs.shared.styles';

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
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const { selected, expanded, handleRowClick, handleCheckClick, handleToggleExpand } =
    useTabSelection();
  const { search, debouncedSearch, onSearchChange } = useSearch();
  const typeFilter = useFilterList<string>();
  const statusFilter = useFilterList<string>();
  const orgFilter = useFilterList<string>();

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

  const onDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => setDateFrom(e.target.value);
  const onDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => setDateTo(e.target.value);

  const onClearFilters = () => {
    typeFilter.clear();
    statusFilter.clear();
    orgFilter.clear();
    setDateFrom('');
    setDateTo('');
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
  const handleToggleType = (v: string) => () => typeFilter.toggle(v);
  const handleToggleStatus = (v: string) => () => statusFilter.toggle(v);
  const handleToggleOrg = (v: string) => () => orgFilter.toggle(v);

  const hasFilter =
    typeFilter.active.length > 0 ||
    statusFilter.active.length > 0 ||
    orgFilter.active.length > 0 ||
    !!dateFrom ||
    !!dateTo;

  const docTypes = [...new Set(LIST_DOCS.map((d) => d.docType))];
  const statuses = [...new Set(LIST_DOCS.map((d) => d.status))];
  const orgs = [...new Set(LIST_DOCS.map((d) => d.environment))];

  const docs = LIST_DOCS.filter((d) => {
    if (debouncedSearch && !d.name.includes(debouncedSearch)) return false;
    if (typeFilter.active.length && !typeFilter.has(d.docType)) return false;
    if (statusFilter.active.length && !statusFilter.has(d.status)) return false;
    if (orgFilter.active.length && !orgFilter.has(d.environment)) return false;
    return true;
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
              $active={hasFilter}
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

      {selected.set.size > 0 && (
        <ImportBar>
          <ImportBarLabel>{selected.set.size} מסמכים נבחרו</ImportBarLabel>
          <Button
            type="button"
            size="xs"
            data-testid={DOC_TAB_IDS.importBtn}
            onClick={onImportSelected}
          >
            הוסף לרשימה
          </Button>
        </ImportBar>
      )}

      {filterOpen && filterPos && (
        <FilterDropdown
          ref={filterPanelRef}
          style={{
            top: filterPos.top,
            left: filterPos.left,
            maxHeight: `calc(100vh - ${filterPos.top}px - 16px)`,
          }}
        >
          <FilterSectionTitle>סוג מסמך</FilterSectionTitle>
          {docTypes.map((t) => (
            <FilterOption key={t} $active={typeFilter.has(t)} onClick={handleToggleType(t)}>
              <CheckBox
                type="button"
                $checked={typeFilter.has(t)}
                $disabled={false}
                style={{ width: 16, height: 16 }}
              >
                {typeFilter.has(t) && <Check size={10} color={colors.surface} />}
              </CheckBox>
              {t}
            </FilterOption>
          ))}
          <FilterDivider />
          <FilterSectionTitle>סטטוס</FilterSectionTitle>
          {statuses.map((s) => (
            <FilterOption key={s} $active={statusFilter.has(s)} onClick={handleToggleStatus(s)}>
              <CheckBox
                type="button"
                $checked={statusFilter.has(s)}
                $disabled={false}
                style={{ width: 16, height: 16 }}
              >
                {statusFilter.has(s) && <Check size={10} color={colors.surface} />}
              </CheckBox>
              {s}
            </FilterOption>
          ))}
          <FilterDivider />
          <FilterSectionTitle>ארגון</FilterSectionTitle>
          {orgs.map((o) => (
            <FilterOption key={o} $active={orgFilter.has(o)} onClick={handleToggleOrg(o)}>
              <CheckBox
                type="button"
                $checked={orgFilter.has(o)}
                $disabled={false}
                style={{ width: 16, height: 16 }}
              >
                {orgFilter.has(o) && <Check size={10} color={colors.surface} />}
              </CheckBox>
              {o}
            </FilterOption>
          ))}
          <FilterDivider />
          <FilterSectionTitle>תאריך עדכון</FilterSectionTitle>
          <DateFilterSection>
            <DateRow>
              <DateLabel>מ-</DateLabel>
              <DateInput type="date" value={dateFrom} onChange={onDateFromChange} />
            </DateRow>
            <DateRow>
              <DateLabel>עד</DateLabel>
              <DateInput type="date" value={dateTo} onChange={onDateToChange} />
            </DateRow>
          </DateFilterSection>
          {hasFilter && (
            <ClearFiltersBtn type="button" onClick={onClearFilters}>
              נקה סינון
            </ClearFiltersBtn>
          )}
        </FilterDropdown>
      )}
    </TabRoot>
  );
};
