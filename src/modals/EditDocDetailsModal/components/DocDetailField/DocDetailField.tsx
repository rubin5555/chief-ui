import type { ReactNode } from 'react';
import { EMPTY_VALUE } from '../../EditDocDetailsModal.constants';
import { EDIT_DOC_DETAILS_MODAL_IDS } from '../../EditDocDetailsModal.testids';
import { Field, FieldLabel, ReadOnlyLabel, ReadOnlyValue } from '../components.shared.styles';

export interface DocDetailFieldProps {
  name: string;
  label: ReactNode;
  readOnly: boolean;
  value: string;
  children: ReactNode;
}

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
