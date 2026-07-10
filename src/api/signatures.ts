import { gql } from '@apollo/client';
import { registerStub } from './stubLink';

export type SignatureTypeDto = 'distribution' | 'personal' | 'approver';

export interface SignatureDto {
  id: string;
  name: string;
  department?: string;
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
    }
  }
`;

export interface GetSignaturesResult {
  signatures: Record<SignatureTypeDto, SignatureDto[]>;
}

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
    approver: [],
  },
};

registerStub('GetSignatures', (): GetSignaturesResult => SIGNATURES_FALLBACK);
