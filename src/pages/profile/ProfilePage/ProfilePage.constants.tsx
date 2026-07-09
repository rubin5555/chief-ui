import {
  CheckCircle,
  Eye,
  FileText,
  Folder,
  PenLine,
  Search,
  Send,
  Share2,
  UserCog,
} from 'lucide-react';
import type { Tab } from '../components/ProfileContent';
import type { ListEntry, ProfileInfo } from '../components/ProfileSidebar';
import type { DistributionList } from '../components/tabs/ListsPanel';
import type { Signature, SignatureType } from '../components/tabs/SignaturesPanel';
import type { Template } from '../components/tabs/TemplatesPanel';

export const PROFILE_TAB_IDS = {
  TEMPLATES: 'templates',
  SIGNATURES: 'signatures',
  LISTS: 'lists',
} as const;

export const TABS: Tab[] = [
  {
    id: PROFILE_TAB_IDS.TEMPLATES,
    icon: <FileText size={32} strokeWidth={1.5} />,
    label: 'תבניות',
  },
  {
    id: PROFILE_TAB_IDS.SIGNATURES,
    icon: <PenLine size={32} strokeWidth={1.5} />,
    label: 'חתימות',
  },
  {
    id: PROFILE_TAB_IDS.LISTS,
    icon: <UserCog size={32} strokeWidth={1.5} />,
    label: 'רשימות תפוצה',
  },
];

export const PROFILE: ProfileInfo = {
  name: 'ישראל ישראלי',
  id: '1234567',
  organization: 'אגף המבצעים',
};

export const PERMISSIONS: ListEntry[] = [
  { id: '1', icon: <Eye size={16} />, label: 'צפייה' },
  { id: '2', icon: <Send size={16} />, label: 'שליחה' },
  { id: '3', icon: <CheckCircle size={16} />, label: 'אישור' },
  { id: '4', icon: <Share2 size={16} />, label: 'שיתוף' },
  { id: '5', icon: <Search size={16} />, label: 'חיפוש' },
];

export const DEPARTMENTS: ListEntry[] = [
  { id: '1', icon: <Folder size={16} />, label: 'מחלקה א׳' },
  { id: '2', icon: <Folder size={16} />, label: 'מחלקה ב׳' },
  { id: '3', icon: <Folder size={16} />, label: 'מחלקה ג׳' },
];

export const DEPARTMENT_FILTER_OPTIONS: string[] = DEPARTMENTS.map(
  (department) => department.label,
);

export const TEMPLATES: Template[] = [
  { id: 't1', name: 'תבנית נוהל בטיחות', department: 'מחלקה א׳' },
  { id: 't2', name: 'תבנית הודעה כללית', department: 'מחלקה ב׳' },
  { id: 't3', name: 'תבנית דוח שבועי', department: 'מחלקה ג׳' },
];

export const DELETED_TEMPLATES: Template[] = [
  { id: 'td1', name: 'תבנית ישנה שנמחקה', department: 'מחלקה א׳' },
];

export const SIGNATURES: Record<SignatureType, Signature[]> = {
  distribution: [
    { id: 's1', name: 'חתימה רשמית — אגף מבצעים', department: 'מחלקה א׳' },
    { id: 's2', name: 'חתימה קצרה להפצה', department: 'מחלקה ב׳' },
  ],
  personal: [{ id: 's3', name: 'חתימה אישית — ישראל ישראלי', department: 'מחלקה ג׳' }],
  approver: [],
};

export const LISTS: DistributionList[] = [
  {
    id: 'l1',
    name: 'רשימת הפצה — מטה מבצעי',
    memberCount: 3,
    department: 'מחלקה א׳',
    members: [
      { id: 'p1', name: 'אבי כהן', idNumber: '012345678', environment: 'ארגון א׳' },
      { id: 'p2', name: 'שרה לוי', idNumber: '023456789', environment: 'ארגון ב׳' },
      { id: 'p6', name: 'מירי פרץ', idNumber: '067890123', environment: 'ארגון א׳' },
    ],
  },
  {
    id: 'l2',
    name: 'רשימת הפצה — לוגיסטיקה',
    memberCount: 4,
    department: 'מחלקה ב׳',
    members: [
      { id: 'p3', name: 'משה ישראלי', idNumber: '034567890', environment: 'ארגון א׳' },
      { id: 'p8', name: 'לאה כץ', idNumber: '089012345', environment: 'ארגון ב׳' },
      { id: 'p5', name: 'יוסף מזרחי', idNumber: '056789012', environment: 'ארגון ב׳' },
      { id: 'p7', name: 'דני אברהם', idNumber: '078901234', environment: 'ארגון ד׳' },
    ],
  },
  {
    id: 'l3',
    name: 'צוות מודיעין — רשימה א׳',
    memberCount: 2,
    department: 'מחלקה ג׳',
    members: [
      { id: 'p9', name: 'אורן שמש', idNumber: '090123456', environment: 'ארגון א׳' },
      { id: 'p10', name: 'נועה גרין', idNumber: '101234567', environment: 'ארגון ג׳' },
    ],
  },
];

export const DELETED_LISTS: DistributionList[] = [
  { id: 'ld1', name: 'רשימה ישנה שנמחקה', department: 'מחלקה א׳' },
];
