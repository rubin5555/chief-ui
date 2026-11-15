export interface FolderNode {
  id: string;
  name: string;
  subs: string[];
  subCollapsed: boolean;
  docs?: number;
}

export interface OrgGroup {
  name: string;
  depts: string[];
}

export const MY_ENV_NAME = 'הסביבה שלי';
export const GUIDE_ENV_NAME = 'מורה נבוכים';
export const ALL_DOCS = 'כל המסמכים';

export const MY_DEPTS = ['מחלקת משאבי אנוש', 'מחלקת כספים', 'מחלקת טכנולוגיה'];

export const MAIN_ORGS = ['משרד הבריאות', 'משרד הביטחון', 'משרד החינוך', 'משרד הפנים'];

export const OTHER_ORGS: OrgGroup[] = [
  { name: 'ארגון א׳', depts: ['מחלקת תפעול', 'מחלקת לוגיסטיקה', 'מחלקת הנדסה'] },
  { name: 'ארגון ב׳', depts: ['מחלקת מודיעין', 'מחלקת תקשוב'] },
  { name: 'ארגון ג׳', depts: ['מחלקת מחקר', 'מחלקת פיתוח'] },
  { name: 'ארגון ד׳', depts: ['מחלקת שיווק', 'מחלקת מכירות', 'מחלקת תמיכה'] },
];

export const SECTION = {
  myEnvironment: 'myEnvironment',
  additionalEnvironments: 'additionalEnvironments',
  allDocuments: 'allDocuments',
  mainDocuments: 'mainDocuments',
  guide: 'guide',
} as const;

export type SectionKey = (typeof SECTION)[keyof typeof SECTION];

export const SECTION_LABEL: Record<SectionKey, string> = {
  myEnvironment: 'הסביבה שלי',
  additionalEnvironments: 'סביבות נוספות',
  allDocuments: 'כל המסמכים',
  mainDocuments: 'מסמכים ראשיים',
  guide: 'מורה נבוכים',
};

export const GUIDE_ITEMS = ['מדיניות', 'הוראות'] as const;
export type GuideItem = (typeof GUIDE_ITEMS)[number];

// The guide's two entries render the department list rather than a folder list,
// and neither they nor `כל המסמכים` may be edited.
export const isGuideDept = (dept: string): dept is GuideItem =>
  (GUIDE_ITEMS as readonly string[]).includes(dept);

export const isReadOnlyDept = (dept: string) => dept === ALL_DOCS || isGuideDept(dept);

// Which nav section a department belongs to, so opening `/catalog?dept=…`
// straight from a link expands the right section without an effect syncing it
// after the fact.
export const sectionForDept = (dept: string): SectionKey | null => {
  if (!dept) return null;
  if (MY_DEPTS.includes(dept)) return SECTION.myEnvironment;
  if (MAIN_ORGS.includes(dept)) return SECTION.mainDocuments;
  if (dept === ALL_DOCS) return SECTION.allDocuments;
  if (isGuideDept(dept)) return SECTION.guide;
  if (OTHER_ORGS.some((org) => org.name === dept || org.depts.includes(dept))) {
    return SECTION.additionalEnvironments;
  }
  return null;
};

export const orgForDept = (dept: string) =>
  OTHER_ORGS.find((org) => org.depts.includes(dept))?.name ?? null;

// The label shown above the department name in folder view.
export const envForDept = (dept: string) => {
  if (MY_DEPTS.includes(dept)) return MY_ENV_NAME;
  if (isGuideDept(dept)) return GUIDE_ENV_NAME;
  return orgForDept(dept) ?? dept;
};

export const SEED_FOLDERS: Record<string, Omit<FolderNode, 'id'>[]> = {
  'מחלקת משאבי אנוש': [
    { name: 'מבצע קיץ 2024', subs: ['שלב א׳', 'שלב ב׳'], subCollapsed: false, docs: 3 },
    { name: 'נהלי בטיחות', subs: [], subCollapsed: false, docs: 5 },
    { name: 'גיוס עובדים', subs: [], subCollapsed: false, docs: 2 },
    { name: 'הדרכות שנתיות', subs: [], subCollapsed: false, docs: 4 },
    { name: 'נהלי שכר', subs: [], subCollapsed: false, docs: 6 },
    { name: 'הסכמי העסקה', subs: [], subCollapsed: false, docs: 1 },
    { name: 'ביקורות פנימיות', subs: [], subCollapsed: false, docs: 3 },
    { name: 'מבצע חורף 2024', subs: [], subCollapsed: false, docs: 2 },
    { name: 'פרוטוקולי ועדה', subs: [], subCollapsed: false, docs: 7 },
    { name: 'תכניות עבודה', subs: [], subCollapsed: false, docs: 4 },
  ],
  'מחלקת כספים': [
    { name: 'תקציב שנתי', subs: [], subCollapsed: false, docs: 8 },
    { name: 'דיווחים רבעוניים', subs: [], subCollapsed: false, docs: 4 },
    { name: 'ביקורת חשבונות', subs: [], subCollapsed: false, docs: 3 },
    { name: 'הוצאות שוטפות', subs: [], subCollapsed: false, docs: 2 },
    { name: 'רכש וספקים', subs: [], subCollapsed: false, docs: 5 },
    { name: 'השקעות', subs: [], subCollapsed: false, docs: 1 },
    { name: 'דוחות שנתיים', subs: [], subCollapsed: false, docs: 6 },
    { name: 'תחזיות תקציב', subs: [], subCollapsed: false, docs: 3 },
  ],
  'מחלקת טכנולוגיה': [
    { name: 'פרויקטים פעילים', subs: [], subCollapsed: false, docs: 5 },
    { name: 'תשתיות רשת', subs: [], subCollapsed: false, docs: 3 },
    { name: 'אבטחת מידע', subs: [], subCollapsed: false, docs: 4 },
  ],
  [ALL_DOCS]: [
    {
      name: 'הסביבה שלי',
      subs: ['מחלקת משאבי אנוש', 'מחלקת כספים', 'מחלקת טכנולוגיה'],
      subCollapsed: true,
      docs: 15,
    },
    {
      name: 'ארגון א׳',
      subs: ['מחלקת תפעול', 'מחלקת לוגיסטיקה', 'מחלקת הנדסה'],
      subCollapsed: true,
      docs: 9,
    },
    { name: 'ארגון ב׳', subs: ['מחלקת מודיעין', 'מחלקת תקשוב'], subCollapsed: true, docs: 6 },
    { name: 'ארגון ג׳', subs: ['מחלקת מחקר', 'מחלקת פיתוח'], subCollapsed: true, docs: 7 },
    {
      name: 'ארגון ד׳',
      subs: ['מחלקת שיווק', 'מחלקת מכירות', 'מחלקת תמיכה'],
      subCollapsed: true,
      docs: 5,
    },
  ],
};

export const EMPTY_FOLDERS_TEXT = 'אין תיקיות עדיין';
export const BACK_TO_MENU_TEXT = 'חזור לתפריט';
export const NEW_FOLDER_TEXT = 'תיקייה חדשה';
