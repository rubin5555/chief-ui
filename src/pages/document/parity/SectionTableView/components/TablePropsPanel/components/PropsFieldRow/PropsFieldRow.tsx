import type { ReactNode } from 'react';
import { FieldControl, FieldLabel, FieldRow } from './PropsFieldRow.styles';

export interface PropsFieldRowProps {
  label: string;
  /** Ties the label to whatever control the caller renders. */
  htmlFor: string;
  children: ReactNode;
}

// main's `PF` (Edit.tsx:785-792): a fixed-width label with the control filling the
// rest, so fourteen rows across two panels line up on the same column.
export const PropsFieldRow = ({ label, htmlFor, children }: PropsFieldRowProps) => (
  <FieldRow dir="rtl">
    <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>
    <FieldControl>{children}</FieldControl>
  </FieldRow>
);
