import { Filter } from 'lucide-react';
import { TRIGGER_GAP, useFloatingPanel } from '@/hooks/useFloatingPanel';
import {
  DEPARTMENT_OPTIONS,
  FILTER_TITLES,
  TEMPLATE_OPTIONS,
} from '../../DocumentCatalog.constants';
import { DOCUMENT_CATALOG_IDS } from '../../DocumentCatalog.testids';
import {
  ActiveDot,
  ClearAllBtn,
  ClearAllWrap,
  FunnelPanel,
  FunnelTrigger,
  PanelDivider,
} from './CatalogFilterFunnel.styles';
import { FilterCheckboxSection } from './components/FilterCheckboxSection';
import { FilterDateRange } from './components/FilterDateRange';

export interface CatalogFilterValues {
  templates: string[];
  statuses: string[];
  depts: string[];
  orgs: string[];
  from: string;
  to: string;
}

interface CatalogFilterFunnelProps {
  values: CatalogFilterValues;
  statusOptions: string[];
  orgOptions: string[];
  isAllDocs: boolean;
  onChange: (patch: Partial<CatalogFilterValues>) => void;
  onClearAll: () => void;
}

// A date range counts as one active filter however many of its two ends are
// set, which is how main counts it too.
export const countActiveFilters = (values: CatalogFilterValues, isAllDocs: boolean) =>
  values.templates.length +
  values.statuses.length +
  values.depts.length +
  (values.from || values.to ? 1 : 0) +
  (isAllDocs ? values.orgs.length : 0);

// The mock hangs the panel off the trigger's near edge (`left-0`), not centred
// on it, so it opens across the search pill rather than over the toolbar's edge.
const PANEL_WIDTH = 288;
const panelSpec = (trigger: DOMRect) => ({ top: trigger.bottom + TRIGGER_GAP, left: trigger.left });

export const CatalogFilterFunnel = ({
  values,
  statusOptions,
  orgOptions,
  isAllDocs,
  onChange,
  onClearAll,
}: CatalogFilterFunnelProps) => {
  const panel = useFloatingPanel<HTMLButtonElement>();

  const activeCount = countActiveFilters(values, isAllDocs);

  const onToggle = () => panel.toggle(panelSpec);

  // Every section writes one key, so the six handlers are one factory.
  const handleListChange = (key: keyof CatalogFilterValues) => (selected: string[]) =>
    onChange({ [key]: selected });

  const onFromChange = (from: string) => onChange({ from });
  const onToChange = (to: string) => onChange({ to });

  const handleClearAll = () => {
    onClearAll();
    panel.close();
  };

  return (
    <>
      <FunnelTrigger
        ref={panel.btnRef}
        type="button"
        title="סינון"
        data-testid={DOCUMENT_CATALOG_IDS.filterBtn}
        onClick={onToggle}
      >
        <Filter size={16} />
        {activeCount > 0 && <ActiveDot />}
      </FunnelTrigger>

      {panel.open && panel.pos && (
        <FunnelPanel
          ref={panel.panelRef}
          pos={panel.pos}
          width={PANEL_WIDTH}
          dir="rtl"
          data-testid={DOCUMENT_CATALOG_IDS.filterPanel}
        >
          <FilterCheckboxSection
            searchable
            title={FILTER_TITLES.template}
            options={TEMPLATE_OPTIONS}
            selected={values.templates}
            onChange={handleListChange('templates')}
          />

          <PanelDivider />

          <FilterCheckboxSection
            title={FILTER_TITLES.status}
            options={statusOptions}
            selected={values.statuses}
            onChange={handleListChange('statuses')}
          />

          <PanelDivider />

          <FilterCheckboxSection
            searchable
            title={FILTER_TITLES.dept}
            options={DEPARTMENT_OPTIONS}
            selected={values.depts}
            onChange={handleListChange('depts')}
          />

          <PanelDivider />

          <FilterDateRange
            from={values.from}
            to={values.to}
            onFromChange={onFromChange}
            onToChange={onToChange}
          />

          {isAllDocs && (
            <>
              <PanelDivider />
              <FilterCheckboxSection
                searchable
                title={FILTER_TITLES.org}
                options={orgOptions}
                selected={values.orgs}
                onChange={handleListChange('orgs')}
              />
            </>
          )}

          {activeCount > 0 && (
            <>
              <PanelDivider />
              <ClearAllWrap>
                <ClearAllBtn type="button" onClick={handleClearAll}>
                  נקה הכל
                </ClearAllBtn>
              </ClearAllWrap>
            </>
          )}
        </FunnelPanel>
      )}
    </>
  );
};
