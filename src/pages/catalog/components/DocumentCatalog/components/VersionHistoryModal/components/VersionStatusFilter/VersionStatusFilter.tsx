import { Filter, X } from 'lucide-react';
import type { MouseEvent } from 'react';
import { useRef, useState } from 'react';
import { useClickOutside } from '@/hooks/useClickOutside';
import { catStatusColors, gray } from '@/styles/theme';
import { CATALOG_MODAL_IDS } from '../../../catalogModals.testids';
import { FilterBtn, FilterClear } from '../../VersionHistoryModal.styles';
import {
  FilterAnchor,
  StatusCheckbox,
  StatusOption,
  StatusPanel,
  StatusPill,
  StatusPillDot,
} from './VersionStatusFilter.styles';

interface VersionStatusFilterProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export const VersionStatusFilter = ({ options, selected, onChange }: VersionStatusFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  useClickOutside([anchorRef], () => setIsOpen(false), isOpen);

  const hasFilter = selected.length > 0;

  const onToggle = () => setIsOpen((prev) => !prev);

  // Clearing lives inside the button, so its click must not also toggle the panel.
  const onClear = (event: MouseEvent) => {
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
    <FilterAnchor ref={anchorRef}>
      <FilterBtn
        type="button"
        $active={hasFilter}
        data-testid={CATALOG_MODAL_IDS.historyStatusFilter}
        onClick={onToggle}
      >
        <Filter size={12} />
        <span>{hasFilter ? `סטטוס (${selected.length})` : 'סינון לפי סטטוס'}</span>
        {hasFilter && (
          <FilterClear onClick={onClear}>
            <X size={12} />
          </FilterClear>
        )}
      </FilterBtn>

      {isOpen && (
        <StatusPanel dir="rtl">
          {options.map((status) => {
            const palette = catStatusColors[status] ?? { bg: gray[100], ink: gray[500] };
            return (
              <StatusOption key={status}>
                <StatusCheckbox
                  type="checkbox"
                  checked={selected.includes(status)}
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
    </FilterAnchor>
  );
};
