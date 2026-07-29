import type { ReactNode } from 'react';
import { EMPTY_VALUE } from '../../EditDocDetailsModal.constants';
import { Field, FieldLabel, ReadOnlyLabel, ReadOnlyValue } from '../../EditDocDetailsModal.styles';
import { EDIT_DOC_DETAILS_MODAL_IDS } from '../../EditDocDetailsModal.testids';

export interface DocDetailFieldProps {
  /** Used as the read-only testid, and as the control's label association. */
  name: string;
  label: ReactNode;
  /** Past editing, the field is a fact rather than a control (main's isLimitedEdit). */
  readOnly: boolean;
  /** What the fact reads as. Only used when `readOnly`. */
  value: string;
  children: ReactNode;
}

/**
 * One labelled field, in whichever of its two states applies.
 *
 * main writes this out per field as a `(readOnly || isLimitedEdit) ? … : …`
 * ternary, seven times over (Edit.tsx:2275-2357). Collapsed here so the field
 * list reads as a list of fields rather than of conditionals, and so a field
 * added later can't quietly forget to have a locked state.
 */
export const DocDetailField = ({ name, label, readOnly, value, children }: DocDetailFieldProps) => (
  <Field>
    {readOnly ? (
      <ReadOnlyLabel>{label}</ReadOnlyLabel>
    ) : (
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
    )}

    {readOnly ? (
      <ReadOnlyValue data-testid={EDIT_DOC_DETAILS_MODAL_IDS.readOnlyValue(name)}>
        {value || EMPTY_VALUE}
      </ReadOnlyValue>
    ) : (
      children
    )}
  </Field>
);
