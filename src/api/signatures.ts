import { gql } from '@apollo/client';
import { useApiQuery } from './hooks';
import { registerStub } from './stubLink';

export type SignatureTypeDto = 'distribution' | 'personal' | 'approver' | 'templates';

export interface SignatureDto {
  id: string;
  name: string;
  department?: string;
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

export const SIGNATURES_FALLBACK: GetSignaturesResult = {
  signatures: {
    distribution: [
      { id: 's1', name: 'חתימה רשמית — אגף מבצעים', department: 'מחלקה א׳' },
      { id: 's2', name: 'חתימה קצרה להפצה', department: 'מחלקה ב׳' },
    ],
    personal: [{ id: 's3', name: 'חתימה אישית — ישראל ישראלי', department: 'מחלקה ג׳' }],

    approver: [
      { id: 's4', name: 'חתימה ראשית' },
      { id: 's5', name: 'חתימה רשמית' },
      { id: 's6', name: 'חתימת שדה' },
    ],

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
