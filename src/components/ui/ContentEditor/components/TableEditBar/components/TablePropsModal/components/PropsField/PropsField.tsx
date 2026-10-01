import type { ReactNode } from 'react';
import { FieldControl, FieldLabel, FieldRow } from './PropsField.styles';

export interface PropsFieldProps {
  label: string;
  children: ReactNode;
}

export const PropsField = ({ label, children }: PropsFieldProps) => (
  <FieldRow dir="rtl">
    <FieldLabel>{label}</FieldLabel>
    <FieldControl>{children}</FieldControl>
  </FieldRow>
);
