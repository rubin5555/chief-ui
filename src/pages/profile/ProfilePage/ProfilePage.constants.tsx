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
import type { ListEntry } from '../components/ProfileSidebar';

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
