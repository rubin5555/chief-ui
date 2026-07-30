import type { ReactNode } from 'react';
import { FieldControl, FieldLabel, FieldRow } from './PropsFieldRow.styles';

export interface PropsFieldRowProps {
  label: string;
  htmlFor: string;
  children: ReactNode;
}

export const PropsFieldRow = ({ label, htmlFor, children }: PropsFieldRowProps) => (
  <FieldRow dir="rtl">
    <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>
    <FieldControl>{children}</FieldControl>
  </FieldRow>
);
