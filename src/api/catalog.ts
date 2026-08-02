import { gql } from '@apollo/client';
import { useApiQuery } from './hooks';
import { registerStub } from './stubLink';

// Which shelf of the catalog a document sits on. This is a data partition, not
// only a tab — main keys its whole mock store by it (`Catalog.tsx:109`) — so it
// travels as a query variable rather than living in the page.
export type CatalogTab = 'drafts' | 'distribution' | 'distributed' | 'archive';

export interface CatalogDoc {
  id: string;
  name: string;
  type: string;
  orderNum: string;
  updateNum: string;
  effectiveDate: string;
  refNum: string;
  status: string;
  env?: string;
  dept?: string;
  folder?: string;
  // Distribution shelf only. main reads both of these out of hard-coded arrays
  // indexed by the row's position in the mock list (`Catalog.tsx:2130`, `2146`),
  // so they follow the slot rather than the document and scramble the moment
  // anything is filtered or sorted. Here they are properties of the document.
  approvedBy?: string;
  receiptStatus?: string;
  hasNewViewers?: boolean;
  children?: CatalogDoc[];
}

export interface TrashDoc extends CatalogDoc {
  daysLeft: number;
}

// The catalog's version row is not `DocVersionDto` from `./docs` — that one is
// the document page's sidebar list (label/datetime/ref/tag) and this one is a
// seven-column table. Two shapes, two queries, neither widened for the other.
export interface CatalogVersion {
  ver: string;
  orderNum: string;
  updateNum: string;
  status: string;
  date: string;
  refNum: string;
  approvedBy: string;
}

export interface HmlReceipt {
  name: string;
  seen: boolean;
  date?: string;
  time?: string;
  note?: string;
}

export const GET_CATALOG_DOCS_QUERY = gql`
  query GetCatalogDocs($tab: String!) {
    catalogDocs(tab: $tab) {
      id
      name
      type
      orderNum
      updateNum
      effectiveDate
      refNum
      status
      env
      dept
      folder
      approvedBy
      receiptStatus
      hasNewViewers
      children {
        id
        name
        type
        orderNum
        updateNum
        effectiveDate
        refNum
        status
        env
        dept
      }
    }
  }
`;

export interface GetCatalogDocsResult {
  catalogDocs: CatalogDoc[];
}

export interface GetCatalogDocsVariables {
  tab: CatalogTab;
}

export const useCatalogDocs = (tab: CatalogTab) =>
  useApiQuery<GetCatalogDocsResult, CatalogDoc[], GetCatalogDocsVariables>(
    GET_CATALOG_DOCS_QUERY,
    (result) => result.catalogDocs,
    { tab },
  );

export const CATALOG_DOCS_FALLBACK: Record<CatalogTab, CatalogDoc[]> = {
  drafts: [
    {
      id: 'd1',
      name: 'פקודת הכשרת אנשי צוות',
      type: 'פקודה',
      orderNum: '2024-001',
      updateNum: '3',
      effectiveDate: '15/03/2024',
      refNum: 'סימ-1234',
      status: 'בסבב אישורים',
      env: 'הסביבה שלי',
      dept: 'משאבי אנוש',
    },
    {
      id: 'd2',
      name: 'הוראת נהלי עבודה חדשים',
      type: 'הוראה',
      orderNum: '2024-002',
      updateNum: '1',
      effectiveDate: '20/03/2024',
      refNum: 'סימ-1235',
      status: 'בהכנה',
      env: 'הסביבה שלי',
      dept: 'כספים',
    },
    {
      id: 'd3',
      name: 'מסמך מדיניות אבטחת מידע',
      type: 'מסמך',
      orderNum: '2024-003',
      updateNum: '2',
      effectiveDate: '25/03/2024',
      refNum: 'סימ-1236',
      status: 'טיוטה פנימית',
      env: 'הסביבה שלי',
      dept: 'טכנולוגיה',
    },
    {
      id: 'd4',
      name: 'פקודת ניהול סיכונים',
      type: 'פקודה',
      orderNum: '2024-004',
      updateNum: '1',
      effectiveDate: '01/04/2024',
      refNum: 'סימ-1237',
      status: 'בסבב אישורים',
      env: 'משרד הבריאות',
      dept: 'משאבי אנוש',
    },
    {
      id: 'd5',
      name: 'הוראת תדרוך עובדים חדשים',
      type: 'הוראה',
      orderNum: '2024-005',
      updateNum: '4',
      effectiveDate: '05/04/2024',
      refNum: 'סימ-1238',
      status: 'בהכנה',
      env: 'משרד הביטחון',
      dept: 'כספים',
    },
    {
      id: 'd6',
      name: 'מסמך נהלי דיווח',
      type: 'מסמך',
      orderNum: '2024-006',
      updateNum: '1',
      effectiveDate: '10/04/2024',
      refNum: 'סימ-1239',
      status: 'טיוטה פנימית',
      env: 'הסביבה שלי',
      dept: 'טכנולוגיה',
    },
    {
      id: 'd7',
      name: 'פקודת תגובה לאירועים',
      type: 'פקודה',
      orderNum: '2024-007',
      updateNum: '2',
      effectiveDate: '15/04/2024',
      refNum: 'סימ-1240',
      status: 'נדחתה',
      env: 'משרד החינוך',
      dept: 'משאבי אנוש',
    },
    {
      id: 'd8',
      name: 'הוראת ניהול ציוד',
      type: 'הוראה',
      orderNum: '2024-008',
      updateNum: '1',
      effectiveDate: '20/04/2024',
      refNum: 'סימ-1241',
      status: 'נדרסה',
      env: 'ארגון א׳',
      dept: 'כספים',
    },
  ],
  distribution: [
    {
      id: 'p1',
      name: 'פקודת מבצע קיץ',
      type: 'פקודה',
      orderNum: '2024-101',
      updateNum: '5',
      effectiveDate: '01/05/2024',
      refNum: 'סימ-2001',
      status: 'ממתין להפצה',
      env: 'הסביבה שלי',
      dept: 'משאבי אנוש',
      folder: 'מבצע קיץ 2024',
      approvedBy: 's1234567',
      receiptStatus: '1/2',
      hasNewViewers: true,
    },
    {
      id: 'p2',
      name: 'הוראת בטיחות שגרתית',
      type: 'הוראה',
      orderNum: '2024-102',
      updateNum: '3',
      effectiveDate: '05/05/2024',
      refNum: 'סימ-2002',
      status: 'בסבב אישורים',
      env: 'הסביבה שלי',
      dept: 'טכנולוגיה',
      approvedBy: 's1234567',
      receiptStatus: '2/3',
      hasNewViewers: false,
    },
    {
      id: 'p3',
      name: 'מסמך תכנון שנתי',
      type: 'מסמך',
      orderNum: '2024-103',
      updateNum: '2',
      effectiveDate: '10/05/2024',
      refNum: 'סימ-2003',
      status: 'נדחתה',
      env: 'משרד הבריאות',
      dept: 'כספים',
      approvedBy: 's1234567',
      receiptStatus: '0/1',
      hasNewViewers: true,
    },
    {
      id: 'p4',
      name: 'פקודת סיום פעילות מבצע א׳',
      type: 'פקודה',
      orderNum: '2024-104',
      updateNum: '1',
      effectiveDate: '15/05/2024',
      refNum: 'סימ-2004',
      status: 'ממתין להפצה',
      env: 'משרד הביטחון',
      dept: 'משאבי אנוש',
      approvedBy: 's1234567',
      hasNewViewers: false,
    },
    {
      id: 'p5',
      name: 'הוראת ניהול אירועים',
      type: 'הוראה',
      orderNum: '2024-105',
      updateNum: '4',
      effectiveDate: '20/05/2024',
      refNum: 'סימ-2005',
      status: 'בסבב אישורים',
      env: 'הסביבה שלי',
      dept: 'כספים',
      approvedBy: 's1234567',
      receiptStatus: '1/4',
      hasNewViewers: true,
    },
    {
      id: 'p6',
      name: 'מסמך הנחיות לוגיסטיות',
      type: 'מסמך',
      orderNum: '2024-106',
      updateNum: '2',
      effectiveDate: '25/05/2024',
      refNum: 'סימ-2006',
      status: 'נדחתה',
      env: 'משרד החינוך',
      dept: 'טכנולוגיה',
      approvedBy: 's1234567',
      hasNewViewers: false,
    },
    {
      id: 'p7',
      name: 'פקודת עדכון נהלים',
      type: 'פקודה',
      orderNum: '2024-107',
      updateNum: '3',
      effectiveDate: '01/06/2024',
      refNum: 'סימ-2007',
      status: 'ממתין להפצה',
      env: 'ארגון א׳',
      dept: 'משאבי אנוש',
      approvedBy: 's1234567',
      receiptStatus: '3/3',
      hasNewViewers: false,
    },
    {
      id: 'p8',
      name: 'הוראת תפעול מיוחד',
      type: 'הוראה',
      orderNum: '2024-108',
      updateNum: '1',
      effectiveDate: '05/06/2024',
      refNum: 'סימ-2008',
      status: 'בסבב אישורים',
      env: 'הסביבה שלי',
      dept: 'טכנולוגיה',
      approvedBy: 's1234567',
      receiptStatus: '2/2',
      hasNewViewers: true,
    },
  ],
  distributed: [
    {
      id: 'r1',
      name: 'פקודת בטיחות מרחב א׳',
      type: 'פקודה',
      orderNum: '2024-201',
      updateNum: '7',
      effectiveDate: '10/01/2024',
      refNum: 'סימ-3001',
      status: 'מבצעית',
      env: 'הסביבה שלי',
      dept: 'משאבי אנוש',
      folder: 'נהלי בטיחות',
      children: [
        {
          id: 'r1-a',
          name: 'נספח א׳ — נהלי בטיחות שוטפים',
          type: 'נספח',
          orderNum: '2024-201/א',
          updateNum: '3',
          effectiveDate: '10/01/2024',
          refNum: 'סימ-3001/א',
          status: 'מבצעית',
          env: 'הסביבה שלי',
          dept: 'משאבי אנוש',
        },
        {
          id: 'r1-b',
          name: 'נספח ב׳ — טפסי דיווח אירועים',
          type: 'נספח',
          orderNum: '2024-201/ב',
          updateNum: '2',
          effectiveDate: '10/01/2024',
          refNum: 'סימ-3001/ב',
          status: 'מבצעית',
          env: 'הסביבה שלי',
          dept: 'משאבי אנוש',
        },
      ],
    },
    {
      id: 'r2',
      name: 'הוראת ניהול שגרה',
      type: 'הוראה',
      orderNum: '2024-202',
      updateNum: '5',
      effectiveDate: '15/01/2024',
      refNum: 'סימ-3002',
      status: 'מבצעית',
      env: 'משרד הבריאות',
      dept: 'כספים',
    },
    {
      id: 'r3',
      name: 'מסמך נהלי חירום',
      type: 'מסמך',
      orderNum: '2024-203',
      updateNum: '3',
      effectiveDate: '20/01/2024',
      refNum: 'סימ-3003',
      status: 'נצורה',
      env: 'הסביבה שלי',
      dept: 'טכנולוגיה',
    },
    {
      id: 'r4',
      name: 'פקודת תגובה לאירועי ביטחון',
      type: 'פקודה',
      orderNum: '2024-204',
      updateNum: '6',
      effectiveDate: '25/01/2024',
      refNum: 'סימ-3004',
      status: 'מבצעית',
      env: 'משרד הביטחון',
      dept: 'משאבי אנוש',
      children: [
        {
          id: 'r4-a',
          name: 'נספח — פרוטוקול תגובה מהירה',
          type: 'נספח',
          orderNum: '2024-204/א',
          updateNum: '1',
          effectiveDate: '25/01/2024',
          refNum: 'סימ-3004/א',
          status: 'מבצעית',
          env: 'משרד הביטחון',
          dept: 'משאבי אנוש',
        },
        {
          id: 'r4-b',
          name: 'נספח — רשימת גורמים מוסמכים',
          type: 'נספח',
          orderNum: '2024-204/ב',
          updateNum: '4',
          effectiveDate: '25/01/2024',
          refNum: 'סימ-3004/ב',
          status: 'נצורה',
          env: 'משרד הביטחון',
          dept: 'משאבי אנוש',
        },
        {
          id: 'r4-c',
          name: 'נספח — מפת אירועים',
          type: 'נספח',
          orderNum: '2024-204/ג',
          updateNum: '2',
          effectiveDate: '25/01/2024',
          refNum: 'סימ-3004/ג',
          status: 'מבצעית',
          env: 'משרד הביטחון',
          dept: 'משאבי אנוש',
        },
      ],
    },
    {
      id: 'r5',
      name: 'הוראת תדרוך שבועי',
      type: 'הוראה',
      orderNum: '2024-205',
      updateNum: '4',
      effectiveDate: '30/01/2024',
      refNum: 'סימ-3005',
      status: 'מבצעית',
      env: 'הסביבה שלי',
      dept: 'כספים',
    },
    {
      id: 'r6',
      name: 'מסמך הנחיות כלליות',
      type: 'מסמך',
      orderNum: '2024-206',
      updateNum: '2',
      effectiveDate: '05/02/2024',
      refNum: 'סימ-3006',
      status: 'נצורה',
      env: 'משרד החינוך',
      dept: 'טכנולוגיה',
    },
    {
      id: 'r7',
      name: 'פקודת ניהול כוח אדם',
      type: 'פקודה',
      orderNum: '2024-207',
      updateNum: '8',
      effectiveDate: '10/02/2024',
      refNum: 'סימ-3007',
      status: 'מבצעית',
      env: 'הסביבה שלי',
      dept: 'משאבי אנוש',
      folder: 'גיוס עובדים',
    },
    {
      id: 'r8',
      name: 'הוראת נוהל גיוס',
      type: 'הוראה',
      orderNum: '2024-208',
      updateNum: '3',
      effectiveDate: '15/02/2024',
      refNum: 'סימ-3008',
      status: 'מבצעית',
      env: 'ארגון א׳',
      dept: 'כספים',
    },
    {
      id: 'r9',
      name: 'מסמך מדיניות תקשורת',
      type: 'מסמך',
      orderNum: '2024-209',
      updateNum: '1',
      effectiveDate: '20/02/2024',
      refNum: 'סימ-3009',
      status: 'נצורה',
      env: 'משרד הבריאות',
      dept: 'טכנולוגיה',
    },
    {
      id: 'r10',
      name: 'פקודת עדכון כללי',
      type: 'פקודה',
      orderNum: '2024-210',
      updateNum: '5',
      effectiveDate: '25/02/2024',
      refNum: 'סימ-3010',
      status: 'מבצעית',
      env: 'הסביבה שלי',
      dept: 'משאבי אנוש',
    },
  ],
  archive: [
    {
      id: 'a1',
      name: 'פקודת מבצע חורף 2023',
      type: 'פקודה',
      orderNum: '2023-501',
      updateNum: '9',
      effectiveDate: '01/12/2023',
      refNum: 'סימ-4001',
      status: 'הסתיימה',
      env: 'הסביבה שלי',
      dept: 'משאבי אנוש',
      folder: 'מבצע חורף 2024',
    },
    {
      id: 'a2',
      name: 'הוראת נהלי 2022',
      type: 'הוראה',
      orderNum: '2022-502',
      updateNum: '6',
      effectiveDate: '15/12/2022',
      refNum: 'סימ-4002',
      status: 'התבטלה',
      env: 'משרד הבריאות',
      dept: 'כספים',
    },
    {
      id: 'a3',
      name: 'מסמך תכנון 2021',
      type: 'מסמך',
      orderNum: '2021-503',
      updateNum: '4',
      effectiveDate: '20/11/2021',
      refNum: 'סימ-4003',
      status: 'הסתיימה',
      env: 'הסביבה שלי',
      dept: 'טכנולוגיה',
    },
    {
      id: 'a4',
      name: 'פקודת סיום שנה',
      type: 'פקודה',
      orderNum: '2023-504',
      updateNum: '3',
      effectiveDate: '31/12/2023',
      refNum: 'סימ-4004',
      status: 'הסתיימה',
      env: 'משרד הביטחון',
      dept: 'משאבי אנוש',
    },
    {
      id: 'a5',
      name: 'הוראת ביטול נוהל ישן',
      type: 'הוראה',
      orderNum: '2022-505',
      updateNum: '2',
      effectiveDate: '30/06/2022',
      refNum: 'סימ-4005',
      status: 'התבטלה',
      env: 'ארגון א׳',
      dept: 'כספים',
    },
    {
      id: 'a6',
      name: 'מסמך ארכיוני שנתי',
      type: 'מסמך',
      orderNum: '2021-506',
      updateNum: '1',
      effectiveDate: '31/12/2021',
      refNum: 'סימ-4006',
      status: 'הסתיימה',
      env: 'הסביבה שלי',
      dept: 'טכנולוגיה',
    },
    {
      id: 'a7',
      name: 'פקודת חיסול ציוד',
      type: 'פקודה',
      orderNum: '2022-507',
      updateNum: '5',
      effectiveDate: '01/09/2022',
      refNum: 'סימ-4007',
      status: 'התבטלה',
      env: 'משרד החינוך',
      dept: 'משאבי אנוש',
    },
    {
      id: 'a8',
      name: 'הוראת סגירת שנה',
      type: 'הוראה',
      orderNum: '2023-508',
      updateNum: '2',
      effectiveDate: '31/12/2023',
      refNum: 'סימ-4008',
      status: 'הסתיימה',
      env: 'הסביבה שלי',
      dept: 'כספים',
    },
  ],
};

registerStub(
  'GetCatalogDocs',
  (variables): GetCatalogDocsResult => ({
    catalogDocs: CATALOG_DOCS_FALLBACK[variables.tab as CatalogTab] ?? [],
  }),
);

export const GET_TRASH_DOCS_QUERY = gql`
  query GetTrashDocs {
    trashDocs {
      id
      name
      type
      orderNum
      updateNum
      effectiveDate
      refNum
      status
      daysLeft
    }
  }
`;

export interface GetTrashDocsResult {
  trashDocs: TrashDoc[];
}

export const useTrashDocs = () =>
  useApiQuery<GetTrashDocsResult, TrashDoc[]>(GET_TRASH_DOCS_QUERY, (result) => result.trashDocs);

export const TRASH_DOCS_FALLBACK: TrashDoc[] = [
  {
    id: 'tr1',
    name: 'פקודת אימון חטיבה',
    type: 'פקודה',
    orderNum: '2024-099',
    updateNum: '2',
    effectiveDate: '10/02/2024',
    refNum: 'סימ-0099',
    status: 'טיוטה פנימית',
    daysLeft: 28,
  },
  {
    id: 'tr2',
    name: 'הוראת נוהל ישן',
    type: 'הוראה',
    orderNum: '2023-088',
    updateNum: '1',
    effectiveDate: '01/12/2023',
    refNum: 'סימ-0088',
    status: 'מבוטלת',
    daysLeft: 17,
  },
  {
    id: 'tr3',
    name: 'מסמך תקציב 2022',
    type: 'מסמך',
    orderNum: '2022-077',
    updateNum: '3',
    effectiveDate: '15/08/2022',
    refNum: 'סימ-0077',
    status: 'הסתיימה',
    daysLeft: 5,
  },
  {
    id: 'tr4',
    name: 'פקודת ביטול מבצע',
    type: 'פקודה',
    orderNum: '2024-033',
    updateNum: '1',
    effectiveDate: '20/01/2024',
    refNum: 'סימ-0033',
    status: 'מבוטלת',
    daysLeft: 12,
  },
  {
    id: 'tr5',
    name: 'הוראת ניהול ציוד מיושן',
    type: 'הוראה',
    orderNum: '2023-055',
    updateNum: '2',
    effectiveDate: '05/06/2023',
    refNum: 'סימ-0055',
    status: 'הסתיימה',
    daysLeft: 23,
  },
];

registerStub('GetTrashDocs', (): GetTrashDocsResult => ({ trashDocs: TRASH_DOCS_FALLBACK }));

export const GET_CATALOG_VERSIONS_QUERY = gql`
  query GetCatalogVersions($docId: ID!) {
    catalogVersions(docId: $docId) {
      ver
      orderNum
      updateNum
      status
      date
      refNum
      approvedBy
    }
  }
`;

export interface GetCatalogVersionsResult {
  catalogVersions: CatalogVersion[];
}

export interface GetCatalogVersionsVariables {
  docId: string;
}

export const useCatalogVersions = (docId: string) =>
  useApiQuery<GetCatalogVersionsResult, CatalogVersion[], GetCatalogVersionsVariables>(
    GET_CATALOG_VERSIONS_QUERY,
    (result) => result.catalogVersions,
    { docId },
    !docId,
  );

export const CATALOG_VERSIONS_FALLBACK: CatalogVersion[] = [
  {
    ver: '8',
    orderNum: '2024-001',
    updateNum: '8',
    status: 'מבצעית',
    date: '10/03/2024',
    refNum: 'סימ-1234',
    approvedBy: 'א. כהן',
  },
  {
    ver: '7',
    orderNum: '2024-001',
    updateNum: '7',
    status: 'נצורה',
    date: '02/03/2024',
    refNum: 'סימ-1234',
    approvedBy: 'מ. לוי',
  },
  {
    ver: '6',
    orderNum: '2024-001',
    updateNum: '6',
    status: 'נצורה',
    date: '20/02/2024',
    refNum: 'סימ-1233',
    approvedBy: 'ר. אברהם',
  },
  {
    ver: '5',
    orderNum: '2024-001',
    updateNum: '5',
    status: 'בסבב אישורים',
    date: '08/02/2024',
    refNum: 'סימ-1232',
    approvedBy: 'א. כהן',
  },
  {
    ver: '4',
    orderNum: '2024-001',
    updateNum: '4',
    status: 'בסבב אישורים',
    date: '28/01/2024',
    refNum: 'סימ-1231',
    approvedBy: 'י. שמיר',
  },
];

registerStub(
  'GetCatalogVersions',
  (): GetCatalogVersionsResult => ({ catalogVersions: CATALOG_VERSIONS_FALLBACK }),
);

export const GET_HML_RECEIPTS_QUERY = gql`
  query GetHmlReceipts($docId: ID!) {
    hmlReceipts(docId: $docId) {
      name
      seen
      date
      time
      note
    }
  }
`;

export interface GetHmlReceiptsResult {
  hmlReceipts: HmlReceipt[];
}

export interface GetHmlReceiptsVariables {
  docId: string;
}

export const useHmlReceipts = (docId: string) =>
  useApiQuery<GetHmlReceiptsResult, HmlReceipt[], GetHmlReceiptsVariables>(
    GET_HML_RECEIPTS_QUERY,
    (result) => result.hmlReceipts,
    { docId },
    !docId,
  );

export const HML_RECEIPTS_FALLBACK: HmlReceipt[] = [
  { name: 'חמ״ל רפואה', seen: true, date: '10/03/2024', time: '08:32', note: 'התקבל ואושר' },
  { name: 'חמ״ל לוגיסטיקה', seen: true, date: '10/03/2024', time: '09:15' },
  { name: 'חמ״ל תקשוב', seen: false },
  { name: 'חמ״ל הנדסה', seen: false },
  { name: 'חמ״ל מודיעין', seen: true, date: '11/03/2024', time: '14:47', note: 'מאושר לביצוע' },
  { name: 'חמ״ל תפעול', seen: false },
];

registerStub(
  'GetHmlReceipts',
  (): GetHmlReceiptsResult => ({ hmlReceipts: HML_RECEIPTS_FALLBACK }),
);

// Every catalog document across all four shelves, flattened — what main's
// `ALL_DOCS_POOL` (`Catalog.tsx:510`) feeds to the duplicate-search and
// hierarchy pickers.
export const ALL_CATALOG_DOCS: CatalogDoc[] = Object.values(CATALOG_DOCS_FALLBACK).flat();
