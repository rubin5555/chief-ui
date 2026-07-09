export const BODY_TYPE_OPTIONS: string[] = ['ארגון', 'אגף', 'מחלקה'];

export const ENV_PEOPLE_OPTIONS: string[] = [
  'אבי כהן',
  'שרה לוי',
  'משה ישראלי',
  'רחל דוד',
  'יוסף מזרחי',
  'מירי פרץ',
  'דני אברהם',
  'לאה כץ',
  'אורן שמש',
  'נועה גרין',
  'יעקב בן-דוד',
  'תמר ברק',
  'עמי שלו',
  'ריקי נחום',
  'גיל אלון',
];

export const APPROVER_RANKS = ['סא״ל', 'אל״ם', 'תא״ל', 'אלוף', 'רא״ל'] as const;
export type ApproverRank = (typeof APPROVER_RANKS)[number];

export const TEMPLATE_OPTIONS: string[] = [
  'תבנית פקודה כללית',
  'תבנית דוח שבועי',
  'תבנית הודעה',
  'תבנית דוח חודשי',
];

export const DEPARTMENT_OPTIONS: string[] = [
  'מחלקת משאבי אנוש',
  'מחלקת כספים',
  'מחלקת טכנולוגיה',
  'מחלקת תפעול',
  'מחלקת שיווק',
  'מחלקת מכירות',
];

export const CREATOR_SLOTS = [0, 1, 2] as const;

export interface EnvironmentRequestForm {
  bodyType: string;
  name: string;
  logoPreview: string;
  creators: string[];
  approvers: Record<ApproverRank, string[]>;
  distributors: string[];
  mobilePhone: string;
  redPhone: string;
  templates: string[];
  departments: string[];
}

export const createEmptyEnvironmentRequestForm = (): EnvironmentRequestForm => ({
  bodyType: '',
  name: '',
  logoPreview: '',
  creators: [],
  approvers: APPROVER_RANKS.reduce(
    (acc, rank) => {
      acc[rank] = [];
      return acc;
    },
    {} as Record<ApproverRank, string[]>,
  ),
  distributors: [],
  mobilePhone: '',
  redPhone: '',
  templates: [],
  departments: [],
});
