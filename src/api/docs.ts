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

// Keyed by both subject id (s1..s6 — read by DocumentOutlineTree's subject
// rows) and a representative sample of actual section ids (s1-1, s3-1, ... —
// read by EditableSectionBody's status badge and by FilterPanel's status
// filter). Seeding subject ids alone left every real section/subSection
// falling through to emptySectionMeta()'s 'idle' default, which made the
// status filter feature look non-functional against this seed data (every
// status except 'idle' matched nothing) even though the feature itself
// works correctly once a section actually carries a status.
const DOCUMENT_SECTION_META: SectionMetaMap = {
  s1: { ...emptySectionMeta(), status: 'approved' },
  s2: { ...emptySectionMeta(), status: 'approved' },
  s3: { ...emptySectionMeta(), status: 'fix' },
  s4: { ...emptySectionMeta(), status: 'pending' },
  s5: { ...emptySectionMeta(), status: 'editing' },
  s6: { ...emptySectionMeta(), status: 'editing' },
  's1-1': { ...emptySectionMeta(), status: 'approved' },
  's1-2': { ...emptySectionMeta(), status: 'approved' },
  's3-1': { ...emptySectionMeta(), status: 'fix' },
  's3-2': { ...emptySectionMeta(), status: 'fix' },
  's4-1': { ...emptySectionMeta(), status: 'pending' },
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

// Keyed per document id rather than mutating the single shared
// DOCUMENT_FALLBACK object directly — every id currently renders identical
// seed content (there's only one mock tree), but without this, editing
// document A and then loading document B in the same session would leak
// A's edited subjects/sectionMeta into B once UpdateDocument is wired up.
const documentStore: Record<string, DocumentDto> = {};

const getOrCreateDocument = (id: string): DocumentDto => {
  const existing = documentStore[id];
  if (existing) return existing;

  const matchingDoc = DOCS_FALLBACK.docs.find((doc) => doc.id === id);
  const created: DocumentDto = matchingDoc
    ? {
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
      }
    : { ...DOCUMENT_FALLBACK };
  documentStore[id] = created;
  return created;
};

registerStub('GetDocument', (variables): GetDocumentResult => {
  const { id } = variables as unknown as GetDocumentVariables;
  return { document: getOrCreateDocument(id) };
});

registerStub('UpdateDocument', (variables): UpdateDocumentResult => {
  const { id, input } = variables as unknown as UpdateDocumentVariables;
  const document = Object.assign(getOrCreateDocument(id), input);
  return { updateDocument: document };
});

// --- Import (Phase 7): pick sections from another document to copy in ---

export interface ImportDocItem {
  id: string;
  name: string;
  org: string;
  date: string;
  status: string;
}

export const GET_IMPORT_DOCS_QUERY = gql`
  query GetImportDocs {
    importDocs {
      drafts {
        id
        name
        org
        date
        status
      }
      distributed {
        id
        name
        org
        date
        status
      }
    }
  }
`;

export interface GetImportDocsResult {
  importDocs: { drafts: ImportDocItem[]; distributed: ImportDocItem[] };
}

export const useImportDocs = () =>
  useApiQuery(GET_IMPORT_DOCS_QUERY, (result: GetImportDocsResult) => result.importDocs);

// ponytail: no backend/resolver yet — registered on stubLink, seeded from the
// same IMPORT_DOCS mock main's Edit.tsx ImportDocModal used. Delete this
// registration once GetImportDocs has a real resolver; call sites don't change.
export const IMPORT_DOCS_FALLBACK: GetImportDocsResult = {
  importDocs: {
    drafts: [
      { id: 'id1', name: 'נוהל בטיחות 2026', org: 'ארגון א׳', date: '10/05/2026', status: 'טיוטה' },
      { id: 'id2', name: 'נוהל גיוס עובדים', org: 'ארגון ב׳', date: '08/05/2026', status: 'בהכנה' },
      { id: 'id3', name: 'תקנון משמעת', org: 'ארגון א׳', date: '05/05/2026', status: 'טיוטה' },
    ],
    distributed: [
      {
        id: 'pd1',
        name: 'פקודה 42/2025 – נהלי בטיחות',
        org: 'ארגון א׳',
        date: '01/03/2026',
        status: 'הופץ',
      },
      {
        id: 'pd2',
        name: 'פקודה 38/2025 – גיוס ושיבוץ',
        org: 'ארגון ב׳',
        date: '15/02/2026',
        status: 'הופץ',
      },
    ],
  },
};

registerStub('GetImportDocs', (): GetImportDocsResult => IMPORT_DOCS_FALLBACK);

export const GET_IMPORT_DOC_SECTIONS_QUERY = gql`
  query GetImportDocSections($docId: ID!) {
    importDocSections(docId: $docId)
  }
`;

export interface GetImportDocSectionsResult {
  importDocSections: string[];
}

export interface GetImportDocSectionsVariables {
  docId: string;
}

export const useImportDocSections = (docId: string) =>
  useApiQuery<GetImportDocSectionsResult, string[], GetImportDocSectionsVariables>(
    GET_IMPORT_DOC_SECTIONS_QUERY,
    (result) => result.importDocSections,
    { docId },
    !docId,
  );

const IMPORT_DOC_SECTIONS_FALLBACK: Record<string, string[]> = {
  id1: ['מטרת הנוהל', 'תחולה', 'אחריות ותפקידים'],
  id2: ['שלבי הגיוס', 'ראיונות', 'קליטה'],
  id3: ['הפרות משמעת', 'הליך בירור', 'סנקציות'],
  pd1: ['רקע', 'הוראות בטיחות כלליות', 'ציוד מגן'],
  pd2: ['מכסות גיוס', 'שיבוץ ליחידות'],
};

registerStub('GetImportDocSections', (variables): GetImportDocSectionsResult => {
  const { docId } = variables as unknown as GetImportDocSectionsVariables;
  return { importDocSections: IMPORT_DOC_SECTIONS_FALLBACK[docId] ?? [] };
});
