import { gql } from '@apollo/client';
import { useApiQuery } from './hooks';
import { registerStub } from './stubLink';

// `templates` are the reusable signature bodies the document's signatures
// section offers under "התבניות שלי"; the other three are ProfilePage's
// catalogs. Kept in one query because they are one resource to a real backend.
export type SignatureTypeDto = 'distribution' | 'personal' | 'approver' | 'templates';

export interface SignatureDto {
  id: string;
  name: string;
  department?: string;
  /** Prefilled body text. Only the reusable templates carry one. */
  content?: string;
}

export const GET_SIGNATURES_QUERY = gql`
  query GetSignatures {
    signatures {
      distribution {
        id
        name
        department
      }
      personal {
        id
        name
        department
      }
      approver {
        id
        name
        department
      }
      templates {
        id
        name
        content
      }
    }
  }
`;

export interface GetSignaturesResult {
  signatures: Record<SignatureTypeDto, SignatureDto[]>;
}

export const useSignatures = () =>
  useApiQuery(GET_SIGNATURES_QUERY, (result: GetSignaturesResult) => result.signatures);

// ponytail: no backend/resolver yet — registered on stubLink with the same
// catalog ProfilePage used to import directly. Delete this registration once
// GetSignatures has a real resolver; call sites don't change.
export const SIGNATURES_FALLBACK: GetSignaturesResult = {
  signatures: {
    distribution: [
      { id: 's1', name: 'חתימה רשמית — אגף מבצעים', department: 'מחלקה א׳' },
      { id: 's2', name: 'חתימה קצרה להפצה', department: 'מחלקה ב׳' },
    ],
    personal: [{ id: 's3', name: 'חתימה אישית — ישראל ישראלי', department: 'מחלקה ג׳' }],
    // main's USER_SIGNATURES (Edit.tsx:2660) — the in-approval picker's options.
    approver: [
      { id: 's4', name: 'חתימה ראשית' },
      { id: 's5', name: 'חתימה רשמית' },
      { id: 's6', name: 'חתימת שדה' },
    ],
    // main's SIGNATURE_TEMPLATES (Edit.tsx:36-41), verbatim including the
    // tab-indented content bodies, which are what gets pasted into an empty
    // signature slot.
    templates: [
      {
        id: 'sig-1',
        name: 'חתימת מאשר ראשי',
        content: 'בברכה,\n\t\tשם מלא\n\t\tמאשר ראשי\n\t\tמדור',
      },
      {
        id: 'sig-2',
        name: 'חתימת מאשר משנה',
        content: 'בברכה,\n\t\tשם מלא\n\t\tמאשר משנה\n\t\tענף',
      },
      {
        id: 'sig-3',
        name: 'חתימה להפצה כללית',
        content: 'בברכה,\n\t\tשם מלא\n\t\tמדור\n\t\tענף',
      },
      {
        id: 'sig-4',
        name: 'חתימה אישית',
        content: 'בברכה,\n\t\tשם מלא\n\t\tמדור\n\t\tענף',
      },
    ],
  },
};

registerStub('GetSignatures', (): GetSignaturesResult => SIGNATURES_FALLBACK);
