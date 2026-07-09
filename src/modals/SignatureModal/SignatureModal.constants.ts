import type { SignatureType } from '@/pages/profile/components/tabs/SignaturesPanel';

export type SignatureModalMode = 'new' | 'edit' | 'duplicate';

export interface SignatureTypeOption {
  id: SignatureType;
  label: string;
  disabled?: boolean;
}

export const SIGNATURE_TYPE_OPTIONS: SignatureTypeOption[] = [
  { id: 'distribution', label: 'חתימה להפצה' },
  { id: 'personal', label: 'חתימה אישית במסמך' },
  { id: 'approver', label: 'חתימת מאשר', disabled: true },
];
