import { getRouteApi } from '@tanstack/react-router';
import { Filter } from 'lucide-react';
import { FloatingPanel } from '@/components/ui/FloatingPanel';
import { IconButtonRoot } from '@/components/ui/IconButton/IconButton.styles';
import { useFloatingPanel } from '@/hooks/useFloatingPanel';
import type { SectionStatus } from '../../types';
import { ClearBtn, ClearRow, OptionRow, PanelBody } from './FilterPanel.styles';
import { FILTER_PANEL_IDS } from './FilterPanel.testids';

const routeApi = getRouteApi('/document/$id');

const PANEL_WIDTH = 180;

const STATUS_OPTIONS: { id: SectionStatus; label: string }[] = [
  { id: 'editing', label: 'בעריכה' },
  { id: 'pending', label: 'ממתין' },
  { id: 'approved', label: 'מאושר' },
  { id: 'fix', label: 'לתיקון' },
  { id: 'idle', label: 'ללא סטטוס' },
];

// Status filter is bookmarkable (it changes which sections render), so it's
// backed by the route's `statuses` search param rather than local state, per
// .claude/skills/router-state-splitting.md.
export const FilterPanel = () => {
  const { statuses } = routeApi.useSearch();
  const navigate = routeApi.useNavigate();
  const panel = useFloatingPanel<HTMLButtonElement>();

  const activeStatuses = statuses ? statuses.split(',') : [];

  const handleToggle = (status: SectionStatus) => () => {
    const next = activeStatuses.includes(status)
      ? activeStatuses.filter((s) => s !== status)
      : [...activeStatuses, status];
    navigate({ search: (prev) => ({ ...prev, statuses: next.join(',') }), replace: true });
  };

  const handleClear = () =>
    navigate({ search: (prev) => ({ ...prev, statuses: '' }), replace: true });
  const handleToggleOpen = () => panel.toggle(PANEL_WIDTH);

  return (
    <>
      <IconButtonRoot
        ref={panel.btnRef}
        type="button"
        $isActive={panel.open || activeStatuses.length > 0}
        aria-label="סינון לפי סטטוס"
        data-testid={FILTER_PANEL_IDS.trigger}
        onClick={handleToggleOpen}
      >
        <Filter size={16} />
      </IconButtonRoot>

      {panel.open && panel.pos && (
        <FloatingPanel
          ref={panel.panelRef}
          $pos={panel.pos}
          $width={PANEL_WIDTH}
          data-testid={FILTER_PANEL_IDS.panel}
        >
          <PanelBody>
            {STATUS_OPTIONS.map((option) => (
              <OptionRow key={option.id}>
                <input
                  type="checkbox"
                  checked={activeStatuses.includes(option.id)}
                  onChange={handleToggle(option.id)}
                  data-testid={FILTER_PANEL_IDS.option(option.id)}
                />
                {option.label}
              </OptionRow>
            ))}
            {activeStatuses.length > 0 && (
              <ClearRow>
                <ClearBtn
                  type="button"
                  onClick={handleClear}
                  data-testid={FILTER_PANEL_IDS.clearBtn}
                >
                  ניקוי סינון
                </ClearBtn>
              </ClearRow>
            )}
          </PanelBody>
        </FloatingPanel>
      )}
    </>
  );
};
