import { Check } from 'lucide-react';
import { colors, gray } from '@/styles/theme';
import { CheckBox } from './SelectionCheckbox.styles';

interface Props {
  isSelected: boolean;
  isAdded: boolean;
}

export const SelectionCheckbox = ({ isSelected, isAdded }: Props) => (
  <CheckBox type="button" $checked={isSelected || isAdded} $disabled={isAdded}>
    {isAdded && <Check size={14} color={gray[300]} strokeWidth={2.5} />}
    {isSelected && !isAdded && <Check size={12} color={colors.surface} />}
  </CheckBox>
);
