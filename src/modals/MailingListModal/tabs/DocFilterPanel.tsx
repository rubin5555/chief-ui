import { Check } from 'lucide-react';
import { Fragment, type RefObject } from 'react';
import { colors } from '@/styles/theme';
import { CheckBox } from '../components/SelectionCheckbox/SelectionCheckbox.styles';
import { LIST_DOCS } from '../MailingListModal.constants';
import {
  ClearFiltersBtn,
  DateFilterSection,
  DateInput,
  DateLabel,
  DateRow,
  FilterDivider,
  FilterDropdown,
  FilterOption,
  FilterSectionTitle,
} from './DocTab.styles';
import type { DocFilters } from './useDocFilters';

const DOC_TYPES = [...new Set(LIST_DOCS.map((d) => d.docType))];
const STATUSES = [...new Set(LIST_DOCS.map((d) => d.status))];
const ORGS = [...new Set(LIST_DOCS.map((d) => d.environment))];

interface DocFilterPanelProps {
  filters: DocFilters;
  top: number;
  left: number;
  panelRef: RefObject<HTMLDivElement | null>;
}

// The floating filter dropdown anchored to DocTab's filter button.
export const DocFilterPanel = ({ filters, top, left, panelRef }: DocFilterPanelProps) => {
  const sections = [
    { title: 'סוג מסמך', values: DOC_TYPES, list: filters.typeFilter },
    { title: 'סטטוס', values: STATUSES, list: filters.statusFilter },
    { title: 'ארגון', values: ORGS, list: filters.orgFilter },
  ];

  const handleToggle = (list: DocFilters['typeFilter'], value: string) => () => list.toggle(value);

  return (
    <FilterDropdown ref={panelRef} $top={top} $left={left}>
      {sections.map(({ title, values, list }) => (
        <Fragment key={title}>
          <FilterSectionTitle>{title}</FilterSectionTitle>
          {values.map((v) => (
            <FilterOption key={v} $active={list.has(v)} onClick={handleToggle(list, v)}>
              <CheckBox type="button" $checked={list.has(v)} $disabled={false} $size={16}>
                {list.has(v) && <Check size={10} color={colors.surface} />}
              </CheckBox>
              {v}
            </FilterOption>
          ))}
          <FilterDivider />
        </Fragment>
      ))}
      <FilterSectionTitle>תאריך עדכון</FilterSectionTitle>
      <DateFilterSection>
        <DateRow>
          <DateLabel>מ-</DateLabel>
          <DateInput type="date" value={filters.dateFrom} onChange={filters.onDateFromChange} />
        </DateRow>
        <DateRow>
          <DateLabel>עד</DateLabel>
          <DateInput type="date" value={filters.dateTo} onChange={filters.onDateToChange} />
        </DateRow>
      </DateFilterSection>
      {filters.hasFilter && (
        <ClearFiltersBtn type="button" onClick={filters.clear}>
          נקה סינון
        </ClearFiltersBtn>
      )}
    </FilterDropdown>
  );
};
