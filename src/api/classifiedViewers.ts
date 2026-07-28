import { gql } from '@apollo/client';
import { useApiQuery } from './hooks';
import { registerStub } from './stubLink';

// The pool of people who can be granted sight of a classified (ממודר) section.
//
// This is deliberately a separate resource from networkPeople.ts even though
// the shapes rhyme. That file backs four MailingListFormModal consumers; repointing
// it at main's CLASSIFIED_POOL to get exact fidelity here would have silently
// changed all of them. A real backend would also expose these separately —
// clearance-bearing personnel is not the same list as network contacts.
export interface ClassifiedViewerDto {
  id: string;
  name: string;
  idNumber: string;
  /** Clearance environment: סודי / סודי ביותר / אמ"ן. */
  env: string;
}

export const GET_CLASSIFIED_VIEWER_POOL_QUERY = gql`
  query GetClassifiedViewerPool {
    classifiedViewerPool {
      id
      name
      idNumber
      env
    }
  }
`;

export interface GetClassifiedViewerPoolResult {
  classifiedViewerPool: ClassifiedViewerDto[];
}

export const useClassifiedViewerPool = () =>
  useApiQuery(
    GET_CLASSIFIED_VIEWER_POOL_QUERY,
    (result: GetClassifiedViewerPoolResult) => result.classifiedViewerPool,
  );

// ponytail: no backend/resolver yet — registered on stubLink with main's
// CLASSIFIED_POOL (Edit.tsx:23-34) verbatim. Delete this registration once
// GetClassifiedViewerPool has a real resolver; call sites don't change.
export const CLASSIFIED_VIEWER_POOL_FALLBACK: GetClassifiedViewerPoolResult = {
  classifiedViewerPool: [
    { id: 'u1', name: 'אלון כהן', idNumber: '123456789', env: 'סודי' },
    { id: 'u2', name: 'מיכל לוי', idNumber: '234567890', env: 'סודי ביותר' },
    { id: 'u3', name: 'יוסי מזרחי', idNumber: '345678901', env: 'סודי' },
    { id: 'u4', name: 'שרה גולדברג', idNumber: '456789012', env: 'אמ"ן' },
    { id: 'u5', name: 'דוד פרץ', idNumber: '567890123', env: 'סודי ביותר' },
    { id: 'u6', name: 'רות אברהם', idNumber: '678901234', env: 'סודי' },
    { id: 'u7', name: 'נחום שפירא', idNumber: '789012345', env: 'אמ"ן' },
    { id: 'u8', name: 'חנה כץ', idNumber: '890123456', env: 'סודי ביותר' },
    { id: 'u9', name: 'אבי בן דוד', idNumber: '901234567', env: 'סודי' },
    { id: 'u10', name: 'לילך רוזנברג', idNumber: '012345678', env: 'אמ"ן' },
  ],
};

registerStub(
  'GetClassifiedViewerPool',
  (): GetClassifiedViewerPoolResult => CLASSIFIED_VIEWER_POOL_FALLBACK,
);
