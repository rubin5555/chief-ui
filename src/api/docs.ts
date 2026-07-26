import { gql } from '@apollo/client';
import type { DocItem } from '@/modals/MailingListModal';
import { type DocumentDto, emptySectionMeta, type SectionMetaMap } from '@/pages/document/types';
import { useApiMutation, useApiQuery } from './hooks';
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

export const GET_DOCUMENT_QUERY = gql`
  query GetDocument($id: ID!) {
    document(id: $id) {
      id
      status
      header {
        name
        organization
        template
        orderNum
        department
        effectiveDate
        classification
        referenceNum
      }
      subjects {
        id
        title
        sections {
          id
          title
          content
          permissions {
            approvers
            editors
          }
          subSections {
            id
            title
            content
            permissions {
              approvers
              editors
            }
          }
        }
      }
      sectionMeta
    }
  }
`;

export interface GetDocumentResult {
  document: DocumentDto;
}

export interface GetDocumentVariables {
  id: string;
}

export const useDocument = (id: string) =>
  useApiQuery<GetDocumentResult, DocumentDto, GetDocumentVariables>(
    GET_DOCUMENT_QUERY,
    (result) => result.document,
    { id },
  );

export const UPDATE_DOCUMENT_MUTATION = gql`
  mutation UpdateDocument($id: ID!, $input: UpdateDocumentInput!) {
    updateDocument(id: $id, input: $input) {
      id
      status
      header {
        name
        organization
        template
        orderNum
        department
        effectiveDate
        classification
        referenceNum
      }
      subjects {
        id
        title
        sections {
          id
          title
          content
          permissions {
            approvers
            editors
          }
          subSections {
            id
            title
            content
            permissions {
              approvers
              editors
            }
          }
        }
      }
      sectionMeta
    }
  }
`;

export interface UpdateDocumentResult {
  updateDocument: DocumentDto;
}

export interface UpdateDocumentVariables {
  id: string;
  input: Partial<Pick<DocumentDto, 'status' | 'header' | 'subjects' | 'sectionMeta'>>;
}

export const useUpdateDocument = () =>
  useApiMutation<UpdateDocumentResult, UpdateDocumentVariables, DocumentDto>(
    UPDATE_DOCUMENT_MUTATION,
    (result) => result.updateDocument,
  );

const DOCUMENT_SECTION_META: SectionMetaMap = {
  s1: { ...emptySectionMeta(), status: 'approved' },
  s2: { ...emptySectionMeta(), status: 'approved' },
  s3: { ...emptySectionMeta(), status: 'fix' },
  s4: { ...emptySectionMeta(), status: 'pending' },
  s5: { ...emptySectionMeta(), status: 'editing' },
  s6: { ...emptySectionMeta(), status: 'editing' },
};

const emptyPermissions = () => ({ approvers: [], editors: [] });

// ponytail: no backend/resolver yet — registered on stubLink, seeded from the
// same document tree main's Edit.tsx prototype used (MOCK_SECTIONS). Delete
// this registration once GetDocument has a real resolver; call sites don't
// change. The mock ignores $id beyond matching it against DOCS_FALLBACK for
// header fields — there is only one seed document tree today.
export const DOCUMENT_FALLBACK: DocumentDto = {
  id: 'd1',
  status: 'טיוטה',
  header: {
    name: 'נוהל בטיחות 2026',
    organization: 'ארגון א׳',
    template: 'נוהל',
    orderNum: '001',
    department: 'אגף מבצעים',
    effectiveDate: '10/05/2026',
    classification: 'בלמ"ס',
    referenceNum: '1001',
  },
  subjects: [
    {
      id: 's1',
      title: 'מטרה ורקע',
      sections: [
        {
          id: 's1-1',
          title: 'מטרת המסמך',
          content: '',
          permissions: emptyPermissions(),
          subSections: [],
        },
        {
          id: 's1-2',
          title: 'היסטוריית גרסאות',
          content: '',
          permissions: emptyPermissions(),
          subSections: [],
        },
      ],
    },
    {
      id: 's2',
      title: 'הגדרות ומונחים',
      sections: [
        {
          id: 's2-1',
          title: 'מונחים כלליים',
          content: '',
          permissions: emptyPermissions(),
          subSections: [],
        },
        {
          id: 's2-2',
          title: 'קיצורים',
          content: '',
          permissions: emptyPermissions(),
          subSections: [],
        },
      ],
    },
    {
      id: 's3',
      title: 'נהלים ותהליכים',
      sections: [
        {
          id: 's3-1',
          title: 'תהליך קבלת החלטות',
          content: '',
          permissions: emptyPermissions(),
          subSections: [],
        },
        {
          id: 's3-2',
          title: 'אחריות ותפקידים',
          content: '',
          permissions: emptyPermissions(),
          subSections: [],
        },
        {
          id: 's3-3',
          title: 'לוחות זמנים',
          content: '',
          permissions: emptyPermissions(),
          subSections: [],
        },
      ],
    },
    {
      id: 's4',
      title: 'הוראות ביצוע',
      sections: [
        {
          id: 's4-1',
          title: 'שלב א׳ – הכנה',
          content: '',
          permissions: emptyPermissions(),
          subSections: [],
        },
        {
          id: 's4-2',
          title: 'שלב ב׳ – ביצוע',
          content: '',
          permissions: emptyPermissions(),
          subSections: [],
        },
        {
          id: 's4-3',
          title: 'שלב ג׳ – בקרה',
          content: '',
          permissions: emptyPermissions(),
          subSections: [],
        },
      ],
    },
    { id: 's5', title: 'נספחים', sections: [] },
    { id: 's6', title: 'חתימות', sections: [] },
  ],
  sectionMeta: DOCUMENT_SECTION_META,
};

registerStub('GetDocument', (variables): GetDocumentResult => {
  const { id } = variables as unknown as GetDocumentVariables;
  const matchingDoc = DOCS_FALLBACK.docs.find((doc) => doc.id === id);
  if (!matchingDoc) return { document: DOCUMENT_FALLBACK };

  return {
    document: {
      ...DOCUMENT_FALLBACK,
      id: matchingDoc.id,
      status: matchingDoc.status,
      header: {
        ...DOCUMENT_FALLBACK.header,
        name: matchingDoc.name,
        organization: matchingDoc.environment,
        template: matchingDoc.docType,
        orderNum: matchingDoc.cmdNum,
        referenceNum: matchingDoc.refNum,
        effectiveDate: matchingDoc.lastUpdate,
      },
    },
  };
});

registerStub('UpdateDocument', (variables): UpdateDocumentResult => {
  const { input } = variables as unknown as UpdateDocumentVariables;
  Object.assign(DOCUMENT_FALLBACK, input);
  return { updateDocument: DOCUMENT_FALLBACK };
});
