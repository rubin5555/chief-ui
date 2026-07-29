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

/** One switch in the options card: what it does, and whether it is on. */
export const DocOptionToggleRow = ({
  field,
  label,
  checked,
  locked,
  onChange,
}: DocOptionToggleRowProps) => (
  <OptionRow $locked={locked}>
    <OptionLabel $locked={locked}>{label}</OptionLabel>
    {/* Absent rather than disabled once the document is past editing: main hides
        the control behind `pointer-events: none` (Edit.tsx:2386), which leaves a
        switch that looks live and silently ignores you. */}
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
