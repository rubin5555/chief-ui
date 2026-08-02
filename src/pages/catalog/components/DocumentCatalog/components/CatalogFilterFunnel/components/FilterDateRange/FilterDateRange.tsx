import { DateTimePicker } from '@/components/ui/DateTimePicker';
import { FILTER_TITLES } from '../../../../DocumentCatalog.constants';
import { SectionTitle } from '../components.shared.styles';
import { RangeField, RangeFields, RangeLabel } from './FilterDateRange.styles';

interface FilterDateRangeProps {
  from: string;
  to: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
}

export const FilterDateRange = ({ from, to, onFromChange, onToChange }: FilterDateRangeProps) => (
  <div>
    <SectionTitle>{FILTER_TITLES.dateRange}</SectionTitle>
    <RangeFields>
      <RangeField>
        <RangeLabel>מ-</RangeLabel>
        <DateTimePicker mode="date" placeholder="מ-" value={from} onChange={onFromChange} />
      </RangeField>
      <RangeField>
        <RangeLabel>עד</RangeLabel>
        <DateTimePicker mode="date" placeholder="עד" value={to} onChange={onToChange} />
      </RangeField>
    </RangeFields>
  </div>
);
