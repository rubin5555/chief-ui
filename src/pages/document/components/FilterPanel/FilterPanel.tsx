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

// main's panel is 240px wide and hard-pinned to `top: 52, right: 12`
// (Edit.tsx:2493) — which only lands under the navbar's filter icon by coincidence
// of where that icon happens to sit. useFloatingPanel anchors it to the trigger's
// real rect instead, so it stays put if the toolbar ever moves, and clamps or flips
// at the viewport edge.
const PANEL_WIDTH = 240;

// Renders its trigger into the navbar's document-actions toolbar (see
// DocumentActionsSlot) rather than owning a spot in the page: the trigger and the
// popover have to be one component, because the popover is positioned off the
// trigger's own bounding rect.
//
// The *applied* filter is bookmarkable — it changes which sections render — so it's
// backed by the route's `statuses` search param rather than local state, per
// .claude/skills/router-state-splitting.md. The staged selection inside the open
// panel is not; that belongs to StatusFilterList.
export const FilterPanel = () => {
  const { statuses } = routeApi.useSearch();
  const navigate = routeApi.useNavigate();
  const panel = useFloatingPanel<HTMLButtonElement>();
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
          $pos={panel.pos}
          $width={PANEL_WIDTH}
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
