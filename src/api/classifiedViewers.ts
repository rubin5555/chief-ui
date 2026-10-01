import { gql } from '@apollo/client';
import { useApiQuery } from './hooks';
import { registerStub } from './stubLink';

export interface ClassifiedViewerDto {
  id: string;
  name: string;
  idNumber: string;
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
