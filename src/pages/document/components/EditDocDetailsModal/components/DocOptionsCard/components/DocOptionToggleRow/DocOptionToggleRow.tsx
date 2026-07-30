import { Toggle } from '@/components/ui/Toggle';
import { EDIT_DOC_DETAILS_MODAL_IDS } from '../../../../EditDocDetailsModal.testids';
import { OptionLabel, OptionRow } from '../../DocOptionsCard.styles';

export interface DocOptionToggleRowProps {
  field: string;
  label: string;
  checked: boolean;
  locked: boolean;
  onChange: (checked: boolean) => void;
}

export const DocOptionToggleRow = ({
  field,
  label,
  checked,
  locked,
  onChange,
}: DocOptionToggleRowProps) => (
  <OptionRow $locked={locked}>
    <OptionLabel $locked={locked}>{label}</OptionLabel>

    {locked ? null : (
      <Toggle
        checked={checked}
        onChange={onChange}
        aria-label={label}
        data-testid={EDIT_DOC_DETAILS_MODAL_IDS.optionToggle(field)}
      />
    )}
  </OptionRow>
);
