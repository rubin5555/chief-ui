import { FilterChip } from '@/components/ui/FilterChip';
import { FILTER_TITLES } from '../../DocumentCatalog.constants';
import type { CatalogFilterValues } from '../CatalogFilterFunnel';
import { ChipsRow } from './ActiveCatalogFilters.styles';

interface ActiveCatalogFiltersProps {
  values: CatalogFilterValues;
  isAllDocs: boolean;
  onChange: (patch: Partial<CatalogFilterValues>) => void;
}

// One chip per filter, not per value: `תבנית: פקודה` when a single option is
// picked, `תבנית (3)` when several are, and clearing the chip clears the whole
// filter. main labels them the same way.
const listLabel = (title: string, values: string[]) =>
  values.length === 1 ? `${title}: ${values[0]}` : `${title} (${values.length})`;

const toDisplayDate = (iso: string) => (iso ? iso.split('-').reverse().join('/') : '...');

export const ActiveCatalogFilters = ({
  values,
  isAllDocs,
  onChange,
}: ActiveCatalogFiltersProps) => {
  const hasDateRange = Boolean(values.from || values.to);
  const showOrgs = isAllDocs && values.orgs.length > 0;

  const isEmpty =
    values.templates.length === 0 &&
    values.statuses.length === 0 &&
    values.depts.length === 0 &&
    !hasDateRange &&
    !showOrgs;

  const handleClear = (patch: Partial<CatalogFilterValues>) => () => onChange(patch);

  if (isEmpty) return null;

  return (
    <ChipsRow>
      {values.templates.length > 0 && (
        <FilterChip
          label={listLabel(FILTER_TITLES.template, values.templates)}
          onClear={handleClear({ templates: [] })}
        />
      )}
      {values.statuses.length > 0 && (
        <FilterChip
          label={listLabel(FILTER_TITLES.status, values.statuses)}
          onClear={handleClear({ statuses: [] })}
        />
      )}
      {values.depts.length > 0 && (
        <FilterChip
          label={listLabel(FILTER_TITLES.dept, values.depts)}
          onClear={handleClear({ depts: [] })}
        />
      )}
      {hasDateRange && (
        <FilterChip
          label={`תאריך: ${toDisplayDate(values.from)} – ${toDisplayDate(values.to)}`}
          onClear={handleClear({ from: '', to: '' })}
        />
      )}
      {showOrgs && (
        <FilterChip
          label={listLabel(FILTER_TITLES.org, values.orgs)}
          onClear={handleClear({ orgs: [] })}
        />
      )}
    </ChipsRow>
  );
};
