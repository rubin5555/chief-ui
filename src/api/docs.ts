import { gql } from '@apollo/client';
import type { DocItem } from '@/modals/MailingListModal';
import { useApiQuery } from './hooks';
import { registerStub } from './stubLink';

export const GET_DOCS_QUERY = gql`
  query GetDocs {
    docs {
      id
      name
      cmdNum
      update
      environment
      docType
      lastUpdate
      refNum
      status
      distribution {
        name
        idNumber
        environment
      }
    }
  }
`;

export interface GetDocsResult {
  docs: DocItem[];
}

export const useDocs = () => useApiQuery(GET_DOCS_QUERY, (result: GetDocsResult) => result.docs);

// ponytail: no backend/resolver yet — registered on stubLink with the same
// catalog DocTab/DocFilterPanel used to import directly. Delete this
// registration once GetDocs has a real resolver; call sites don't change.
export const DOCS_FALLBACK: GetDocsResult = {
  docs: [
    {
      id: 'd1',
      name: 'נוהל בטיחות 2026',
      cmdNum: '001',
      update: 'גרסה 2',
      environment: 'ארגון א׳',
      docType: 'נוהל',
      lastUpdate: '10/05/2026',
      refNum: '1001',
      status: 'טיוטה',
      distribution: [
        { name: 'אבי כהן', idNumber: '012345678', environment: 'ארגון א׳' },
        { name: 'שרה לוי', idNumber: '023456789', environment: 'ארגון ב׳' },
        { name: 'דני אברהם', idNumber: '078901234', environment: 'ארגון ד׳' },
        { name: 'מירי פרץ', idNumber: '067890123', environment: 'ארגון א׳' },
        { name: 'יעקב בן-דוד', idNumber: '112345678', environment: 'ארגון א׳' },
        { name: 'תמר ברק', idNumber: '123456789', environment: 'ארגון ב׳' },
      ],
    },
    {
      id: 'd2',
      name: 'נוהל גיוס עובדים',
      cmdNum: '002',
      update: 'גרסה 1',
      environment: 'ארגון ב׳',
      docType: 'נוהל',
      lastUpdate: '08/05/2026',
      refNum: '1002',
      status: 'בהכנה',
      distribution: [
        { name: 'משה ישראלי', idNumber: '034567890', environment: 'ארגון א׳' },
        { name: 'לאה כץ', idNumber: '089012345', environment: 'ארגון ב׳' },
      ],
    },
    {
      id: 'd3',
      name: 'תקנון משמעת',
      cmdNum: '003',
      update: 'גרסה 3',
      environment: 'ארגון א׳',
      docType: 'תקנון',
      lastUpdate: '05/05/2026',
      refNum: '1003',
      status: 'טיוטה',
      distribution: [
        { name: 'אורן שמש', idNumber: '090123456', environment: 'ארגון א׳' },
        { name: 'גיל אלון', idNumber: '156789012', environment: 'ארגון ג׳' },
        { name: 'נועה גרין', idNumber: '101234567', environment: 'ארגון ג׳' },
        { name: 'ריקי נחום', idNumber: '145678901', environment: 'ארגון א׳' },
      ],
    },
    {
      id: 'd4',
      name: 'נוהל רכש ואספקה',
      cmdNum: '004',
      update: 'גרסה 1',
      environment: 'ארגון ג׳',
      docType: 'נוהל',
      lastUpdate: '03/05/2026',
      refNum: '1004',
      status: 'טיוטה',
      distribution: [{ name: 'יוסף מזרחי', idNumber: '056789012', environment: 'ארגון ב׳' }],
    },
  ],
};

registerStub('GetDocs', (): GetDocsResult => DOCS_FALLBACK);
