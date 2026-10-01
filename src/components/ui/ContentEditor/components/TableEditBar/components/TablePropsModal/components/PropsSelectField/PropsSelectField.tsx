import { Select } from '@/components/ui/Select';
import type { PropsOption } from '../../TablePropsModal.types';
import { PropsField } from '../PropsField';

export interface PropsSelectFieldProps {
  label: string;
  options: PropsOption[];
  value: string;
  onChange: (value: string) => void;
  'data-testid'?: string;
}

export const PropsSelectField = ({
  label,
  options,
  value,
  onChange,
  'data-testid': testId,
}: PropsSelectFieldProps) => {
  // The shared select speaks in the labels it shows, so the option's value
  // only ever exists on this side of it.
  const labels = options.map((option) => option.label);
  const selected = options.find((option) => option.value === value)?.label ?? labels[0];

  const handleChange = (label: string) =>
    onChange(options.find((option) => option.label === label)?.value ?? '');

  return (
    <PropsField label={label}>
      <Select options={labels} value={selected} onChange={handleChange} data-testid={testId} />
    </PropsField>
  );
};
