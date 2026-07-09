import { X } from 'lucide-react';
import { FilterChipClear, FilterChipRoot } from './FilterChip.styles';
import { FILTER_CHIP_IDS } from './FilterChip.testids';

interface FilterChipProps {
  label: string;
  onClear: () => void;
}

export const FilterChip = ({ label, onClear }: FilterChipProps) => {
  return (
    <FilterChipRoot data-testid={FILTER_CHIP_IDS.root(label)}>
      {label}
      <FilterChipClear type="button" data-testid={FILTER_CHIP_IDS.clear(label)} onClick={onClear}>
        <X size={12} />
      </FilterChipClear>
    </FilterChipRoot>
  );
};
