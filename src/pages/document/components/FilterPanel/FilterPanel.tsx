import { getRouteApi } from '@tanstack/react-router';
import { Filter, X } from 'lucide-react';
import { FloatingPanel } from '@/components/ui/FloatingPanel';
import { useFloatingPanel } from '@/hooks/useFloatingPanel';
import type { SectionStatus } from '../../types';
import { StatusFilterList } from './components/StatusFilterList';
import { useFilterPanelAnalytics } from './FilterPanel.analytics';
import { CloseButton, FilterTrigger, PanelHeader, PanelTitle } from './FilterPanel.styles';
import { FILTER_PANEL_IDS } from './FilterPanel.testids';

const routeApi = getRouteApi('/document/$id');

const PANEL_WIDTH = 240;

export const FilterPanel = () => {
  const { statuses } = routeApi.useSearch();
  const navigate = routeApi.useNavigate();
  const panel = useFloatingPanel<HTMLButtonElement>({ focusOnOpen: true });
  const { trackPanelOpened, trackFilterApplied } = useFilterPanelAnalytics();

  const applied = statuses ? (statuses.split(',') as SectionStatus[]) : [];

  const handleToggleOpen = () => {
    if (!panel.open) trackPanelOpened();
    panel.toggle(PANEL_WIDTH);
  };

  const handleApply = (next: SectionStatus[]) => {
    trackFilterApplied(next);
    navigate({ search: (prev) => ({ ...prev, statuses: next.join(',') }), replace: true });
    panel.close();
  };

  return (
    <>
      <FilterTrigger
        ref={panel.btnRef}
        type="button"
        title="סינון"
        aria-label="סינון סעיפים לפי סטטוס"
        data-testid={FILTER_PANEL_IDS.trigger}
        onClick={handleToggleOpen}
      >
        <Filter size={16} />
      </FilterTrigger>

      {panel.open && panel.pos && (
        <FloatingPanel
          ref={panel.panelRef}
          pos={panel.pos}
          width={PANEL_WIDTH}
          dir="rtl"
          data-testid={FILTER_PANEL_IDS.panel}
        >
          <PanelHeader>
            <PanelTitle>סינון סעיפים לפי סטטוס</PanelTitle>
            <CloseButton
              type="button"
              aria-label="סגירה"
              data-testid={FILTER_PANEL_IDS.closeBtn}
              onClick={panel.close}
            >
              <X size={14} />
            </CloseButton>
          </PanelHeader>

          <StatusFilterList applied={applied} onApply={handleApply} />
        </FloatingPanel>
      )}
    </>
  );
};
