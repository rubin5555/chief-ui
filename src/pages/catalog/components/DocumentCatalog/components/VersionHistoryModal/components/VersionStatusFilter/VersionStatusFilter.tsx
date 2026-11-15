import { Filter, X } from 'lucide-react';
import type { MouseEvent } from 'react';
import { Checkbox } from '@/components/ui/Checkbox';
import { TRIGGER_GAP, useFloatingPanel } from '@/hooks/useFloatingPanel';
import { catStatusColors, gray } from '@/styles/theme';
import { CATALOG_MODAL_IDS } from '../../../catalogModals.testids';
import { FilterBtn, FilterClear } from '../../VersionHistoryModal.styles';
import { StatusOption, StatusPanel, StatusPill, StatusPillDot } from './VersionStatusFilter.styles';

interface VersionStatusFilterProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

const PANEL_MIN_WIDTH = 180;

// main hangs the panel off the chip's left edge and lets it spill past the
// dialog — which is why it cannot be an absolute child of a card that clips its
// overflow to keep its corners round.
const panelSpec = (trigger: DOMRect) => ({ top: trigger.bottom + TRIGGER_GAP, left: trigger.left });

export const VersionStatusFilter = ({ options, selected, onChange }: VersionStatusFilterProps) => {
  const { open, pos, btnRef, panelRef, toggle } = useFloatingPanel();

  const hasFilter = selected.length > 0;

  const handleToggle = () => toggle(panelSpec);

  // Clearing lives inside the button, so its click must not also toggle the panel.
  const handleClear = (event: MouseEvent) => {
    event.stopPropagation();
    onChange([]);
  };

  const handleToggleStatus = (status: string) => () =>
    onChange(
      selected.includes(status)
        ? selected.filter((value) => value !== status)
        : [...selected, status],
    );

  return (
    <>
      <FilterBtn
        ref={btnRef}
        type="button"
        $active={hasFilter}
        data-testid={CATALOG_MODAL_IDS.historyStatusFilter}
        onClick={handleToggle}
      >
        <Filter size={12} />
        <span>{hasFilter ? `סטטוס (${selected.length})` : 'סינון לפי סטטוס'}</span>
        {hasFilter && (
          <FilterClear onClick={handleClear}>
            <X size={12} />
          </FilterClear>
        )}
      </FilterBtn>

      {open && (
        <StatusPanel
          ref={panelRef}
          pos={pos}
          minWidth={PANEL_MIN_WIDTH}
          dir="rtl"
          data-testid={CATALOG_MODAL_IDS.historyStatusPanel}
        >
          {options.map((status) => {
            const palette = catStatusColors[status] ?? { bg: gray[100], ink: gray[500] };
            return (
              <StatusOption key={status}>
                <Checkbox
                  checked={selected.includes(status)}
                  data-testid={CATALOG_MODAL_IDS.historyStatusOption(status)}
                  onChange={handleToggleStatus(status)}
                />
                <StatusPill $bg={palette.bg} $ink={palette.ink}>
                  <StatusPillDot $ink={palette.ink} />
                  {status}
                </StatusPill>
              </StatusOption>
            );
          })}
        </StatusPanel>
      )}
    </>
  );
};
