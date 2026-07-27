import { gql } from '@apollo/client';
import type { DocItem } from '@/modals/MailingListModal';
import {
  type DocumentDto,
  emptySectionMeta,
  type NodeStamp,
  type SectionMeta,
  type SectionMetaMap,
  type SectionStatus,
  type SourceOrigin,
} from '@/pages/document/types';
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

// main's SOURCE_MAP (Edit.tsx:4989-4998), split into its document-level list
// and its three per-section entries. Verbatim — these strings are what the
// source-systems modal renders.
export const DOCUMENT_SOURCE_SYSTEMS: SourceOrigin[] = [
  { name: 'מערכת כוח אדם', field: 'נתוני כוח אדם ותפקידים' },
  { name: 'מערכת ניהול תחמושת', field: 'מלאי ציוד' },
  { name: 'מערכת לוגיסטיקה', field: 'תהליכי שילוח ואספקה' },
];

// main's SECTIONS_WITH_SOURCE (Edit.tsx:3513) is the key set of this map: only
// these three nodes get an enabled refresh-from-source button.
const SECTION_SOURCE_ORIGIN: Record<string, SourceOrigin[]> = {
  's1-1': [{ name: 'מערכת כוח אדם', field: 'נתוני כוח אדם ותפקידים' }],
  's2-1': [{ name: 'מערכת ניהול תחמושת', field: 'מלאי ציוד ותחמושת' }],
  's3-1': [{ name: 'מערכת לוגיסטיקה', field: 'תהליכי שילוח ואספקה' }],
};

// main stamps every node header with the same hardcoded value (Edit.tsx:4265).
const SEED_STAMP: NodeStamp = { at: '25-06-2026 11:18', by: 's2345678' };

const seedMeta = (status: SectionStatus, id?: string): SectionMeta => ({
  ...emptySectionMeta(),
  status,
  lastModified: SEED_STAMP,
  ...(id && SECTION_SOURCE_ORIGIN[id] ? { sourceOrigin: SECTION_SOURCE_ORIGIN[id] } : {}),
});

// Keyed by both subject id (s1..s6 — read by DocumentOutlineTree's subject
// rows) and a representative sample of actual section ids (s1-1, s3-1, ... —
// read by EditableSectionBody's status badge and by FilterPanel's status
// filter). Seeding subject ids alone left every real section/subSection
// falling through to emptySectionMeta()'s 'idle' default, which made the
// status filter feature look non-functional against this seed data (every
// status except 'idle' matched nothing) even though the feature itself
// works correctly once a section actually carries a status.
const DOCUMENT_SECTION_META: SectionMetaMap = {
  s1: seedMeta('approved'),
  s2: seedMeta('approved'),
  s3: seedMeta('fix'),
  s4: seedMeta('pending'),
  s5: seedMeta('editing'),
  s6: seedMeta('editing'),
  's1-1': seedMeta('approved', 's1-1'),
  's1-2': seedMeta('approved'),
  's2-1': seedMeta('approved', 's2-1'),
  's3-1': seedMeta('fix', 's3-1'),
  's3-2': seedMeta('fix'),
  's4-1': seedMeta('pending'),
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
  // Verbatim from main's metadata pill (Edit.tsx:3692-3700). main hardcodes
  // every field here except name and orderNum, which it reads off the doc —
  // getOrCreateDocument below overrides exactly those two (plus organization,
  // which is 'ארגון א׳' for the seed document either way).
  header: {
    name: 'נוהל בטיחות 2026',
    organization: 'ארגון א׳',
    template: 'מסמך בטיחות',
    orderNum: '001',
    department: 'משאבי אנוש',
    effectiveDate: '01/06/2026',
    classification: 'בלמ״ס',
    referenceNum: 'פ.מ. 12/2025',
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
  sourceSystems: DOCUMENT_SOURCE_SYSTEMS,
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
        // Only the fields main actually reads off the document. template /
        // effectiveDate / referenceNum / department stay on the hardcoded
        // header above, because that is what main's pill renders — pulling
        // them from DOCS_FALLBACK instead would silently change the pill.
        header: {
          ...DOCUMENT_FALLBACK.header,
          name: matchingDoc.name,
          organization: matchingDoc.environment,
          orderNum: matchingDoc.cmdNum,
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
      recent {
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
  // `recent` exists in main's IMPORT_DOCS but its ImportDocModal only ever
  // renders drafts/distributed, so the data is restored here for fidelity
  // while the modal keeps main's two visible tabs.
  importDocs: { drafts: ImportDocItem[]; distributed: ImportDocItem[]; recent: ImportDocItem[] };
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
      { id: 'id4', name: 'נוהל רכש ואספקה', org: 'ארגון ג׳', date: '03/05/2026', status: 'טיוטה' },
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
      {
        id: 'pd3',
        name: 'פקודה 31/2025 – תקנון',
        org: 'ארגון א׳',
        date: '10/01/2026',
        status: 'הופץ',
      },
    ],
    recent: [
      { id: 'rd1', name: 'נהלי עבודה', org: 'ארגון א׳', date: '09/05/2026', status: 'בהכנה' },
      { id: 'rd2', name: 'דוחות שנתיים', org: 'ארגון ב׳', date: '07/05/2026', status: 'הופץ' },
      { id: 'rd3', name: 'מסמכי תקציב 2026', org: 'ארגון א׳', date: '06/05/2026', status: 'טיוטה' },
      { id: 'rd4', name: 'נהלי בטיחות', org: 'ארגון ג׳', date: '04/05/2026', status: 'הופץ' },
    ],
  },
};

registerStub('GetImportDocs', (): GetImportDocsResult => IMPORT_DOCS_FALLBACK);

export const GET_IMPORT_DOC_SECTIONS_QUERY = gql`
  query GetImportDocSections($docId: ID!) {
    importDocSections(docId: $docId) {
      id
      label
      title
      body
    }
  }
`;

// A section offered for import carries its label and body paragraphs, not just
// a title — main's ImportDocModal renders the body in its split-view preview.
export interface ImportDocSectionDto {
  id: string;
  label: string;
  title: string;
  body: string[];
}

export interface GetImportDocSectionsResult {
  importDocSections: ImportDocSectionDto[];
}

export interface GetImportDocSectionsVariables {
  docId: string;
}

export const useImportDocSections = (docId: string) =>
  useApiQuery<GetImportDocSectionsResult, ImportDocSectionDto[], GetImportDocSectionsVariables>(
    GET_IMPORT_DOC_SECTIONS_QUERY,
    (result) => result.importDocSections,
    { docId },
    !docId,
  );

// main's IMPORT_DOC_SECTIONS (Edit.tsx:1802-1808), verbatim. main keeps one
// flat list and shows it for whichever document is selected, so the resolver
// below returns this same array for every docId rather than inventing
// per-document titles. The query stays parameterised because a real resolver
// genuinely will vary by document.
export const IMPORT_DOC_SECTIONS_FALLBACK: ImportDocSectionDto[] = [
  {
    id: 'is1',
    label: '1',
    title: 'מטרה ורקע',
    body: [
      'נוהל זה מגדיר את נהלי הבטיחות בארגון ומוודא שכל העובדים פועלים בהתאם לתקנות הרלוונטיות.',
    ],
  },
  {
    id: 'is2',
    label: '2',
    title: 'הגדרות ומונחים',
    body: [
      'בטיחות – מכלול הפעולות לשמירה על שלמות גוף העובד ורכוש הארגון.',
      'ציוד מגן אישי – ציוד הנדרש לשמירה על בריאות ובטיחות העובדים.',
    ],
  },
  {
    id: 'is3',
    label: '3',
    title: 'נהלים ותהליכים',
    body: ['כל עובד יעבור הדרכת בטיחות לפני תחילת עבודתו. תדירות ההדרכות – אחת לשנה לפחות.'],
  },
  {
    id: 'is4',
    label: '4',
    title: 'הוראות ביצוע',
    body: [
      'א. עובד חדש יקבל הדרכת בטיחות ביום הראשון לעבודתו.',
      'ב. כל תקלה בטיחותית תדווח למנהל הישיר תוך שעה מגילויה.',
    ],
  },
  {
    id: 'is5',
    label: '5',
    title: 'נספחים',
    body: ['נספח א׳ – טופס דיווח תאונת עבודה.'],
  },
];

registerStub(
  'GetImportDocSections',
  (): GetImportDocSectionsResult => ({ importDocSections: IMPORT_DOC_SECTIONS_FALLBACK }),
);

// --- Deleted sections (restore panel) ---

export interface DeletedSectionDto {
  id: string;
  label: string;
  title: string;
  children?: { id: string; label: string; title: string }[];
}

export const GET_DELETED_SECTIONS_QUERY = gql`
  query GetDeletedSections($docId: ID!) {
    deletedSections(docId: $docId) {
      id
      label
      title
      children {
        id
        label
        title
      }
    }
  }
`;

export interface GetDeletedSectionsResult {
  deletedSections: DeletedSectionDto[];
}

export interface GetDeletedSectionsVariables {
  docId: string;
}

export const useDeletedSections = (docId: string) =>
  useApiQuery<GetDeletedSectionsResult, DeletedSectionDto[], GetDeletedSectionsVariables>(
    GET_DELETED_SECTIONS_QUERY,
    (result) => result.deletedSections,
    { docId },
    !docId,
  );

// main's DELETED_SECTIONS (Edit.tsx:157-169), verbatim — the restore panel's
// seed. RestoreModal also tracks sections deleted in the current session; this
// is the server-side trash that predates the session.
export const DELETED_SECTIONS_FALLBACK: DeletedSectionDto[] = [
  {
    id: 'p1',
    label: '3',
    title: 'נהלים ותהליכים',
    children: [
      { id: 'p1-1', label: '3.1', title: 'תהליך קבלת החלטות' },
      { id: 'p1-2', label: '3.2', title: 'אחריות ותפקידים' },
      { id: 'p1-3', label: '3.3', title: 'לוחות זמנים' },
    ],
  },
  { id: 'd1', label: '2.3', title: 'הגדרות נוספות' },
  { id: 'd3', label: '4.4', title: 'שלב ד׳ – סיום' },
  { id: 'd4', label: '1.3', title: 'הקשר היסטורי' },
];

registerStub(
  'GetDeletedSections',
  (): GetDeletedSectionsResult => ({ deletedSections: DELETED_SECTIONS_FALLBACK }),
);

// --- Document versions (version picker → comparison mode) ---

export interface DocVersionDto {
  label: string;
  datetime: string;
  ref: string;
  approvedBy: string;
  /** 'נוכחית' on the live version, empty otherwise. */
  tag: string;
}

export const GET_DOC_VERSIONS_QUERY = gql`
  query GetDocVersions($docId: ID!) {
    docVersions(docId: $docId) {
      label
      datetime
      ref
      approvedBy
      tag
    }
  }
`;

export interface GetDocVersionsResult {
  docVersions: DocVersionDto[];
}

export interface GetDocVersionsVariables {
  docId: string;
}

export const useDocVersions = (docId: string) =>
  useApiQuery<GetDocVersionsResult, DocVersionDto[], GetDocVersionsVariables>(
    GET_DOC_VERSIONS_QUERY,
    (result) => result.docVersions,
    { docId },
    !docId,
  );

// Verbatim from main's version-compare picker (TopNavbar.tsx:1682-1685).
export const DOC_VERSIONS_FALLBACK: DocVersionDto[] = [
  {
    label: 'עדכון מס׳ 2',
    datetime: '14.07.2026, 09:32',
    ref: 'א׳-2026-147',
    approvedBy: 'אל״מ דוד כהן',
    tag: 'נוכחית',
  },
  {
    label: 'עדכון מס׳ 1',
    datetime: '01.06.2026, 14:15',
    ref: 'א׳-2026-088',
    approvedBy: 'אל״מ דוד כהן',
    tag: '',
  },
  {
    label: 'פקודה מס׳ 001',
    datetime: '15.03.2026, 11:00',
    ref: 'א׳-2026-031',
    approvedBy: 'תא״ל רונן לוי',
    tag: '',
  },
];

registerStub(
  'GetDocVersions',
  (): GetDocVersionsResult => ({ docVersions: DOC_VERSIONS_FALLBACK }),
);
