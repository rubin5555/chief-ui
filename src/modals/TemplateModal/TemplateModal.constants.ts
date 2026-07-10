import type { ReactFormExtendedApi } from '@tanstack/react-form';
import type {
  NodePermissions,
  Section,
  Subject,
  SubSection,
  useDocumentTree,
} from '@/hooks/useDocumentTree';
import type { DynamicField } from '@/modals/DataImportModal';

export type { NodePermissions, Section, Subject, SubSection };

export type TemplateModalMode = 'new' | 'edit' | 'duplicate';

export type DocumentTreeApi = ReturnType<typeof useDocumentTree>;

// Appendices share the exact id/title/content/permissions shape as a subsection —
// no separate type needed.
export type Appendix = SubSection;

export interface PermissionsTarget {
  id: string;
  label: string;
  permissions: NodePermissions;
  onChangeApprovers: (value: string[]) => void;
  onChangeEditors: (value: string[]) => void;
}

export const HE_ALPHA = [
  'א',
  'ב',
  'ג',
  'ד',
  'ה',
  'ו',
  'ז',
  'ח',
  'ט',
  'י',
  'כ',
  'ל',
  'מ',
  'נ',
  'ס',
  'ע',
  'פ',
  'צ',
];

export type TemplateDocType = 'command' | 'instruction' | 'document';

export interface TemplateDocTypeOption {
  id: TemplateDocType;
  label: string;
  disabled?: boolean;
}

export const TEMPLATE_DOC_TYPE_OPTIONS: TemplateDocTypeOption[] = [
  { id: 'command', label: 'פקודה' },
  { id: 'instruction', label: 'הוראה', disabled: true },
  { id: 'document', label: 'מסמך', disabled: true },
];

export const CLASSIFICATION_OPTIONS = ['בלמ"ס', 'סודי', 'סודי ביותר', 'סודי ביותר לשו"ס'];

export const HIGH_CLASSIFICATIONS = ['סודי ביותר', 'סודי ביותר לשו"ס'];

export const CLASSIFICATION_TAG_OPTIONS: Record<string, string[]> = {
  'סודי ביותר': ['ללא', 'תגית א׳', 'תגית ב׳'],
  'סודי ביותר לשו"ס': ['תגית א׳', 'תגית ב׳'],
};

export const FOLDER_OPTIONS = ['תיקיית פקודות', 'תיקיית דוחות', 'תיקיית הוראות', 'תיקייה כללית'];

export const PERMISSION_NAME_OPTIONS = [
  'אבי כהן',
  'שרה לוי',
  'יוסי מזרחי',
  'רחל גולן',
  'דניאל שמש',
  'מיכל ברק',
  'נועם שפירא',
  'תמר אלון',
  'צוות פיתוח',
  'צוות תפעול',
  'מחלקת ביטחון',
  'הנהלה',
  'צוות לוגיסטיקה',
  'מחלקת מבצעים',
  'רשימת מנהלים',
  'רשימת טכנאים',
  'רשימת מאשרים',
  'רשימת עדכונים',
  'רשימת תפוצה כללית',
];

export const MODAL_TITLES: Record<TemplateModalMode, string> = {
  new: 'תבנית חדשה',
  edit: 'עריכת תבנית',
  duplicate: 'שכפול תבנית',
};

export const SAVE_LABELS: Record<TemplateModalMode, string> = {
  new: 'צור תבנית',
  edit: 'שמור שינויים',
  duplicate: 'שכפל',
};

export interface TemplateFormValues {
  name: string;
  docType: TemplateDocType | null;
  department: string;
  folder: string;
  approvalRoundsEnabled: boolean;
  classification: string;
  classificationTag: string;
  effectiveFrom: string;
  expiryTo: string;
}

const pad = (value: number) => String(value).padStart(2, '0');

export const nowDateTimeLocal = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
};

// The trailing generics only parameterize optional validator functions we don't use —
// `any` here matches the library's own internal pattern for a validator-agnostic form
// reference (see @tanstack/react-form's useFormContext implementation).
export type TemplateFormApi = ReactFormExtendedApi<
  TemplateFormValues,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
>;

export interface TemplateDraft {
  mode: TemplateModalMode;
  values: TemplateFormValues;
  subjects: Subject[];
  appendices: Appendix[];
  fields: DynamicField[];
  emphasis: { enabled: boolean; text: string };
}

export const emptyTemplateFormValues = (initialName = ''): TemplateFormValues => ({
  name: initialName,
  docType: 'command',
  department: '',
  folder: '',
  approvalRoundsEnabled: true,
  classification: '',
  classificationTag: '',
  effectiveFrom: nowDateTimeLocal(),
  expiryTo: '',
});
