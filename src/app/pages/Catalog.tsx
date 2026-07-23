import { useState, useRef, useEffect, useCallback } from 'react';
import { TopNavbar, DocPermissionsModal } from '../components/TopNavbar';
import { ApprovalRoundModal, ShareDocModal, EditDocDetailsModal } from './Edit';
import { RightSidebar } from '../components/RightSidebar';
import { DatePicker } from '../components/DatePicker';
import { DateTimePicker as SharedDateTimePicker, nowDateTimeIso } from '../components/DateTimePicker';
import {
  Search, Clock, MoreHorizontal, ChevronLeft, ChevronRight,
  Eye, Send, Copy, Trash2, Archive, X, Download, RotateCcw, ChevronDown, Filter, Plus, FileText,
  FileEdit, RefreshCw, Hash, XCircle, Shield, FolderPlus, Bookmark, GitBranch,
  Link, Link2, Monitor, Share2, Calendar, ChevronUp,
  Loader2, Check, Users, UserPlus, AlertTriangle,
} from 'lucide-react';

const TEMPLATES = ['פקודה', 'הוראה', 'מסמך', 'נספח'];
const DEPARTMENTS = ['משאבי אנוש', 'כספים', 'טכנולוגיה', 'תפעול', 'לוגיסטיקה', 'הנדסה', 'מודיעין', 'תקשוב'];

interface CatalogProps {
  navigate: (path: string) => void;
  initialDept?: string | null;
  onEditDoc?: (doc: { id: string; name: string; status: string; orderNum: string }) => void;
}

type Tab = 'drafts' | 'distribution' | 'distributed' | 'archive';

interface Doc {
  id: string; name: string; type: string;
  orderNum: string; updateNum: string; effectiveDate: string; refNum: string; status: string;
  env?: string; dept?: string; folder?: string;
  children?: Doc[];
}

interface TrashDoc extends Doc { daysLeft: number; }

interface Version {
  ver: string; orderNum: string; updateNum: string; status: string;
  date: string; refNum: string; approvedBy: string;
}

// Exact colors per spec
const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  'טיוטה פנימית':    { bg: '#f3f4f6', color: '#6b7280' },
  'בהכנה':            { bg: '#e0f2fe', color: '#0284c7' },
  'בסבב אישורים':    { bg: '#f3e8ff', color: '#7c3aed' },
  'נדחתה':            { bg: '#fee2e2', color: '#dc2626' },
  'נדרסה':            { bg: '#fce7f3', color: '#db2777' },
  'ממתין להפצה':     { bg: '#fefce8', color: '#ca8a04' },
  'מבצעית':          { bg: '#dcfce7', color: '#16a34a' },
  'נצורה':            { bg: '#fef3c7', color: '#d97706' },
  'הסתיימה':          { bg: '#f0fdf4', color: '#15803d' },
  'התבטלה':          { bg: '#f1f5f9', color: '#64748b' },
};

const TABS: { key: Tab; label: string }[] = [
  { key: 'drafts',       label: 'טיוטות' },
  { key: 'distribution', label: 'הפצה' },
  { key: 'distributed',  label: 'מסמכים שהופצו' },
  { key: 'archive',      label: 'ארכיון' },
];

type RowAction = { label: string; Icon: React.ElementType; danger?: boolean } | { sep: true };

const ROW_ACTIONS: Record<Tab, RowAction[]> = {
  drafts: [
    { label: 'שכפול',              Icon: Copy },
    { label: 'עריכת פרטי מסמך',   Icon: FileEdit },
    { label: 'הרשאות',             Icon: Shield },
    { label: 'שייך לתיקייה',      Icon: FolderPlus },
    { sep: true },
    { label: 'העתקת קישור',       Icon: Link },
    { sep: true },
    { label: 'מחיקת המסמך',       Icon: Trash2, danger: true },
  ],
  distribution: [
    { label: 'הרשאות צפייה',       Icon: Shield },
    { label: 'צפייה בסבב אישורים', Icon: GitBranch },
    { label: 'עריכת פרטי המסמך',  Icon: FileEdit },
  ],
  distributed: [
    { label: 'שכפול',                   Icon: Copy },
    { label: 'הוצאת עדכון למסמך',      Icon: RefreshCw },
    { label: 'שינוי מס׳ פקודה',        Icon: Hash },
    { label: 'עריכת פרטי מסמך',        Icon: FileEdit },
    { sep: true },
    { label: 'ביטול מסמך',             Icon: XCircle, danger: true },
    { label: 'הרשאות ובקרה',           Icon: Shield },
    { sep: true },
    { label: 'שייך לתיקייה',           Icon: FolderPlus },
    { label: 'יצירת היררכית מסמכים',   Icon: Bookmark },
    { sep: true },
    { label: 'צפייה בסבב אישורים',     Icon: GitBranch },
    { label: 'העתקת קישור',            Icon: Link },
    { label: 'יצירת לינק מתעדכן',     Icon: Link2 },
    { label: 'הקרנה כפקודה ראשית',    Icon: Monitor },
    { label: 'שיתוף המסמך',           Icon: Share2 },
  ],
  archive: [
    { label: 'שכפול',              Icon: Copy },
    { label: 'הוצאת עדכון למסמך', Icon: RefreshCw },
    { label: 'שינוי מס׳ פקודה',   Icon: Hash },
    { label: 'עריכת פרטי המסמך',  Icon: FileEdit },
    { sep: true },
    { label: 'הרשאות צפייה',       Icon: Shield },
    { label: 'שיתוף המסמך',       Icon: Share2 },
    { label: 'העתקת קישור',       Icon: Link },
  ],
};

const DOCS: Record<Tab, Doc[]> = {
  drafts: [
    { id: 'd1', name: 'פקודת הכשרת אנשי צוות',      type: 'פקודה',  orderNum: '2024-001', updateNum: '3', effectiveDate: '15/03/2024', refNum: 'סימ-1234', status: 'בסבב אישורים', env: 'הסביבה שלי',    dept: 'משאבי אנוש' },
    { id: 'd2', name: 'הוראת נהלי עבודה חדשים',      type: 'הוראה', orderNum: '2024-002', updateNum: '1', effectiveDate: '20/03/2024', refNum: 'סימ-1235', status: 'בהכנה',          env: 'הסביבה שלי',    dept: 'כספים' },
    { id: 'd3', name: 'מסמך מדיניות אבטחת מידע',     type: 'מסמך',  orderNum: '2024-003', updateNum: '2', effectiveDate: '25/03/2024', refNum: 'סימ-1236', status: 'טיוטה פנימית',  env: 'הסביבה שלי',    dept: 'טכנולוגיה' },
    { id: 'd4', name: 'פקודת ניהול סיכונים',         type: 'פקודה',  orderNum: '2024-004', updateNum: '1', effectiveDate: '01/04/2024', refNum: 'סימ-1237', status: 'בסבב אישורים', env: 'משרד הבריאות',  dept: 'משאבי אנוש' },
    { id: 'd5', name: 'הוראת תדרוך עובדים חדשים',   type: 'הוראה', orderNum: '2024-005', updateNum: '4', effectiveDate: '05/04/2024', refNum: 'סימ-1238', status: 'בהכנה',          env: 'משרד הביטחון', dept: 'כספים' },
    { id: 'd6', name: 'מסמך נהלי דיווח',             type: 'מסמך',  orderNum: '2024-006', updateNum: '1', effectiveDate: '10/04/2024', refNum: 'סימ-1239', status: 'טיוטה פנימית',  env: 'הסביבה שלי',    dept: 'טכנולוגיה' },
    { id: 'd7', name: 'פקודת תגובה לאירועים',        type: 'פקודה',  orderNum: '2024-007', updateNum: '2', effectiveDate: '15/04/2024', refNum: 'סימ-1240', status: 'נדחתה',          env: 'משרד החינוך',   dept: 'משאבי אנוש' },
    { id: 'd8', name: 'הוראת ניהול ציוד',            type: 'הוראה', orderNum: '2024-008', updateNum: '1', effectiveDate: '20/04/2024', refNum: 'סימ-1241', status: 'נדרסה',          env: 'ארגון א׳',       dept: 'כספים' },
  ],
  distribution: [
    { id: 'p1', name: 'פקודת מבצע קיץ',             type: 'פקודה',  orderNum: '2024-101', updateNum: '5', effectiveDate: '01/05/2024', refNum: 'סימ-2001', status: 'ממתין להפצה',  env: 'הסביבה שלי',    dept: 'משאבי אנוש', folder: 'מבצע קיץ 2024' },
    { id: 'p2', name: 'הוראת בטיחות שגרתית',        type: 'הוראה', orderNum: '2024-102', updateNum: '3', effectiveDate: '05/05/2024', refNum: 'סימ-2002', status: 'בסבב אישורים', env: 'הסביבה שלי',    dept: 'טכנולוגיה' },
    { id: 'p3', name: 'מסמך תכנון שנתי',             type: 'מסמך',  orderNum: '2024-103', updateNum: '2', effectiveDate: '10/05/2024', refNum: 'סימ-2003', status: 'נדחתה',          env: 'משרד הבריאות',  dept: 'כספים' },
    { id: 'p4', name: 'פקודת סיום פעילות מבצע א׳',  type: 'פקודה',  orderNum: '2024-104', updateNum: '1', effectiveDate: '15/05/2024', refNum: 'סימ-2004', status: 'ממתין להפצה',  env: 'משרד הביטחון', dept: 'משאבי אנוש' },
    { id: 'p5', name: 'הוראת ניהול אירועים',         type: 'הוראה', orderNum: '2024-105', updateNum: '4', effectiveDate: '20/05/2024', refNum: 'סימ-2005', status: 'בסבב אישורים', env: 'הסביבה שלי',    dept: 'כספים' },
    { id: 'p6', name: 'מסמך הנחיות לוגיסטיות',      type: 'מסמך',  orderNum: '2024-106', updateNum: '2', effectiveDate: '25/05/2024', refNum: 'סימ-2006', status: 'נדחתה',          env: 'משרד החינוך',   dept: 'טכנולוגיה' },
    { id: 'p7', name: 'פקודת עדכון נהלים',          type: 'פקודה',  orderNum: '2024-107', updateNum: '3', effectiveDate: '01/06/2024', refNum: 'סימ-2007', status: 'ממתין להפצה',  env: 'ארגון א׳',       dept: 'משאבי אנוש' },
    { id: 'p8', name: 'הוראת תפעול מיוחד',          type: 'הוראה', orderNum: '2024-108', updateNum: '1', effectiveDate: '05/06/2024', refNum: 'סימ-2008', status: 'בסבב אישורים', env: 'הסביבה שלי',    dept: 'טכנולוגיה' },
  ],
  distributed: [
    { id: 'r1',  name: 'פקודת בטיחות מרחב א׳',       type: 'פקודה',  orderNum: '2024-201', updateNum: '7', effectiveDate: '10/01/2024', refNum: 'סימ-3001', status: 'מבצעית', env: 'הסביבה שלי',    dept: 'משאבי אנוש', folder: 'נהלי בטיחות',
      children: [
        { id: 'r1-a', name: 'נספח א׳ — נהלי בטיחות שוטפים', type: 'נספח', orderNum: '2024-201/א', updateNum: '3', effectiveDate: '10/01/2024', refNum: 'סימ-3001/א', status: 'מבצעית', env: 'הסביבה שלי', dept: 'משאבי אנוש' },
        { id: 'r1-b', name: 'נספח ב׳ — טפסי דיווח אירועים', type: 'נספח', orderNum: '2024-201/ב', updateNum: '2', effectiveDate: '10/01/2024', refNum: 'סימ-3001/ב', status: 'מבצעית', env: 'הסביבה שלי', dept: 'משאבי אנוש' },
      ]},
    { id: 'r2',  name: 'הוראת ניהול שגרה',            type: 'הוראה', orderNum: '2024-202', updateNum: '5', effectiveDate: '15/01/2024', refNum: 'סימ-3002', status: 'מבצעית', env: 'משרד הבריאות',  dept: 'כספים' },
    { id: 'r3',  name: 'מסמך נהלי חירום',             type: 'מסמך',  orderNum: '2024-203', updateNum: '3', effectiveDate: '20/01/2024', refNum: 'סימ-3003', status: 'נצורה',   env: 'הסביבה שלי',    dept: 'טכנולוגיה' },
    { id: 'r4',  name: 'פקודת תגובה לאירועי ביטחון', type: 'פקודה',  orderNum: '2024-204', updateNum: '6', effectiveDate: '25/01/2024', refNum: 'סימ-3004', status: 'מבצעית', env: 'משרד הביטחון', dept: 'משאבי אנוש',
      children: [
        { id: 'r4-a', name: 'נספח — פרוטוקול תגובה מהירה',  type: 'נספח', orderNum: '2024-204/א', updateNum: '1', effectiveDate: '25/01/2024', refNum: 'סימ-3004/א', status: 'מבצעית', env: 'משרד הביטחון', dept: 'משאבי אנוש' },
        { id: 'r4-b', name: 'נספח — רשימת גורמים מוסמכים',  type: 'נספח', orderNum: '2024-204/ב', updateNum: '4', effectiveDate: '25/01/2024', refNum: 'סימ-3004/ב', status: 'נצורה',   env: 'משרד הביטחון', dept: 'משאבי אנוש' },
        { id: 'r4-c', name: 'נספח — מפת אירועים',           type: 'נספח', orderNum: '2024-204/ג', updateNum: '2', effectiveDate: '25/01/2024', refNum: 'סימ-3004/ג', status: 'מבצעית', env: 'משרד הביטחון', dept: 'משאבי אנוש' },
      ]},
    { id: 'r5',  name: 'הוראת תדרוך שבועי',          type: 'הוראה', orderNum: '2024-205', updateNum: '4', effectiveDate: '30/01/2024', refNum: 'סימ-3005', status: 'מבצעית', env: 'הסביבה שלי',    dept: 'כספים' },
    { id: 'r6',  name: 'מסמך הנחיות כלליות',          type: 'מסמך',  orderNum: '2024-206', updateNum: '2', effectiveDate: '05/02/2024', refNum: 'סימ-3006', status: 'נצורה',   env: 'משרד החינוך',   dept: 'טכנולוגיה' },
    { id: 'r7',  name: 'פקודת ניהול כוח אדם',        type: 'פקודה',  orderNum: '2024-207', updateNum: '8', effectiveDate: '10/02/2024', refNum: 'סימ-3007', status: 'מבצעית', env: 'הסביבה שלי',    dept: 'משאבי אנוש', folder: 'גיוס עובדים' },
    { id: 'r8',  name: 'הוראת נוהל גיוס',            type: 'הוראה', orderNum: '2024-208', updateNum: '3', effectiveDate: '15/02/2024', refNum: 'סימ-3008', status: 'מבצעית', env: 'ארגון א׳',       dept: 'כספים' },
    { id: 'r9',  name: 'מסמך מדיניות תקשורת',        type: 'מסמך',  orderNum: '2024-209', updateNum: '1', effectiveDate: '20/02/2024', refNum: 'סימ-3009', status: 'נצורה',   env: 'משרד הבריאות',  dept: 'טכנולוגיה' },
    { id: 'r10', name: 'פקודת עדכון כללי',           type: 'פקודה',  orderNum: '2024-210', updateNum: '5', effectiveDate: '25/02/2024', refNum: 'סימ-3010', status: 'מבצעית', env: 'הסביבה שלי',    dept: 'משאבי אנוש' },
  ],
  archive: [
    { id: 'a1', name: 'פקודת מבצע חורף 2023',        type: 'פקודה',  orderNum: '2023-501', updateNum: '9', effectiveDate: '01/12/2023', refNum: 'סימ-4001', status: 'הסתיימה',  env: 'הסביבה שלי',    dept: 'משאבי אנוש', folder: 'מבצע חורף 2024' },
    { id: 'a2', name: 'הוראת נהלי 2022',             type: 'הוראה', orderNum: '2022-502', updateNum: '6', effectiveDate: '15/12/2022', refNum: 'סימ-4002', status: 'התבטלה',   env: 'משרד הבריאות',  dept: 'כספים' },
    { id: 'a3', name: 'מסמך תכנון 2021',             type: 'מסמך',  orderNum: '2021-503', updateNum: '4', effectiveDate: '20/11/2021', refNum: 'סימ-4003', status: 'הסתיימה',  env: 'הסביבה שלי',    dept: 'טכנולוגיה' },
    { id: 'a4', name: 'פקודת סיום שנה',              type: 'פקודה',  orderNum: '2023-504', updateNum: '3', effectiveDate: '31/12/2023', refNum: 'סימ-4004', status: 'הסתיימה',  env: 'משרד הביטחון', dept: 'משאבי אנוש' },
    { id: 'a5', name: 'הוראת ביטול נוהל ישן',        type: 'הוראה', orderNum: '2022-505', updateNum: '2', effectiveDate: '30/06/2022', refNum: 'סימ-4005', status: 'התבטלה',   env: 'ארגון א׳',       dept: 'כספים' },
    { id: 'a6', name: 'מסמך ארכיוני שנתי',           type: 'מסמך',  orderNum: '2021-506', updateNum: '1', effectiveDate: '31/12/2021', refNum: 'סימ-4006', status: 'הסתיימה',  env: 'הסביבה שלי',    dept: 'טכנולוגיה' },
    { id: 'a7', name: 'פקודת חיסול ציוד',            type: 'פקודה',  orderNum: '2022-507', updateNum: '5', effectiveDate: '01/09/2022', refNum: 'סימ-4007', status: 'התבטלה',   env: 'משרד החינוך',   dept: 'משאבי אנוש' },
    { id: 'a8', name: 'הוראת סגירת שנה',             type: 'הוראה', orderNum: '2023-508', updateNum: '2', effectiveDate: '31/12/2023', refNum: 'סימ-4008', status: 'הסתיימה',  env: 'הסביבה שלי',    dept: 'כספים' },
  ],
};

const TRASH_DOCS: TrashDoc[] = [
  { id: 'tr1', name: 'פקודת אימון חטיבה',       type: 'פקודה',  orderNum: '2024-099', updateNum: '2', effectiveDate: '10/02/2024', refNum: 'סימ-0099', status: 'טיוטה פנימית', daysLeft: 28 },
  { id: 'tr2', name: 'הוראת נוהל ישן',           type: 'הוראה', orderNum: '2023-088', updateNum: '1', effectiveDate: '01/12/2023', refNum: 'סימ-0088', status: 'מבוטלת',        daysLeft: 17 },
  { id: 'tr3', name: 'מסמך תקציב 2022',          type: 'מסמך',  orderNum: '2022-077', updateNum: '3', effectiveDate: '15/08/2022', refNum: 'סימ-0077', status: 'הסתיימה',       daysLeft: 5  },
  { id: 'tr4', name: 'פקודת ביטול מבצע',         type: 'פקודה',  orderNum: '2024-033', updateNum: '1', effectiveDate: '20/01/2024', refNum: 'סימ-0033', status: 'מבוטלת',        daysLeft: 12 },
  { id: 'tr5', name: 'הוראת ניהול ציוד מיושן',  type: 'הוראה', orderNum: '2023-055', updateNum: '2', effectiveDate: '05/06/2023', refNum: 'סימ-0055', status: 'הסתיימה',       daysLeft: 23 },
];

const TRASH_ROW_ACTIONS: RowAction[] = [
  { label: 'שחזור',            Icon: RotateCcw },
  { sep: true },
  { label: 'מחיקה לצמיתות',   Icon: Trash2, danger: true },
];

const HISTORY: Version[] = [
  { ver: '8', orderNum: '2024-001', updateNum: '8', status: 'מבצעית',       date: '10/03/2024', refNum: 'סימ-1234', approvedBy: 'א. כהן' },
  { ver: '7', orderNum: '2024-001', updateNum: '7', status: 'נצורה',         date: '02/03/2024', refNum: 'סימ-1234', approvedBy: 'מ. לוי' },
  { ver: '6', orderNum: '2024-001', updateNum: '6', status: 'נצורה',         date: '20/02/2024', refNum: 'סימ-1233', approvedBy: 'ר. אברהם' },
  { ver: '5', orderNum: '2024-001', updateNum: '5', status: 'בסבב אישורים', date: '08/02/2024', refNum: 'סימ-1232', approvedBy: 'א. כהן' },
  { ver: '4', orderNum: '2024-001', updateNum: '4', status: 'בסבב אישורים', date: '28/01/2024', refNum: 'סימ-1231', approvedBy: 'י. שמיר' },
];

const PAGE_SIZE = 8;

/* ── Status badge ── */
function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? { bg: '#f3f4f6', color: '#6b7280' };
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-[3px] rounded-full text-xs font-medium whitespace-nowrap"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
      {status}
    </span>
  );
}

/* ── Filter chip ── */
function FilterChip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border"
      style={{ background: '#EEF4FF', color: '#1B3A6B', borderColor: '#c7d9ff' }}>
      {label}
      <button type="button" onClick={onClear} className="ml-0.5 hover:opacity-70 transition-opacity">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

/* ── Searchable checkbox section ── */
function SearchableCheckboxSection({ title, options, selected, onChange }: {
  title: string; options: string[]; selected: string[]; onChange: (v: string[]) => void;
}) {
  const [q, setQ] = useState('');
  const visible = options.filter(o => o.includes(q));
  const toggle = (opt: string) =>
    onChange(selected.includes(opt) ? selected.filter(x => x !== opt) : [...selected, opt]);

  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 px-4 pb-1.5 uppercase tracking-wide">{title}</p>
      <div className="relative mx-3 mb-1.5">
        <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-300 pointer-events-none" />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="חיפוש..."
          className="w-full pr-7 pl-2 py-1 text-xs rounded-md border border-gray-100 bg-gray-50 focus:outline-none focus:border-gray-200"
          dir="rtl" />
      </div>
      <div className="max-h-28 overflow-y-auto">
        {visible.map(opt => (
          <label key={opt} className="flex items-center gap-2 px-4 py-1.5 cursor-pointer hover:bg-gray-50 transition-colors">
            <input type="checkbox" checked={selected.includes(opt)} onChange={() => toggle(opt)}
              className="rounded w-3.5 h-3.5 flex-shrink-0 accent-[#1B3A6B]" />
            <span className={`flex-1 text-right text-sm ${selected.includes(opt) ? 'font-semibold text-[#1B3A6B]' : 'text-gray-700'}`}>{opt}</span>
          </label>
        ))}
        {visible.length === 0 && <p className="px-4 py-1.5 text-xs text-gray-300 text-right">לא נמצאו</p>}
      </div>
    </div>
  );
}

/* ── Simple checkbox section (no search) ── */
function SimpleCheckboxSection({ title, options, selected, onChange }: {
  title: string; options: string[]; selected: string[]; onChange: (v: string[]) => void;
}) {
  const toggle = (opt: string) =>
    onChange(selected.includes(opt) ? selected.filter(x => x !== opt) : [...selected, opt]);

  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 px-4 pb-1.5 uppercase tracking-wide">{title}</p>
      <div className="max-h-36 overflow-y-auto">
        {options.map(opt => (
          <label key={opt} className="flex items-center gap-2 px-4 py-1.5 cursor-pointer hover:bg-gray-50 transition-colors">
            <input type="checkbox" checked={selected.includes(opt)} onChange={() => toggle(opt)}
              className="rounded w-3.5 h-3.5 flex-shrink-0 accent-[#1B3A6B]" />
            <span className={`flex-1 text-right text-sm ${selected.includes(opt) ? 'font-semibold text-[#1B3A6B]' : 'text-gray-700'}`}>{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

/* ── Row context menu ── */
const INLINE_PHASE_ACTIONS = new Set(['העתקת קישור', 'יצירת לינק מתעדכן', 'הקרנה כפקודה ראשית']);

function RowMenu({ tab, onAction, onClose, actionPhase }: { tab: Tab; onAction: (label: string) => void; onClose: () => void; actionPhase?: { label: string; phase: 'loading' | 'done' } | null }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 min-w-[210px]"
      dir="rtl" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
      {ROW_ACTIONS[tab].map((action, i) => {
        if ('sep' in action) {
          return <div key={`sep-${i}`} className="my-1 border-t border-gray-100" />;
        }
        const { label, Icon, danger } = action;
        const isInlinePhase = INLINE_PHASE_ACTIONS.has(label);
        const phase = (isInlinePhase && actionPhase?.label === label) ? actionPhase.phase : null;
        return (
          <button key={label} onClick={() => { onAction(label); if (!isInlinePhase) onClose(); }}
            className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-right transition-colors hover:bg-gray-50 ${danger ? 'text-red-500' : 'text-gray-700'}`}>
            <Icon className={`w-4 h-4 flex-shrink-0 ${danger ? 'text-red-400' : 'text-gray-400'}`} />
            <span className="flex-1">{label}</span>
            {phase === 'loading' && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1B3A6B] flex-shrink-0" />}
            {phase === 'done' && <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />}
          </button>
        );
      })}
    </div>
  );
}

/* ── Catalog doc modal helpers ── */
function CROField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-gray-400 font-medium">{label}</span>
      <div className="text-sm text-gray-400 rounded-lg px-3 py-1.5 border border-gray-100 bg-gray-50 select-none cursor-default text-right">{value}</div>
    </div>
  );
}

function CSelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-gray-500 font-medium">{label}</span>
      <div ref={ref} className="relative">
        <button type="button" onClick={() => setOpen(o => !o)}
          className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white hover:border-gray-300 focus:outline-none transition-colors"
          style={{ color: value ? '#374151' : '#9ca3af' }}>
          <span>{value || 'בחר'}</span>
          <ChevronLeft className="w-4 h-4 text-gray-400 flex-shrink-0" style={{ transform: open ? 'rotate(-90deg)' : 'rotate(90deg)', transition: 'transform 0.15s' }} />
        </button>
        {open && (
          <div className="absolute top-full mt-1 right-0 left-0 bg-white rounded-xl shadow-lg border border-gray-100 z-[9999] py-1 max-h-48 overflow-y-auto">
            {options.map(opt => (
              <button key={opt} type="button"
                onClick={() => { onChange(opt); setOpen(false); }}
                className="w-full text-right px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                style={{ color: value === opt ? '#1B3A6B' : '#374151', fontWeight: value === opt ? 600 : 400 }}>
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CToggleRow({ label, checked, onChange, disabled }: { label: string; checked: boolean; onChange: () => void; disabled?: boolean }) {
  return (
    <div className={`flex items-center justify-between px-4 py-3 bg-white transition-colors ${disabled ? 'opacity-50' : 'hover:bg-gray-50'}`}
      style={{ borderTop: '1px solid #f3f4f6' }}>
      <span className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>{label}</span>
      <button onClick={disabled ? undefined : onChange}
        className="relative flex-shrink-0 transition-colors duration-200 rounded-full"
        style={{ width: 36, height: 20, background: checked ? '#1B3A6B' : '#d1d5db', pointerEvents: disabled ? 'none' : undefined }}>
        <span className="absolute top-0.5 transition-all duration-200 rounded-full bg-white"
          style={{ width: 16, height: 16, right: checked ? 2 : 18 }} />
      </button>
    </div>
  );
}

/* ── Catalog: Edit / Duplicate doc modal ── */
function CatalogDocModal({ doc, mode, onClose }: { doc: Doc; mode: 'edit' | 'duplicate'; onClose: () => void }) {
  const isDuplicate = mode === 'duplicate';
  const [name, setName] = useState(doc.name);
  const [nameTouched, setNameTouched] = useState(!isDuplicate);
  const [dept, setDept] = useState(doc.dept ?? 'משאבי אנוש');
  const [docType, setDocType] = useState(doc.type ?? 'פקודה');
  const [entryDate, setEntryDate] = useState(nowDateTimeIso());
  const [exitDate, setExitDate] = useState('');
  const [pdfAccess, setPdfAccess] = useState<'authorized' | 'all'>('authorized');
  const [cancelApproval, setCancelApproval] = useState(false);
  const [watermark, setWatermark] = useState(false);
  const [dirty, setDirty] = useState(false);

  return (
    <div className="fixed inset-0 z-[99998] flex items-center justify-center"
      style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(2px)' }}>
      <div className="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden" dir="rtl"
        style={{ width: 620, maxHeight: '88vh' }}>

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-base font-semibold text-gray-800">{isDuplicate ? 'שכפול מסמך' : 'פרטי המסמך'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-6">
          {/* Always read-only */}
          <div className="grid grid-cols-3 gap-3">
            <CROField label="סיווג" value="בלמ״ס" />
            <CROField label="תבנית" value={doc.type} />
            <CROField label="ארגון" value={doc.env ?? 'ארגון א׳'} />
            <CROField label="מס׳ פקודה" value={doc.orderNum} />
            <CROField label="מס׳ עדכון" value={doc.updateNum} />
          </div>

          {/* Editable fields */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">

              <div className="col-span-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold flex items-center gap-1.5" style={{ color: '#374151' }}>
                    שם המסמך
                    {isDuplicate && !nameTouched && <span className="text-[10px] font-normal" style={{ color: '#dc2626' }}>חובה לשנות שם</span>}
                  </label>
                  <input value={name}
                    onChange={e => { setName(e.target.value); setNameTouched(true); setDirty(true); }}
                    dir="rtl"
                    style={{
                      width: '100%', fontSize: 13, color: '#374151', background: 'white',
                      border: `1.5px solid ${isDuplicate && !nameTouched ? '#fca5a5' : '#e5e7eb'}`,
                      borderRadius: 8, outline: 'none', padding: '8px 12px', transition: 'all 0.15s',
                    }}
                    className="focus:border-[#1B3A6B]"
                  />
                </div>
              </div>

              <CSelectField label="מחלקה" value={dept} onChange={v => { setDept(v); setDirty(true); }}
                options={DEPARTMENTS} />
              <CSelectField label="סוג מסמך" value={docType} onChange={v => { setDocType(v); setDirty(true); }}
                options={['פקודה', 'נוהל', 'הוראה', 'הנחיה', 'נספח']} />

              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-gray-500 font-medium">כניסה לתוקף</span>
                <SharedDateTimePicker value={entryDate} onChange={v => { setEntryDate(v); setDirty(true); }} placeholder="בחר תאריך ושעה" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-gray-500 font-medium">יציאה מתוקף</span>
                <SharedDateTimePicker value={exitDate} onChange={v => { setExitDate(v); setDirty(true); }} placeholder="בחר תאריך ושעה" />
              </div>
            </div>

            <div className="flex flex-col gap-0 rounded-xl overflow-hidden border border-gray-100">
              <div className="flex items-center justify-between px-4 py-3 bg-white">
                <span className="text-sm text-gray-700">ייצוא לPDF</span>
                <div className="flex rounded-lg overflow-hidden border border-gray-200" style={{ fontSize: 12 }}>
                  {(['authorized', 'all'] as const).map((opt, i) => (
                    <button key={opt} onClick={() => { setPdfAccess(opt); setDirty(true); }}
                      className="px-3 py-1.5 transition-colors text-xs font-medium"
                      style={{
                        background: pdfAccess === opt ? '#1B3A6B' : '#fff',
                        color: pdfAccess === opt ? '#fff' : '#6b7280',
                        borderRight: i === 0 ? '1px solid #e5e7eb' : undefined,
                      }}>
                      {opt === 'authorized' ? 'למורשים בלבד' : 'לאפשר לכולם'}
                    </button>
                  ))}
                </div>
              </div>
              <CToggleRow label="ביטול סבב האישורים" checked={cancelApproval} onChange={() => { setCancelApproval(p => !p); setDirty(true); }} />
              <CToggleRow label="הצגת סימן מים" checked={watermark} onChange={() => { setWatermark(p => !p); setDirty(true); }} />
              <CToggleRow label="האם תרצה להפיץ את הפקודה כפקודה נצורה?" checked={false} onChange={() => setDirty(true)} />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <button onClick={onClose}
            className="px-5 py-2 rounded-full text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
            ביטול
          </button>
          {(() => {
            const isDisabled = isDuplicate ? !nameTouched : !dirty;
            return (
              <button onClick={onClose} disabled={isDisabled}
                className="px-5 py-2 rounded-full text-sm font-semibold transition-all"
                style={{ background: isDisabled ? '#e5e7eb' : '#1B3A6B', color: isDisabled ? '#9ca3af' : '#fff' }}>
                {isDuplicate ? 'שכפל' : 'שמור שינויים'}
              </button>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

/* ── Catalog: Permissions modal ── */

/* ── Catalog: Delete confirm modal ── */
function CatalogDeleteModal({ doc, onClose }: { doc: Doc; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[99998] flex items-center justify-center"
      style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(2px)' }}>
      <div className="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden" dir="rtl"
        style={{ width: 340, padding: '28px 24px 20px' }}>

        <p className="text-base font-bold text-gray-900 text-center mb-6">
          האם בטוח שתרצה למחוק "{doc.name}"?
        </p>

        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-full text-sm font-medium text-gray-700 border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
            ביטול
          </button>
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ background: '#1B3A6B' }}>
            מחיקה
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Catalog: Cancel doc modal ── */
/* ── Doc Hierarchy Modal ── */
const ALL_DOCS_POOL = [
  ...Object.values(DOCS).flat().filter(d => !('daysLeft' in d)),
];

function DocHierarchyModal({ doc, onClose }: { doc: Doc; onClose: () => void }) {
  const [mode, setMode] = useState<'main' | 'companion'>('main');
  const [search, setSearch] = useState('');
  const [companions, setCompanions] = useState<Doc[]>([]);
  const [mainDoc, setMainDoc] = useState<Doc | null>(null);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowResults(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const switchMode = (m: 'main' | 'companion') => {
    setMode(m); setSearch(''); setCompanions([]); setMainDoc(null); setShowResults(false);
  };

  const pool = ALL_DOCS_POOL.filter(d => d.id !== doc.id);

  const results = search.trim()
    ? pool.filter(d =>
        (mode === 'main' ? !companions.find(c => c.id === d.id) : true) &&
        (d.name.includes(search) || d.orderNum.includes(search))
      ).slice(0, 6)
    : [];

  const addCompanion = (d: Doc) => { setCompanions(p => [...p, d]); setSearch(''); setShowResults(false); };
  const removeCompanion = (id: string) => setCompanions(p => p.filter(c => c.id !== id));
  const pickMain = (d: Doc) => { setMainDoc(d); setSearch(''); setShowResults(false); };

  /* ── shared sub-components ── */
  const DocCard = ({ d, badge, onRemove }: { d: Doc; badge: string; badgeColor?: string; onRemove?: () => void }) => (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border-2"
      style={{ borderColor: '#1B3A6B', background: '#f0f4ff' }}>
      <FileText className="w-5 h-5 flex-shrink-0" style={{ color: '#1B3A6B' }} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">{d.name}</p>
        <p className="text-xs text-gray-500">{d.orderNum}</p>
      </div>
      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full flex-shrink-0"
        style={{ background: '#1B3A6B', color: '#fff' }}>{badge}</span>
      {onRemove && (
        <button onClick={onRemove} className="p-1 rounded-lg hover:bg-blue-100 text-gray-400 transition-colors flex-shrink-0">
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );

  const SearchBox = ({ placeholder }: { placeholder: string }) => (
    <div ref={searchRef} className="relative">
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus-within:border-[#1B3A6B] transition-colors">
        <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <input value={search} onChange={e => { setSearch(e.target.value); setShowResults(true); }}
          onFocus={() => setShowResults(true)}
          placeholder={placeholder}
          className="flex-1 text-sm outline-none bg-transparent text-right" dir="rtl" />
      </div>
      {showResults && results.length > 0 && (
        <div className="absolute right-0 left-0 top-full mt-1 bg-white rounded-xl border border-gray-100 shadow-lg z-10 overflow-hidden">
          {results.map(r => (
            <button key={r.id}
              onClick={() => mode === 'main' ? addCompanion(r) : pickMain(r)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-right hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
              <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 truncate">{r.name}</p>
                <p className="text-xs text-gray-400">{r.orderNum}</p>
              </div>
              <Plus className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[99998] flex items-center justify-center"
      style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(2px)' }}>
      <div className="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden" dir="rtl"
        style={{ width: 600, maxHeight: '88vh' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-base font-semibold text-gray-800">יצירת היררכית מסמכים</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">

          {/* Current doc card with inline mode toggle */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl border-2"
            style={{ borderColor: '#1B3A6B', background: '#f0f4ff' }}>
            <FileText className="w-5 h-5 flex-shrink-0" style={{ color: '#1B3A6B' }} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{doc.name}</p>
              <p className="text-xs text-gray-500">{doc.orderNum}</p>
            </div>
            {/* Inline tab toggle */}
            <div className="flex rounded-lg overflow-hidden border flex-shrink-0" style={{ borderColor: '#1B3A6B' }}>
              {([['main', 'ראשי'], ['companion', 'נלווה']] as const).map(([m, label]) => (
                <button key={m} onClick={() => switchMode(m)}
                  className="px-3 py-1 text-[11px] font-semibold transition-colors"
                  style={{
                    background: mode === m ? '#1B3A6B' : 'transparent',
                    color: mode === m ? '#fff' : '#1B3A6B',
                    borderRight: m === 'companion' ? '1px solid #1B3A6B' : undefined,
                  }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {mode === 'main' ? (
            /* Add companions */
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-gray-500">מסמכים נלווים</span>
              <SearchBox placeholder="חיפוש לפי שם מסמך או מס׳ פקודה..." />
              {companions.length > 0 && (
                <div className="flex flex-col gap-1.5 mt-1">
                  {companions.map(c => (
                    <div key={c.id} className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50">
                      <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 truncate">{c.name}</p>
                        <p className="text-xs text-gray-400">{c.orderNum}</p>
                      </div>
                      <button onClick={() => removeCompanion(c.id)}
                        className="p-1 rounded-lg hover:bg-gray-200 text-gray-400 transition-colors flex-shrink-0">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {companions.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-3">חפש וסמן מסמכים נלווים שיצורפו להיררכיה</p>
              )}
            </div>
          ) : (
            /* Pick main doc */
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-gray-500">מסמך ראשי לחיבור</span>
              {mainDoc ? (
                <DocCard d={mainDoc} badge="ראשי" onRemove={() => setMainDoc(null)} />
              ) : (
                <>
                  <SearchBox placeholder="חיפוש מסמך ראשי לפי שם או מס׳ פקודה..." />
                  <p className="text-xs text-gray-400 text-center py-3">חפש ובחר את המסמך הראשי שאליו יחובר המסמך הנוכחי</p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <button onClick={onClose}
            className="px-5 py-2.5 rounded-full text-sm font-medium text-gray-600 border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
            ביטול
          </button>
          <button onClick={onClose}
            disabled={mode === 'companion' && !mainDoc}
            className="px-6 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-40"
            style={{ background: '#1B3A6B' }}>
            שמור
          </button>
        </div>
      </div>
    </div>
  );
}

function CancelProgressToast({ onClose }: { onClose: () => void }) {
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (complete) return;
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(timer); setComplete(true); return 100; }
        return p + 2;
      });
    }, 60);
    return () => clearInterval(timer);
  }, [complete]);

  return (
    <div className="fixed bottom-5 left-5 z-[99998] bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col gap-3 overflow-hidden"
      dir="rtl" style={{ width: 300 }}>
      <div className="flex items-center justify-between px-4 pt-4">
        <span className="text-xs font-bold text-gray-800">
          {complete ? 'המסמך בוטל בהצלחה' : 'ביטול המסמך מתבצע'}
        </span>
        {complete && (
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
      <div className="flex items-center gap-2 px-4">
        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#e5e7eb' }}>
          <div className="h-full rounded-full transition-all duration-75"
            style={{ width: `${progress}%`, background: complete ? '#16a34a' : '#1B3A6B' }} />
        </div>
        <span className="text-[11px] font-semibold tabular-nums"
          style={{ color: complete ? '#16a34a' : '#1B3A6B', minWidth: 36, textAlign: 'left' }}>
          {progress}%
        </span>
      </div>
      {complete && (
        <div className="px-4 pb-4">
          <span className="text-xs text-gray-500">אגרת ביטול נשלחה למכותבים</span>
        </div>
      )}
      {!complete && <div className="pb-1" />}
    </div>
  );
}

function CatalogCancelModal({ doc, onClose, onSendCancel }: { doc: Doc; onClose: () => void; onSendCancel: () => void }) {
  const [phase, setPhase] = useState<'confirm' | 'share'>('confirm');

  if (phase === 'share') {
    return (
      <ShareDocModal
        docName={doc.name}
        title="שליחת אגרת ביטול באאוטלוק ובצאט"
        onClose={() => setPhase('confirm')}
        onSend={onSendCancel}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-[99998] flex items-center justify-center"
      style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(2px)' }}>
      <div className="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden" dir="rtl"
        style={{ width: 420, padding: '28px 24px 20px' }}>

        <p className="text-base font-bold text-gray-900 text-center mb-2">
          האם להעביר את המסמך לסטטוס ׳מבוטל׳?
        </p>
        <p className="text-sm text-gray-500 text-center mb-7 leading-relaxed">
          פעולה זו אינה הפיכה ותסיים את תוקף הפקודה לאלתר
        </p>

        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-full text-sm font-medium text-gray-700 border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
            ביטול
          </button>
          <button onClick={() => setPhase('share')}
            className="flex-1 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ background: '#1B3A6B' }}>
            אישור
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Receipt confirm modal ── */
const MOCK_HMLS: Record<string, { name: string; seen: boolean; date?: string; time?: string; note?: string }[]> = {
  default: [
    { name: 'חמ״ל רפואה',     seen: true,  date: '10/03/2024', time: '08:32', note: 'התקבל ואושר' },
    { name: 'חמ״ל לוגיסטיקה', seen: true,  date: '10/03/2024', time: '09:15' },
    { name: 'חמ״ל תקשוב',     seen: false },
    { name: 'חמ״ל הנדסה',     seen: false },
    { name: 'חמ״ל מודיעין',   seen: true,  date: '11/03/2024', time: '14:47', note: 'מאושר לביצוע' },
    { name: 'חמ״ל תפעול',     seen: false },
  ],
};

function ReceiptConfirmModal({ doc, receipt, onClose }: { doc: Doc; receipt: string; onClose: () => void }) {
  const hmls = MOCK_HMLS.default;
  const seen = hmls.filter(h => h.seen).length;
  return (
    <div className="fixed inset-0 z-[99998] flex items-center justify-center"
      style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(2px)' }}
      onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden" dir="rtl"
        style={{ width: 480, maxHeight: '80vh' }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h3 className="text-base font-bold text-gray-900">וידוא קבלה — חמ״לים מכותבים</h3>
            <p className="text-xs text-gray-500 mt-0.5">{doc.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold" style={{ color: '#1B3A6B' }}>{seen}/{hmls.length}</span>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1 px-4 py-3 flex flex-col gap-1">
          {[...hmls].sort((a, b) => Number(a.seen) - Number(b.seen)).map((h, i) => (
            <div key={i} className="flex items-start gap-3 px-3 py-3 rounded-xl"
              style={{ background: h.seen ? '#f0fdf4' : '#f9fafb' }}>
              {/* Icon */}
              <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
                style={{ background: h.seen ? '#dcfce7' : '#e5e7eb' }}>
                {h.seen
                  ? <Check className="w-3.5 h-3.5" style={{ color: '#16a34a' }} />
                  : <span className="w-2 h-2 rounded-full bg-gray-400" />}
              </div>
              {/* Content */}
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium" style={{ color: h.seen ? '#111827' : '#9ca3af' }}>
                  {h.name}
                </span>
                {h.seen && (
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-xs text-gray-400">{h.date}</span>
                    <span className="text-xs text-gray-400">{h.time}</span>
                    {h.note && <><span className="text-xs text-gray-300">|</span><span className="text-xs text-gray-500">{h.note}</span></>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── History modal ── */
function HistoryModal({ doc, onClose }: { doc: Doc; onClose: () => void }) {
  const gridCols = '1.5fr 0.8fr 1.2fr 1.2fr 1fr 1fr 5rem';
  const allStatuses = Array.from(new Set(HISTORY.map(v => v.status)));
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!filterOpen) return;
    const h = (e: MouseEvent) => { if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [filterOpen]);

  const toggleStatus = (s: string) =>
    setStatusFilter(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const rows = statusFilter.length > 0 ? HISTORY.filter(v => statusFilter.includes(v.status)) : HISTORY;
  const hasFilter = statusFilter.length > 0;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }} onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-[760px] max-w-[95vw] flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()} dir="rtl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          {/* Right: title + filter */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <h3 className="text-base font-bold text-gray-900">היסטוריית גרסאות</h3>
              <p className="text-xs text-gray-500 mt-0.5">{doc.name}</p>
            </div>
            {/* Status filter */}
            <div ref={filterRef} className="relative">
              <button onClick={() => setFilterOpen(o => !o)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${hasFilter ? 'bg-[#EEF4FF] text-[#1B3A6B] border-[#c7d9ff]' : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300'}`}>
                <Filter className="w-3 h-3" />
                <span>{hasFilter ? `סטטוס (${statusFilter.length})` : 'סינון לפי סטטוס'}</span>
                {hasFilter && (
                  <span onClick={e => { e.stopPropagation(); setStatusFilter([]); }}
                    className="hover:opacity-70 transition-opacity ml-0.5">
                    <X className="w-3 h-3" />
                  </span>
                )}
              </button>
              {filterOpen && (
                <div className="absolute left-0 top-full mt-1.5 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 min-w-[180px] z-[999999]" dir="rtl">
                  {allStatuses.map(s => {
                    const sc = STATUS_STYLE[s]?.color ?? '#6b7280';
                    const sb = STATUS_STYLE[s]?.bg    ?? '#f3f4f6';
                    const checked = statusFilter.includes(s);
                    return (
                      <label key={s} className="flex items-center gap-2.5 px-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="checkbox" checked={checked} onChange={() => toggleStatus(s)}
                          className="rounded w-3.5 h-3.5 flex-shrink-0 accent-[#1B3A6B]" />
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{ backgroundColor: sb, color: sc }}>
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: sc }} />
                          {s}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          {/* Left: close */}
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Table */}
        <div className="flex flex-col overflow-hidden flex-1">
          {/* Table header */}
          <div className="flex-shrink-0 grid items-center px-6 py-2.5 text-xs font-semibold"
            style={{ background: '#EBEBEB', color: '#6b7280', gridTemplateColumns: gridCols, columnGap: '1rem' }}>
            <span className="text-right">מס׳ פקודה</span>
            <span className="text-center">מס׳ עדכון</span>
            <span className="text-center">סטטוס</span>
            <span className="text-center">עודכן ב</span>
            <span className="text-center">סימוכין</span>
            <span className="text-center">אושר ע״י</span>
            <span />
          </div>

          {/* Rows */}
          <div className="overflow-y-auto flex-1 px-2">
            {rows.length === 0 ? (
              <div className="flex items-center justify-center py-10 text-sm text-gray-400">לא נמצאו גרסאות</div>
            ) : rows.map((v) => {
              const statusColor = STATUS_STYLE[v.status]?.color ?? '#6b7280';
              const statusBg    = STATUS_STYLE[v.status]?.bg    ?? '#f3f4f6';
              return (
                <div key={v.ver}
                  className="group grid items-center px-4 py-3 mx-0 rounded-xl transition-colors hover:bg-gray-50"
                  style={{ borderBottom: '1px solid #f5f5f5', gridTemplateColumns: gridCols, columnGap: '1rem' }}>
                  <span className="text-right text-sm font-medium text-gray-800">{v.orderNum}</span>
                  <span className="text-center text-sm text-gray-600">{v.updateNum}</span>
                  <span className="flex justify-center">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: statusColor }} />
                      <span className="text-gray-800">{v.status}</span>
                    </span>
                  </span>
                  <span className="text-center text-sm text-gray-500">{v.date}</span>
                  <span className="text-center text-xs text-gray-400">{v.refNum}</span>
                  <span className="text-center text-sm text-gray-600">{v.approvedBy}</span>
                  <div className="flex items-center justify-center">
                    <button className="px-3 py-1 rounded-lg text-xs font-medium transition-colors opacity-0 group-hover:opacity-100"
                      style={{ color: '#1B3A6B', background: '#EEF4FF' }}>
                      לצפייה
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Filter funnel panel ── */
interface FilterFunnelProps {
  statusOptions: string[];
  templateFilter: string[]; setTemplateFilter: (v: string[]) => void;
  statusFilter: string[];   setStatusFilter:   (v: string[]) => void;
  deptFilter: string[];     setDeptFilter:     (v: string[]) => void;
  dateFrom: string;         setDateFrom:       (v: string)   => void;
  dateTo: string;           setDateTo:         (v: string)   => void;
  isAllDocs: boolean;
  orgOptions: string[];
  orgFilter: string[];      setOrgFilter:      (v: string[]) => void;
}

function FilterFunnel({
  statusOptions,
  templateFilter, setTemplateFilter,
  statusFilter,   setStatusFilter,
  deptFilter,     setDeptFilter,
  dateFrom,       setDateFrom,
  dateTo,         setDateTo,
  isAllDocs,
  orgOptions,
  orgFilter,      setOrgFilter,
}: FilterFunnelProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const activeCount =
    templateFilter.length + statusFilter.length + deptFilter.length +
    (dateFrom || dateTo ? 1 : 0) + (isAllDocs ? orgFilter.length : 0);

  const clearAll = () => {
    setTemplateFilter([]); setStatusFilter([]); setDeptFilter([]);
    setDateFrom(''); setDateTo(''); setOrgFilter([]);
  };

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button type="button" onClick={() => setOpen(o => !o)}
        className="relative p-2 rounded-full hover:bg-black/10 transition-colors"
        title="סינון">
        <Filter className="w-4 h-4 text-gray-600" />
        {activeCount > 0 && (
          <span className="absolute top-0.5 left-0.5 w-2 h-2 rounded-full bg-[#1B3A6B]" />
        )}
      </button>

      {open && (
        <div
          className="absolute left-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50 w-72"
          dir="rtl"
          style={{ maxHeight: '82vh', overflowY: 'auto' }}
        >
          {/* תבנית */}
          <SearchableCheckboxSection title="תבנית" options={TEMPLATES} selected={templateFilter} onChange={setTemplateFilter} />

          <div className="my-2 border-t border-gray-100" />

          {/* סטטוס */}
          <SimpleCheckboxSection title="סטטוס" options={statusOptions} selected={statusFilter} onChange={setStatusFilter} />

          <div className="my-2 border-t border-gray-100" />

          {/* מחלקה */}
          <SearchableCheckboxSection title="מחלקה" options={DEPARTMENTS} selected={deptFilter} onChange={setDeptFilter} />

          <div className="my-2 border-t border-gray-100" />

          {/* מועד כניסה לתוקף */}
          <div>
            <p className="text-xs font-semibold text-gray-400 px-4 pb-1.5 uppercase tracking-wide">מועד כניסה לתוקף</p>
            <div className="px-3 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 w-5 flex-shrink-0 text-right">מ-</span>
                <div className="flex-1">
                  <DatePicker value={dateFrom} onChange={setDateFrom} placeholder="מ-" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 w-5 flex-shrink-0 text-right">עד</span>
                <div className="flex-1">
                  <DatePicker value={dateTo} onChange={setDateTo} placeholder="עד" />
                </div>
              </div>
            </div>
          </div>

          {/* שם ארגון — only for כל המסמכים */}
          {isAllDocs && (
            <>
              <div className="my-2 border-t border-gray-100" />
              <SearchableCheckboxSection title="שם ארגון" options={orgOptions} selected={orgFilter} onChange={setOrgFilter} />
            </>
          )}

          {/* Clear all */}
          {activeCount > 0 && (
            <>
              <div className="my-2 border-t border-gray-100" />
              <div className="px-3">
                <button type="button" onClick={clearAll}
                  className="w-full py-1.5 text-xs font-medium text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                  נקה הכל
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════
   NEW DOCUMENT MODAL — constants & helpers
   ══════════════════════════════════════ */

const ENVIRONMENTS_LIST  = ['הסביבה שלי', 'משרד הבריאות', 'משרד הביטחון', 'משרד החינוך', 'משרד הפנים', 'ארגון א׳', 'ארגון ב׳'];
const CLASSIFICATIONS    = ['בלמ"ס', 'סודי', 'סודי ביותר', 'סודי ביותר לשו"ס'];
const HIGH_CLASSIFY      = ['סודי ביותר', 'סודי ביותר לשו"ס'];
const CLASSIFY_TAGS: Record<string, string[]> = {
  'סודי ביותר':         ['ללא', 'תגית א׳', 'תגית ב׳'],
  'סודי ביותר לשו"ס':  ['תגית א׳', 'תגית ב׳'],
};
const DOC_TYPES_FORM     = ['פקודה', 'הוראה', 'מסמך'];
const TEMPLATES_FORM     = ['תבנית פקודה מבצעית', 'תבנית הוראת נהלים', 'תבנית מדיניות', 'תבנית דוח', 'תבנית חוזר'];
const OPERATIVE_FOLDERS  = ['תיקייה מבצעית א׳', 'תיקייה מבצעית ב׳', 'תיקייה מבצעית ג׳'];

const AMAZON_ENTITIES: Record<string, string[]> = {
  'פרויקט': ['פרויקט אלפא', 'פרויקט בטא', 'פרויקט גמא', 'פרויקט דלתא', 'פרויקט אפסילון'],
  'מבנה':   ['מבנה 1', 'מבנה 2', 'מבנה 3', 'מבנה הנהלה', 'מבנה לוגיסטיקה', 'מבנה תפעול'],
  'קומה':   ['קומה 1', 'קומה 2', 'קומה 3', 'קומה 4', 'קומה 5'],
  'חדר':    ['חדר 101', 'חדר 102', 'חדר 201', 'חדר 202', 'חדר ישיבות א׳', 'חדר ישיבות ב׳', 'חדר מפקד', 'חדר מלחמה'],
};

interface NewDocFormData {
  environment: string; classification: string; classificationTag: string;
  dept: string; docType: string; template: string;
  name: string; org: string; displayName: string;
  orderNum: string; updateNum: string;
  operativeFolder: string; amazonEntityType: string; amazonRef: string; summary: string;
  effectiveFrom: string; effectiveTo: string;
  pdfExportScope: 'all' | 'authorized';
  skipApproval: boolean; watermark: boolean; distributeNatzura: boolean;
}

const EMPTY_FORM: NewDocFormData = {
  environment: '', classification: '', classificationTag: '',
  dept: '', docType: '', template: '',
  name: '', org: '', displayName: '',
  orderNum: '1', updateNum: '',
  operativeFolder: '', amazonEntityType: '', amazonRef: '', summary: '',
  effectiveFrom: nowIsoStr(), effectiveTo: '',
  pdfExportScope: 'all', skipApproval: false, watermark: false, distributeNatzura: false,
};

/* small form primitives */
function FLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-semibold text-gray-500 mb-1 text-right">{children}</label>;
}
function FInput({ value, onChange, placeholder, type = 'text', dir = 'rtl' }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string; dir?: string;
}) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} dir={dir}
      className="w-full px-4 py-2 text-sm rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/50 hover:border-gray-400 text-right transition-colors" />
  );
}
/* ── Date + time picker ── */
const MONTH_NAMES_HE = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
const DAY_INITIALS   = ['א','ב','ג','ד','ה','ו','ש'];

function nowIsoStr(): string {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}-${String(n.getDate()).padStart(2,'0')}T${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`;
}

function DateTimePicker({ value, onChange, placeholder = 'בחר תאריך ושעה' }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  const split = (v: string) => {
    const [d, t] = v.includes('T') ? v.split('T') : [v, ''];
    const [h, m] = (t || '').split(':');
    return { d: d ?? '', hh: (h ?? String(new Date().getHours())).padStart(2,'0'), mm: (m ?? String(new Date().getMinutes())).padStart(2,'0') };
  };
  const { d: initD, hh: initH, mm: initM } = split(value);

  const [open, setOpen]       = useState(false);
  const [pos,  setPos]        = useState<{ top?: number; bottom?: number; left: number; width: number } | null>(null);
  const [selDate, setSelDate] = useState(initD);
  const [hours,   setHours]   = useState(initH);
  const [mins,    setMins]    = useState(initM);
  const [viewY, setViewY]     = useState(() => initD ? +initD.split('-')[0] : new Date().getFullYear());
  const [viewM, setViewM]     = useState(() => initD ? +initD.split('-')[1] - 1 : new Date().getMonth());

  const trigRef = useRef<HTMLButtonElement>(null);
  const popRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (trigRef.current?.contains(e.target as Node) || popRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  const openPicker = () => {
    if (!trigRef.current) return;
    const r = trigRef.current.getBoundingClientRect();
    const left = Math.max(8, Math.min(r.left, window.innerWidth - 280));
    const fitsBelow = r.bottom + 380 + 8 <= window.innerHeight;
    setPos(fitsBelow
      ? { top: r.bottom + 4, left, width: Math.max(r.width, 280) }
      : { bottom: window.innerHeight - r.top + 4, left, width: Math.max(r.width, 280) });
    setOpen(true);
  };

  const emit = (d: string, h: string, mi: string) => onChange(d ? `${d}T${h}:${mi}` : '');

  const selectDay = (day: number) => {
    const d = `${viewY}-${String(viewM + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    setSelDate(d);
    emit(d, hours, mins);
  };

  const changeHours = (v: string) => {
    const cleaned = v.replace(/\D/g,'').slice(0,2);
    setHours(cleaned); emit(selDate, cleaned, mins);
  };
  const blurHours = () => {
    const v = Math.min(23, Math.max(0, parseInt(hours,10)||0)).toString().padStart(2,'0');
    setHours(v); emit(selDate, v, mins);
  };
  const changeMins = (v: string) => {
    const cleaned = v.replace(/\D/g,'').slice(0,2);
    setMins(cleaned); emit(selDate, hours, cleaned);
  };
  const blurMins = () => {
    const v = Math.min(59, Math.max(0, parseInt(mins,10)||0)).toString().padStart(2,'0');
    setMins(v); emit(selDate, hours, v);
  };

  const prevMonth = () => viewM === 0  ? (setViewM(11), setViewY(y => y - 1)) : setViewM(m => m - 1);
  const nextMonth = () => viewM === 11 ? (setViewM(0),  setViewY(y => y + 1)) : setViewM(m => m + 1);

  const firstDow   = new Date(viewY, viewM, 1).getDay();
  const daysInMon  = new Date(viewY, viewM + 1, 0).getDate();
  const today      = new Date();
  const todayStr   = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMon }, (_, i) => i + 1),
  ];

  const displayVal = selDate
    ? `${selDate.split('-').reverse().join('.')}  ${hours}:${mins}`
    : '';

  return (
    <>
      <button ref={trigRef} type="button" onClick={openPicker}
        className={['w-full flex items-center justify-between px-4 py-2 border rounded-xl bg-white hover:border-gray-400 focus:outline-none transition-colors',
          open ? 'border-[#1B3A6B] ring-1 ring-[#1B3A6B]/20' : 'border-gray-300'].join(' ')}>
        <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <span className={`text-sm flex-1 text-right mr-2 ${!displayVal ? 'text-gray-400' : 'text-gray-800'}`} dir="ltr">
          {displayVal || placeholder}
        </span>
      </button>

      {open && pos && (
        <div ref={popRef}
          className="fixed bg-white rounded-2xl shadow-xl border border-gray-100"
          style={{ top: pos.top, bottom: pos.bottom, left: pos.left, width: pos.width, zIndex: 999999 }}
          dir="rtl">

          {/* Month navigation */}
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <button type="button" onClick={nextMonth}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="text-sm font-bold text-gray-900">
              {MONTH_NAMES_HE[viewM]} {viewY}
            </span>
            <button type="button" onClick={prevMonth}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Day-of-week headers */}
          <div className="grid grid-cols-7 px-3 mb-1">
            {DAY_INITIALS.map(d => (
              <div key={d} className="text-center text-xs text-gray-400 py-1">{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 px-3 gap-y-0.5">
            {cells.map((day, i) => {
              if (!day) return <div key={i} />;
              const ds = `${viewY}-${String(viewM+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
              const isSel   = ds === selDate;
              const isToday = ds === todayStr;
              return (
                <button key={i} type="button" onClick={() => selectDay(day)}
                  className={[
                    'mx-auto w-9 h-9 flex items-center justify-center text-sm rounded-full transition-colors',
                    isSel   ? 'border-2 border-[#1B3A6B] text-[#1B3A6B] font-bold' :
                    isToday ? 'border-2 border-[#1B3A6B] text-[#1B3A6B] font-semibold hover:bg-blue-50' :
                              'text-gray-800 hover:bg-gray-100',
                  ].join(' ')}>
                  {day}
                </button>
              );
            })}
          </div>

          {/* Time — no arrows, just inputs */}
          <div className="border-t border-gray-100 mx-3 mt-3" />
          <div className="px-4 py-3 flex flex-col items-center gap-2">
            <span className="text-xs text-gray-400">שעה</span>
            <div className="flex items-center gap-2 justify-center" dir="ltr">
              <input value={hours} onChange={e => changeHours(e.target.value)} onBlur={blurHours}
                className="w-9 h-9 text-center text-sm font-semibold text-gray-800 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-[#1B3A6B] focus:ring-1 focus:ring-[#1B3A6B]/20 transition-colors"
                maxLength={2} inputMode="numeric" />
              <span className="text-gray-400 text-lg font-light">:</span>
              <input value={mins} onChange={e => changeMins(e.target.value)} onBlur={blurMins}
                className="w-9 h-9 text-center text-sm font-semibold text-gray-800 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-[#1B3A6B] focus:ring-1 focus:ring-[#1B3A6B]/20 transition-colors"
                maxLength={2} inputMode="numeric" />
            </div>
          </div>

        </div>
      )}
    </>
  );
}

/* Styled popup select — matches the system CustomSelect design */
function FSelect({ value, onChange, options, placeholder }: {
  value: string; onChange: (v: string) => void; options: string[]; placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const trigRef = useRef<HTMLButtonElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (trigRef.current?.contains(e.target as Node) || dropRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  const openDrop = () => {
    if (trigRef.current) {
      const rect = trigRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    }
    setOpen(true);
  };

  return (
    <>
      <button ref={trigRef} type="button" onClick={openDrop}
        className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-xl bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/50 transition-colors">
        <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
        <span className={`text-sm flex-1 text-right ${!value ? 'text-gray-400' : 'text-gray-800'}`}>
          {value || placeholder || 'בחר...'}
        </span>
      </button>
      {open && pos && (
        <div ref={dropRef} className="fixed bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 overflow-y-auto"
          style={{ top: pos.top, left: pos.left, width: pos.width, maxHeight: 240, zIndex: 999999 }} dir="rtl">
          {options.map(opt => (
            <button key={opt} type="button" onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-right px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 ${value === opt ? 'text-[#1B3A6B] font-medium bg-[#EEF4FF]' : 'text-gray-700'}`}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button type="button" onClick={onChange}
      className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${checked ? 'bg-[#1B3A6B]' : 'bg-gray-200'}`}>
      <span className={`absolute top-0.5 bottom-0.5 w-4 rounded-full bg-white shadow transition-all ${checked ? 'left-0.5' : 'right-0.5'}`} />
    </button>
  );
}
function FSep() { return <div className="border-t border-gray-100" />; }
function FSectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{children}</p>;
}

/* ── Duplicate search modal ── */
function DuplicateSearchModal({ onSelect, onClose }: { onSelect: (doc: Doc) => void; onClose: () => void }) {
  const [q, setQ] = useState('');
  const pool = [...DOCS.distributed, ...DOCS.archive];
  const visible = q.trim()
    ? pool.filter(d => d.name.includes(q.trim()) || d.orderNum.includes(q.trim()))
    : pool.slice(0, 10);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-[560px] max-w-[95vw] max-h-[80vh] flex flex-col"
        onClick={e => e.stopPropagation()} dir="rtl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-xl text-gray-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
          <h2 className="text-base font-bold text-gray-900">בחר מסמך לשכפול</h2>
        </div>
        <div className="px-6 py-3 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input value={q} onChange={e => setQ(e.target.value)} autoFocus
              placeholder="חיפוש לפי שם מסמך, מספר פקודה..."
              className="w-full pr-10 pl-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#1B3A6B]/40 text-right" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-2">
          {visible.map(doc => (
            <button key={doc.id} onClick={() => onSelect(doc)}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors text-right">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{doc.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{doc.orderNum} · {doc.dept} · {doc.env}</p>
              </div>
              <StatusBadge status={doc.status} />
            </button>
          ))}
          {visible.length === 0 && (
            <div className="py-10 text-center text-sm text-gray-400">לא נמצאו מסמכים</div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── New document form modal — single scrollable page ── */
export function NewDocModal({ onClose, onSuccess, initialData, title = 'פתיחת מסמך חדש' }: {
  onClose: () => void; onSuccess?: () => void; initialData?: Partial<NewDocFormData>; title?: string;
}) {
  const [form, setForm] = useState<NewDocFormData>({ ...EMPTY_FORM, ...initialData });
  const upd = <K extends keyof NewDocFormData>(k: K, v: NewDocFormData[K]) =>
    setForm(f => ({ ...f, [k]: v }));

  const isHighClass = HIGH_CLASSIFY.includes(form.classification);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-[660px] max-w-[95vw] max-h-[85vh] flex flex-col"
        onClick={e => e.stopPropagation()} dir="rtl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-base font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-xl text-gray-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

          {/* ── פרטי זיהוי ── */}
          <FSectionTitle>פרטי זיהוי</FSectionTitle>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <div>
              <FLabel>ארגון</FLabel>
              <FSelect value={form.org} onChange={v => upd('org', v)} options={ENVIRONMENTS_LIST} placeholder="בחר ארגון" />
            </div>
            <div>
              <FLabel>סיווג</FLabel>
              <FSelect
                value={form.classification}
                onChange={v => { upd('classification', v); upd('classificationTag', ''); }}
                options={CLASSIFICATIONS}
                placeholder="בחר סיווג"
              />
            </div>
            <div>
              <FLabel>מחלקה</FLabel>
              <FSelect value={form.dept} onChange={v => upd('dept', v)} options={DEPARTMENTS} placeholder="בחר מחלקה" />
            </div>
            {isHighClass ? (
              <div>
                <FLabel>תגית סיווג</FLabel>
                <FSelect
                  value={form.classificationTag}
                  onChange={v => upd('classificationTag', v)}
                  options={CLASSIFY_TAGS[form.classification] ?? []}
                  placeholder="בחר תגית"
                />
              </div>
            ) : <div />}
          </div>

          <FSep />

          {/* ── פרטי המסמך ── */}
          <FSectionTitle>פרטי המסמך</FSectionTitle>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <div>
              <FLabel>סוג מסמך</FLabel>
              <FSelect value={form.docType} onChange={v => upd('docType', v)} options={DOC_TYPES_FORM} placeholder="בחר סוג" />
            </div>
            <div>
              <FLabel>בחירת תבנית</FLabel>
              <FSelect value={form.template} onChange={v => upd('template', v)} options={TEMPLATES_FORM} placeholder="בחר תבנית" />
            </div>
            <div className="col-span-2">
              <FLabel>שם המסמך</FLabel>
              <FInput value={form.name} onChange={v => upd('name', v)} placeholder="הזן את שם המסמך" />
            </div>
            <div>
              <FLabel>סוג המסמך — שם תצוגה</FLabel>
              <FInput value={form.displayName} onChange={v => upd('displayName', v)} placeholder="שם לתצוגה" />
            </div>
            <div>
              <FLabel>מס׳ פקודה</FLabel>
              <FInput value={form.orderNum} onChange={v => upd('orderNum', v)} placeholder="1" />
            </div>
            <div>
              <FLabel>מספר עדכון (מקור)</FLabel>
              <FInput value={form.updateNum} onChange={v => upd('updateNum', v)} placeholder="מספר עדכון" />
            </div>
          </div>

          <FSep />

          {/* ── שיוך ── */}
          <FSectionTitle>שיוך</FSectionTitle>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <div className="col-span-2">
              <FLabel>שיוך לתיקייה מבצעית</FLabel>
              <FSelect value={form.operativeFolder} onChange={v => upd('operativeFolder', v)} options={OPERATIVE_FOLDERS} placeholder="בחר תיקייה" />
            </div>
            <div className="col-span-2">
              <FLabel>שיוך לאמזונס</FLabel>
              <div className="flex gap-2">
                <div className="flex-1">
                  <FSelect value={form.amazonEntityType}
                    onChange={v => { upd('amazonEntityType', v); upd('amazonRef', ''); }}
                    options={Object.keys(AMAZON_ENTITIES)} placeholder="בחר ישות" />
                </div>
                {form.amazonEntityType && (
                  <div className="flex-1">
                    <FSelect value={form.amazonRef} onChange={v => upd('amazonRef', v)}
                      options={AMAZON_ENTITIES[form.amazonEntityType]} placeholder="בחר שם" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <FSep />

          {/* ── תוכן ותוקף ── */}
          <FSectionTitle>תוכן ותוקף</FSectionTitle>
          <div>
            <FLabel>עיקרי המסמך</FLabel>
            <input type="text" value={form.summary} onChange={e => upd('summary', e.target.value)}
              placeholder="תאר את עיקרי המסמך..." dir="rtl"
              className="w-full px-4 py-2 text-sm rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/50 hover:border-gray-400 text-right transition-colors" />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <div>
              <FLabel>כניסה לתוקף</FLabel>
              <DateTimePicker value={form.effectiveFrom} onChange={v => upd('effectiveFrom', v)} placeholder="בחר תאריך ושעה" />
            </div>
            <div>
              <FLabel>יציאה מתוקף</FLabel>
              <DateTimePicker value={form.effectiveTo} onChange={v => upd('effectiveTo', v)} placeholder="בחר תאריך ושעה" />
            </div>
          </div>

          <FSep />

          {/* ── הגדרות ── */}
          <FSectionTitle>הגדרות</FSectionTitle>
          <div className="flex flex-col rounded-xl overflow-hidden border border-gray-100">
            <div className="flex items-center justify-between px-4 py-3 bg-white">
              <span className="text-sm text-gray-700">ייצוא ל-PDF</span>
              <div className="flex rounded-lg overflow-hidden border border-gray-200">
                {(['authorized', 'all'] as const).map((opt, i) => (
                  <button key={opt} type="button" onClick={() => upd('pdfExportScope', opt)}
                    className="px-3 py-1.5 text-xs font-medium transition-colors"
                    style={{
                      background: form.pdfExportScope === opt ? '#1B3A6B' : '#fff',
                      color: form.pdfExportScope === opt ? '#fff' : '#6b7280',
                      borderRight: i === 0 ? '1px solid #e5e7eb' : undefined,
                    }}>
                    {opt === 'authorized' ? 'למורשים בלבד' : 'לאפשר לכולם'}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors"
              style={{ borderTop: '1px solid #f3f4f6' }}>
              <span className="text-sm text-gray-700">ביטול סבב אישורים על סעיפי הפקודה</span>
              <Toggle checked={form.skipApproval} onChange={() => upd('skipApproval', !form.skipApproval)} />
            </div>
            <div className="flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors"
              style={{ borderTop: '1px solid #f3f4f6' }}>
              <span className="text-sm text-gray-700">הוספת סימן מים</span>
              <Toggle checked={form.watermark} onChange={() => upd('watermark', !form.watermark)} />
            </div>
            <div className="flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors"
              style={{ borderTop: '1px solid #f3f4f6' }}>
              <span className="text-sm text-gray-700">האם תרצה להפיץ את הפקודה כפקודה נצורה?</span>
              <Toggle checked={form.distributeNatzura} onChange={() => upd('distributeNatzura', !form.distributeNatzura)} />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            ביטול
          </button>
          <button onClick={() => { onClose(); onSuccess?.(); }}
            className="px-6 py-2 text-sm font-semibold rounded-xl text-white transition-all hover:opacity-90 active:scale-95"
            style={{ background: '#1B3A6B', boxShadow: '0 2px 8px rgba(27,58,107,0.3)' }}>
            יצירת מסמך
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── New document dropdown ── */
function NewDocDropdown({ onNew, onDuplicate }: { onNew: () => void; onDuplicate: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button type="button" onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
        style={{ background: '#1B3A6B', color: '#fff', boxShadow: '0 2px 8px rgba(27,58,107,0.35)' }}>
        <Plus className="w-4 h-4" />
        <span>מסמך חדש</span>
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-2 bg-white rounded-2xl shadow-lg border border-gray-100 py-1 z-50 min-w-[200px]" dir="rtl">
          <button type="button" onClick={() => { setOpen(false); onNew(); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-right text-gray-700 hover:bg-gray-50 transition-colors">
            <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
            פתיחת מסמך חדש
          </button>
          <button type="button" onClick={() => { setOpen(false); onDuplicate(); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-right text-gray-700 hover:bg-gray-50 transition-colors">
            <Copy className="w-4 h-4 text-gray-400 flex-shrink-0" />
            שכפול מסמך קיים
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Trash catalog ── */
function TrashCatalog({ onBack }: { onBack: () => void }) {
  const [search, setSearch] = useState('');
  const [menuRow, setMenuRow] = useState<{ id: string; x: number; y: number; flipped: boolean } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuRow) return;
    const h = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuRow(null); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [menuRow]);

  const q = search.trim();
  const filtered = TRASH_DOCS.filter(d => !q || d.name.includes(q) || d.orderNum.includes(q));

  const openMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const flipped = rect.bottom > window.innerHeight * 0.55;
    setMenuRow({ id, x: rect.left, y: flipped ? window.innerHeight - rect.top + 6 : rect.bottom + 6, flipped });
  };

  const gridCols = '1.5rem 3fr 1fr 1fr 1fr 1fr 2.5rem';

  return (
    <div className="flex-1 flex flex-col overflow-hidden p-6 gap-3" dir="rtl">

      {/* Header */}
      <div className="flex-shrink-0 flex items-center gap-3">
        <button onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
          <span>חזרה</span>
        </button>
        <div className="w-px h-4 bg-gray-200" />
        <Trash2 className="w-4 h-4 text-gray-400" />
        <span className="text-base font-semibold text-gray-800">סל מחזור</span>
        <span className="text-xs text-gray-400">· פריטים יימחקו לצמיתות לאחר 30 יום</span>
      </div>

      {/* Search row */}
      <div className="flex-shrink-0 flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-full flex-1"
          style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.05)' }}>
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="חיפוש לפי שם, מספר פקודה..."
              className="w-full pr-9 pl-3 py-1.5 text-sm text-right focus:outline-none bg-transparent"
              style={{ border: 'none', outline: 'none' }}
            />
          </div>
        </div>
      </div>

      {/* Table card */}
      <div className="flex-1 flex flex-col rounded-2xl overflow-hidden bg-white"
        style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)' }}>

        {/* Header strip */}
        <div className="flex-shrink-0 grid items-center px-8 py-3 text-sm font-semibold"
          style={{ background: '#EBEBEB', color: '#6b7280', gridTemplateColumns: gridCols, columnGap: '1rem' }}>
          <span />
          <span className="text-right">שם המסמך</span>
          <span className="text-center">מס׳ פקודה</span>
          <span className="text-center">עדכון</span>
          <span className="text-center">תימחק בעוד</span>
          <span className="text-center">מס׳ סימוכין</span>
          <span />
        </div>

        {/* Rows */}
        <div className="flex-1 flex flex-col px-4">
          {filtered.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-sm text-gray-400">לא נמצאו מסמכים</div>
          ) : filtered.map(doc => {
            const urgentRed = doc.daysLeft <= 7;
            return (
              <div key={doc.id}
                className="group grid items-center px-4 py-3 rounded-xl transition-colors hover:bg-gray-50"
                style={{ borderBottom: '1px solid #f5f5f5', gridTemplateColumns: gridCols, columnGap: '1rem' }}>
                <span />
                <span className="text-right text-sm font-medium text-gray-800"
                  style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.name}</span>
                <span className="text-center text-xs text-gray-500">{doc.orderNum}</span>
                <span className="text-center text-sm text-gray-500">{doc.updateNum}</span>
                {/* Days left — red */}
                <span className="text-center text-sm font-semibold"
                  style={{ color: urgentRed ? '#dc2626' : '#ef4444' }}>
                  {doc.daysLeft} ימים
                </span>
                <span className="text-center text-xs text-gray-400">{doc.refNum}</span>
                <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={e => openMenu(e, doc.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    title="פעולות">
                    <MoreHorizontal className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Row context menu */}
      {menuRow && (
        <div ref={menuRef} className="fixed z-[999999]"
          style={menuRow.flipped ? { bottom: menuRow.y, left: menuRow.x } : { top: menuRow.y, left: menuRow.x }}>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 min-w-[210px]" dir="rtl">
            {TRASH_ROW_ACTIONS.map((action, i) => {
              if ('sep' in action) return <div key={`sep-${i}`} className="my-1 border-t border-gray-100" />;
              const { label, Icon, danger } = action;
              return (
                <button key={label} onClick={() => setMenuRow(null)}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-right transition-colors hover:bg-gray-50 ${danger ? 'text-red-500' : 'text-gray-700'}`}>
                  <Icon className={`w-4 h-4 flex-shrink-0 ${danger ? 'text-red-400' : 'text-gray-400'}`} />
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main catalog view ── */
function DocumentCatalog({ department, tab, setTab, onEditDoc, onOpenTrash, folderFilter, subFilter, envFolderFilter, envDeptFilter }: { department: string; tab: Tab; setTab: (t: Tab) => void; onEditDoc?: (doc: { id: string; name: string; status: string; orderNum: string }) => void; onOpenTrash?: () => void; folderFilter?: string | null; subFilter?: string | null; envFolderFilter?: string | null; envDeptFilter?: string | null }) {
  const [search, setSearch] = useState('');
  const [templateFilter, setTemplateFilter] = useState<string[]>([]);
  const [statusFilter,   setStatusFilter]   = useState<string[]>([]);
  const [deptFilter,     setDeptFilter]     = useState<string[]>([]);
  const [orgFilter,      setOrgFilter]      = useState<string[]>([]);
  const [dateFrom,       setDateFrom]       = useState('');
  const [dateTo,         setDateTo]         = useState('');
  const [page, setPage] = useState(1);
  const [distSubFilter, setDistSubFilter] = useState<string>('כל המסמכים');
  const [historyDoc, setHistoryDoc] = useState<Doc | null>(null);
  const [menuRow, setMenuRow] = useState<{ doc: Doc; x: number; y: number; flipped: boolean } | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const menuRef = useRef<HTMLDivElement>(null);

  // New doc / duplicate modals
  const [showNewDoc, setShowNewDoc] = useState(false);
  const [showDuplicate, setShowDuplicate] = useState(false);
  const [newDocInit, setNewDocInit] = useState<Partial<NewDocFormData>>({});
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Row action modals
  const [catalogModal, setCatalogModal] = useState<{ type: 'edit' | 'duplicate' | 'permissions' | 'delete' | 'approval-round' | 'cancel-doc'; doc: Doc } | null>(null);
  const [receiptModal, setReceiptModal] = useState<{ doc: Doc; receipt: string } | null>(null);
  const [shareModal, setShareModal] = useState<Doc | null>(null);
  const [docDetailsModal, setDocDetailsModal] = useState<{ doc: Doc; mode: 'edit' | 'duplicate' | 'issue-update' | 'issue-new' } | null>(null);
  const [menuActionPhase, setMenuActionPhase] = useState<{ id: string; label: string; phase: 'loading' | 'done' } | null>(null);
  const [showCancelToast, setShowCancelToast] = useState(false);
  const [hierarchyModal, setHierarchyModal] = useState<Doc | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  useEffect(() => {
    setPage(1); setSearch('');
    setTemplateFilter([]); setStatusFilter([]); setDeptFilter([]);
    setOrgFilter([]); setDateFrom(''); setDateTo('');
    setDistSubFilter('כל המסמכים');
  }, [tab, department]);
  useEffect(() => { setPage(1); }, [search, templateFilter, statusFilter, deptFilter, orgFilter, dateFrom, dateTo]);

  useEffect(() => {
    if (!menuRow) return;
    const h = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuRow(null); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [menuRow]);

  const allDocs = DOCS[tab];
  const statusOptions = Array.from(new Set(allDocs.map(d => d.status)));
  const orgOptions    = Array.from(new Set(allDocs.flatMap(d => d.env ? [d.env] : [])));

  const isAllDocs = department === 'כל המסמכים';
  const extraCols = (isAllDocs ? 2 : 0) + (tab === 'distribution' ? 3 : 0);
  const nameFr = tab === 'distribution' ? '2fr' : '3fr';
  const colGap = tab === 'distribution' ? '0.6rem' : '1rem';
  const gridCols = `1.5rem ${nameFr} ${Array(5 + extraCols).fill('1fr').join(' ')} 2.5rem`;
  const col4Label = tab === 'drafts' ? 'תאריך עדכון' : tab === 'distribution' ? 'תאריך הפצה' : 'כניסה לתוקף';

  const DIST_SUB_STATUS: Record<string, string> = {
    'בסבב אישורים':    'בסבב אישורים',
    'ממתינות לחמ״ל':  'ממתין להפצה',
    'הופצו':            'מבצעית',
    'בוטלו':            'התבטלה',
  };

  const filtered = allDocs.filter(d => {
    const q = search.trim();
    if (q && !d.name.includes(q) && !d.orderNum.includes(q) && !d.refNum.includes(q)) return false;
    if (templateFilter.length > 0 && !templateFilter.includes(d.type)) return false;
    if (statusFilter.length   > 0 && !statusFilter.includes(d.status)) return false;
    if (deptFilter.length     > 0 && (!d.dept || !deptFilter.includes(d.dept))) return false;
    if (isAllDocs && orgFilter.length > 0 && (!d.env || !orgFilter.includes(d.env))) return false;
    if (isAllDocs) {
      if (envFolderFilter && d.env !== envFolderFilter) return false;
      if (envDeptFilter) {
        const stripped = envDeptFilter.replace(/^מחלקת /, '');
        if (d.dept !== stripped) return false;
      }
    } else {
      const activeFolder = subFilter ?? folderFilter;
      if (activeFolder && d.folder !== activeFolder) return false;
    }
    if (dateFrom || dateTo) {
      const [dd, mm, yy] = d.effectiveDate.split('/');
      const iso = `${yy}-${mm}-${dd}`;
      if (dateFrom && iso < dateFrom) return false;
      if (dateTo   && iso > dateTo)   return false;
    }
    if (tab === 'distribution' && distSubFilter !== 'כל המסמכים') {
      const expectedStatus = DIST_SUB_STATUS[distSubFilter];
      if (expectedStatus && d.status !== expectedStatus) return false;
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openMenu = (e: React.MouseEvent, doc: Doc) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const flipped = rect.bottom > window.innerHeight * 0.55;
    setMenuRow({ doc, x: rect.left, y: flipped ? window.innerHeight - rect.top + 6 : rect.bottom + 6, flipped });
  };

  const handleMenuAction = useCallback((label: string) => {
    if (!menuRow) return;
    const doc = menuRow.doc;
    if (label === 'שכפול') {
      if (tab === 'distributed' || tab === 'archive') {
        setDocDetailsModal({ doc, mode: 'duplicate' });
      } else {
        setCatalogModal({ type: 'duplicate', doc });
      }
    } else if (label === 'הוצאת עדכון למסמך') {
      setDocDetailsModal({ doc, mode: 'issue-update' });
    } else if (label === 'שינוי מס׳ פקודה') {
      setDocDetailsModal({ doc, mode: 'issue-new' });
    } else if (label === 'עריכת פרטי מסמך' || label === 'עריכת פרטי המסמך') {
      if (tab === 'distributed' || tab === 'archive') {
        setDocDetailsModal({ doc, mode: 'edit' });
      } else {
        setCatalogModal({ type: 'edit', doc });
      }
    } else if (label === 'צפייה בסבב אישורים') {
      setCatalogModal({ type: 'approval-round', doc });
    } else if (label === 'הרשאות' || label === 'הרשאות צפייה' || label === 'הרשאות ובקרה') {
      setCatalogModal({ type: 'permissions', doc });
    } else if (INLINE_PHASE_ACTIONS.has(label)) {
      setMenuActionPhase({ id: doc.id, label, phase: 'loading' });
      setTimeout(() => setMenuActionPhase({ id: doc.id, label, phase: 'done' }), 900);
      setTimeout(() => { setMenuActionPhase(null); setMenuRow(null); }, 1900);
    } else if (label === 'יצירת היררכית מסמכים') {
      setHierarchyModal(doc);
    } else if (label === 'מחיקת המסמך') {
      setCatalogModal({ type: 'delete', doc });
    } else if (label === 'ביטול מסמך') {
      setCatalogModal({ type: 'cancel-doc', doc });
    }
  }, [menuRow]);

  const pageWindow = (): number[] => {
    let start = Math.max(1, page - 2);
    if (start + 4 > totalPages) start = Math.max(1, totalPages - 4);
    return Array.from({ length: 5 }, (_, i) => start + i);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden p-6 gap-3" dir="rtl">

      {/* ── Tabs ── */}
      <div className="flex-shrink-0 flex items-center gap-1 px-1">
        {TABS.map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)}
            className="relative px-4 py-2 text-sm transition-colors focus:outline-none rounded-xl"
            style={{ color: tab === key ? '#111827' : '#9ca3af', fontWeight: tab === key ? 600 : 400 }}>
            {label}
            {tab === key && (
              <span className="absolute bottom-1 right-4 left-4 h-[2px] rounded-full"
                style={{ background: '#111827' }} />
            )}
          </button>
        ))}
      </div>

      {/* ── Search row ── */}
      <div className="flex-shrink-0 flex items-center gap-2">
        {/* Pill 1: search + filter */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-full flex-1"
          style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.05)' }}>
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="חיפוש לפי שם, מספר פקודה..."
              className="w-full pr-9 pl-3 py-1.5 text-sm text-right focus:outline-none bg-transparent"
              style={{ border: 'none', outline: 'none' }}
            />
          </div>
          <div className="w-px h-5 bg-gray-200 flex-shrink-0" />
          <FilterFunnel
            statusOptions={statusOptions}
            templateFilter={templateFilter} setTemplateFilter={setTemplateFilter}
            statusFilter={statusFilter}     setStatusFilter={setStatusFilter}
            deptFilter={deptFilter}         setDeptFilter={setDeptFilter}
            dateFrom={dateFrom}             setDateFrom={setDateFrom}
            dateTo={dateTo}                 setDateTo={setDateTo}
            isAllDocs={isAllDocs}
            orgOptions={orgOptions}
            orgFilter={orgFilter}           setOrgFilter={setOrgFilter}
          />
        </div>
        {/* Pill 2 & 3: drafts-only actions */}
        {tab === 'drafts' && <>
          <button type="button" title="סל מחזור" onClick={onOpenTrash}
            className="flex items-center justify-center p-2 rounded-full flex-shrink-0 transition-colors hover:bg-gray-100"
            style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.05)', color: '#6b7280', width: '36px', height: '36px' }}>
            <Trash2 className="w-4 h-4" />
          </button>
          <NewDocDropdown
            onNew={() => { setNewDocInit({}); setShowNewDoc(true); }}
            onDuplicate={() => setShowDuplicate(true)}
          />
        </>}
      </div>

      {/* Active filter chips */}
      {(templateFilter.length > 0 || statusFilter.length > 0 || deptFilter.length > 0 || dateFrom || dateTo || orgFilter.length > 0) && (
        <div className="flex-shrink-0 flex items-center gap-2 flex-wrap">
          {templateFilter.length > 0 && (
            <FilterChip
              label={templateFilter.length === 1 ? `תבנית: ${templateFilter[0]}` : `תבנית (${templateFilter.length})`}
              onClear={() => setTemplateFilter([])}
            />
          )}
          {statusFilter.length > 0 && (
            <FilterChip
              label={statusFilter.length === 1 ? `סטטוס: ${statusFilter[0]}` : `סטטוס (${statusFilter.length})`}
              onClear={() => setStatusFilter([])}
            />
          )}
          {deptFilter.length > 0 && (
            <FilterChip
              label={deptFilter.length === 1 ? `מחלקה: ${deptFilter[0]}` : `מחלקה (${deptFilter.length})`}
              onClear={() => setDeptFilter([])}
            />
          )}
          {(dateFrom || dateTo) && (
            <FilterChip
              label={`תאריך: ${dateFrom ? dateFrom.split('-').reverse().join('/') : '...'} – ${dateTo ? dateTo.split('-').reverse().join('/') : '...'}`}
              onClear={() => { setDateFrom(''); setDateTo(''); }}
            />
          )}
          {isAllDocs && orgFilter.length > 0 && (
            <FilterChip
              label={orgFilter.length === 1 ? `ארגון: ${orgFilter[0]}` : `ארגון (${orgFilter.length})`}
              onClear={() => setOrgFilter([])}
            />
          )}
        </div>
      )}

      {/* ── Distribution sub-filter tabs ── */}
      {tab === 'distribution' && (
        <div className="flex-shrink-0 flex items-end" style={{ borderBottom: '1px solid #e5e7eb' }}>
          {['כל המסמכים', 'בסבב אישורים', 'ממתינות לחמ״ל', 'הופצו', 'בוטלו'].map(label => {
            const active = distSubFilter === label;
            return (
              <button key={label} onClick={() => { setDistSubFilter(label); setPage(1); }}
                className="px-5 py-2 text-sm transition-colors whitespace-nowrap"
                style={{
                  color: active ? '#1B3A6B' : '#9ca3af',
                  fontWeight: active ? 600 : 400,
                  cursor: 'pointer',
                  background: active ? '#fff' : 'transparent',
                  border: active ? '1px solid #e5e7eb' : 'none',
                  borderBottom: active ? '1px solid #fff' : 'none',
                  borderRadius: active ? '6px 6px 0 0' : 0,
                  position: 'relative',
                  bottom: active ? -1 : 0,
                  outline: 'none',
                }}>
                {label}
              </button>
            );
          })}
        </div>
      )}

      {/* ── White card ── */}
      <div className="flex-1 flex flex-col rounded-2xl overflow-hidden bg-white"
        style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)' }}>

        {/* Table header strip — edge-to-edge, rounded by card overflow-hidden */}
        <div className="flex-shrink-0 grid items-center px-8 py-3 text-sm font-semibold"
          style={{ background: '#EBEBEB', color: '#6b7280', gridTemplateColumns: gridCols, columnGap: colGap }}>
          <span />
          <span className="text-right">שם המסמך</span>
          {isAllDocs && <span className="text-center">סביבה</span>}
          {isAllDocs && <span className="text-center">מחלקה</span>}
          <span className="text-center">מס׳ פקודה</span>
          <span className="text-center">עדכון</span>
          <span className="text-center">{col4Label}</span>
          <span className="text-center">מס׳ סימוכין</span>
          {tab === 'distribution' && <span className="text-center">אושר ע״י</span>}
          <span className="text-center">סטטוס</span>
          {tab === 'distribution' && <span className="text-center">וידוא קבלה</span>}
          {tab === 'distribution' && <span className="text-center"></span>}
          <span />
        </div>

        {/* Rows */}
        <div className="flex-1 flex flex-col px-4">
          {pageRows.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-sm text-gray-400">לא נמצאו מסמכים</div>
          ) : pageRows.map(doc => {
            const statusColor = STATUS_STYLE[doc.status]?.color ?? '#6b7280';
            const isExpanded = expandedRows.has(doc.id);
            const hasChildren = !!(doc.children?.length);
            return (
              <div key={doc.id}>
                {/* Main row */}
                <div className="group grid items-center px-4 py-3 rounded-xl transition-colors hover:bg-gray-50 cursor-pointer"
                  style={{ borderBottom: isExpanded ? 'none' : '1px solid #f5f5f5', gridTemplateColumns: gridCols, columnGap: colGap }}
                  onClick={() => onEditDoc?.({ id: doc.id, name: doc.name, status: doc.status, orderNum: doc.orderNum })}>
                  {/* Expand arrow — far right, always visible for parent docs */}
                  <div className="flex items-center justify-center">
                    {hasChildren ? (
                      <button onClick={e => { e.stopPropagation(); toggleExpand(doc.id); }}
                        className="p-0.5 rounded text-gray-400 hover:text-gray-600 transition-colors"
                        title="הצג מסמכים תחת מסמך זה">
                        <ChevronDown className="w-3.5 h-3.5 transition-transform" style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(90deg)' }} />
                      </button>
                    ) : <span />}
                  </div>
                  <span className="text-right text-sm font-medium text-gray-800" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.name}</span>
                  {isAllDocs && <span className="text-center text-xs text-gray-500">{doc.env}</span>}
                  {isAllDocs && <span className="text-center text-xs text-gray-500">{doc.dept}</span>}
                  <span className="text-center text-xs text-gray-500">{doc.orderNum}</span>
                  <span className="text-center text-sm text-gray-500">{doc.updateNum}</span>
                  <span className="text-center text-sm text-gray-500">{doc.effectiveDate}</span>
                  <span className="text-center text-xs text-gray-400">{doc.refNum}</span>
                  {tab === 'distribution' && <span className="text-center text-sm text-gray-500">s1234567</span>}
                  <span className="inline-flex items-center justify-start gap-1.5 w-full">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: statusColor }} />
                    <span className="text-sm text-gray-800 whitespace-nowrap">{doc.status}</span>
                  </span>
                  {tab === 'distribution' && (() => {
                    const receipts = ['1/2','2/3','0/1','—','1/4','—','3/3','2/2'];
                    const idx = DOCS.distribution.findIndex(d => d.id === doc.id);
                    const val = receipts[idx % receipts.length] ?? '—';
                    const clickable = val !== '—';
                    return (
                      <span className={`text-center text-sm flex justify-center ${clickable ? 'cursor-pointer font-semibold hover:underline' : 'text-gray-400'}`}
                        style={clickable ? { color: '#1B3A6B' } : {}}
                        onClick={clickable ? e => { e.stopPropagation(); setReceiptModal({ doc, receipt: val }); } : undefined}>
                        {val}
                      </span>
                    );
                  })()}
                  {tab === 'distribution' && (() => {
                    const hasNew = [true, false, true, false, true, false, false, true];
                    const idx = DOCS.distribution.findIndex(d => d.id === doc.id);
                    return hasNew[idx % hasNew.length]
                      ? (
                        <div className="group/nu flex justify-center items-center" onClick={e => e.stopPropagation()}>
                          <span className="group-hover/nu:hidden text-xs font-medium text-red-500 whitespace-nowrap">נוספו משתמשים</span>
                          <button className="hidden group-hover/nu:flex px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap"
                            style={{ background: '#EEF4FF', color: '#1B3A6B' }}
                            onClick={e => { e.stopPropagation(); setShareModal(doc); }}>
                            שיתוף מחדש
                          </button>
                        </div>
                      ) : <span />;
                  })()}
                  <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={e => { e.stopPropagation(); setHistoryDoc(doc); }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                      title="היסטוריית גרסאות">
                      <Clock className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={e => openMenu(e, doc)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                      title="פעולות">
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Child rows */}
                {hasChildren && isExpanded && (
                  <div className="mb-1 overflow-hidden rounded-xl"
                    style={{ background: '#f0f4f8', borderRight: '3px solid #cbd5e1' }}>
                    {doc.children!.map((child, idx) => {
                      const childStatusColor = STATUS_STYLE[child.status]?.color ?? '#6b7280';
                      return (
                        <div key={child.id}
                          className="grid items-center px-4 py-2.5"
                          style={{
                            gridTemplateColumns: gridCols,
                            columnGap: colGap,
                            borderBottom: idx < doc.children!.length - 1 ? '1px solid #e2e8f0' : 'none',
                          }}>
                          <span />
                          <span className="text-right text-xs text-gray-600" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{child.name}</span>
                          {isAllDocs && <span className="text-center text-xs text-gray-400">{child.env}</span>}
                          {isAllDocs && <span className="text-center text-xs text-gray-400">{child.dept}</span>}
                          <span className="text-center text-xs text-gray-400">{child.orderNum}</span>
                          <span className="text-center text-xs text-gray-400">{child.updateNum}</span>
                          <span className="text-center text-xs text-gray-400">{child.effectiveDate}</span>
                          <span className="text-center text-xs text-gray-400">{child.refNum}</span>
                          {tab === 'distribution' && <span className="text-center text-xs text-gray-500">s1234567</span>}
                          <span className="inline-flex items-center justify-start gap-1.5 w-full">
                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: childStatusColor }} />
                            <span className="text-xs text-gray-800">{child.status}</span>
                          </span>
                          {tab === 'distribution' && <span />}
                          {tab === 'distribution' && <span />}
                          <span />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

      {/* ── Pagination — outside the card, bottom-right ── */}
      <div className="flex-shrink-0 flex justify-start">
        <div className="inline-flex items-center gap-1.5" dir="ltr">
          {/* Left arrow */}
          <button onClick={() => setPage(p => Math.max(1, p - 1))}
            className="flex items-center justify-center transition-colors"
            style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#fff', border: '1px solid #d1d5db', opacity: page === 1 ? 0.35 : 1 }}>
            <ChevronLeft className="w-3.5 h-3.5" style={{ color: '#374151' }} />
          </button>

          {pageWindow().map(n => (
            <button key={n} onClick={() => setPage(n)}
              className="flex items-center justify-center text-sm font-medium transition-colors"
              style={page === n
                ? { width: '44px', height: '28px', borderRadius: '20px', background: '#1B3A6B', color: '#fff', border: 'none' }
                : { width: '44px', height: '28px', borderRadius: '20px', background: 'transparent', color: '#6b7280', border: '1px solid #c4c8ce' }}>
              {n}
            </button>
          ))}

          {/* Right arrow */}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            className="flex items-center justify-center transition-colors"
            style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#fff', border: '1px solid #d1d5db', opacity: page === totalPages ? 0.35 : 1 }}>
            <ChevronRight className="w-3.5 h-3.5" style={{ color: '#374151' }} />
          </button>
        </div>
      </div>

      {/* Fixed row menu */}
      {menuRow && (
        <div ref={menuRef} className="fixed z-[9998]"
          style={menuRow.flipped
            ? { bottom: menuRow.y, left: menuRow.x }
            : { top: menuRow.y,    left: menuRow.x }}>
          <RowMenu tab={tab} onAction={handleMenuAction} onClose={() => setMenuRow(null)} actionPhase={menuActionPhase?.id === menuRow?.doc.id ? { label: menuActionPhase.label, phase: menuActionPhase.phase } : null} />
        </div>
      )}

      {/* History modal */}
      {historyDoc && <HistoryModal doc={historyDoc} onClose={() => setHistoryDoc(null)} />}

      {/* Row action modals */}
      {catalogModal?.type === 'edit' && <CatalogDocModal doc={catalogModal.doc} mode="edit" onClose={() => setCatalogModal(null)} />}
      {catalogModal?.type === 'duplicate' && <CatalogDocModal doc={catalogModal.doc} mode="duplicate" onClose={() => setCatalogModal(null)} />}
      {catalogModal?.type === 'permissions' && <DocPermissionsModal onClose={() => setCatalogModal(null)} />}
      {catalogModal?.type === 'delete' && <CatalogDeleteModal doc={catalogModal.doc} onClose={() => setCatalogModal(null)} />}
      {catalogModal?.type === 'cancel-doc' && <CatalogCancelModal key={catalogModal.doc.id} doc={catalogModal.doc} onClose={() => setCatalogModal(null)} onSendCancel={() => { setCatalogModal(null); setShowCancelToast(true); }} />}
      {showCancelToast && <CancelProgressToast onClose={() => setShowCancelToast(false)} />}
      {catalogModal?.type === 'approval-round' && (
        <ApprovalRoundModal
          docName={catalogModal.doc.name}
          onClose={() => setCatalogModal(null)}
          onApprove={() => setCatalogModal(null)}
          onReject={() => setCatalogModal(null)}
          onDistribute={() => setCatalogModal(null)}
        />
      )}

      {/* Receipt confirm modal */}
      {receiptModal && (
        <ReceiptConfirmModal doc={receiptModal.doc} receipt={receiptModal.receipt} onClose={() => setReceiptModal(null)} />
      )}

      {/* Doc details modal (distributed/archive tabs) */}
      {docDetailsModal && (
        <EditDocDetailsModal
          doc={{ name: docDetailsModal.doc.name, orderNum: docDetailsModal.doc.orderNum, status: docDetailsModal.doc.status }}
          mode={docDetailsModal.mode}
          onClose={() => setDocDetailsModal(null)}
        />
      )}

      {/* Hierarchy modal */}
      {hierarchyModal && <DocHierarchyModal doc={hierarchyModal} onClose={() => setHierarchyModal(null)} />}

      {/* Share modal (re-share) */}
      {shareModal && (
        <ShareDocModal
          docName={shareModal.name}
          onClose={() => setShareModal(null)}
          onSend={() => setShareModal(null)}
        />
      )}

      {/* Duplicate search → prefills new doc form */}
      {showDuplicate && (
        <DuplicateSearchModal
          onClose={() => setShowDuplicate(false)}
          onSelect={doc => {
            setShowDuplicate(false);
            setNewDocInit({ name: doc.name, dept: doc.dept, org: doc.env, docType: doc.type, orderNum: doc.orderNum });
            setShowNewDoc(true);
          }}
        />
      )}

      {/* New document form */}
      {showNewDoc && (
        <NewDocModal
          onClose={() => setShowNewDoc(false)}
          onSuccess={() => setShowSuccessToast(true)}
          initialData={newDocInit}
          title={Object.keys(newDocInit).length > 0 ? 'שכפול מסמך קיים' : 'פתיחת מסמך חדש'}
        />
      )}

      {/* ── Success toast ── */}
      {showSuccessToast && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center pointer-events-none">
          <div dir="rtl" className="pointer-events-auto bg-white rounded-2xl shadow-2xl px-8 py-6 flex flex-col items-center gap-3 text-center relative"
            style={{ width: 340, boxShadow: '0 8px 40px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)' }}>
            <button onClick={() => setShowSuccessToast(false)}
              className="absolute top-3 left-3 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-1"
              style={{ background: '#dcfce7' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="text-base font-bold text-gray-900">מסמך חדש נוצר בהצלחה</p>
            <p className="text-sm text-gray-500">המסמך ממתין לך בטיוטות</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Page shell ── */
export function Catalog({ navigate, initialDept, onEditDoc }: CatalogProps) {
  const [selectedDept,      setSelectedDept]      = useState<string | null>(initialDept ?? null);
  const [activeTab,         setActiveTab]         = useState<Tab>('distributed');
  const [showTrash,         setShowTrash]         = useState(false);
  const [selectedFolder,    setSelectedFolder]    = useState<string | null>(null);
  const [selectedFolderSub, setSelectedFolderSub] = useState<string | null>(null);
  const [selectedEnvFolder,  setSelectedEnvFolder]  = useState<string | null>(null);
  const [selectedEnvDept,    setSelectedEnvDept]    = useState<string | null>(null);

  return (
    <div className="w-full h-screen flex flex-col" dir="rtl"
      style={{
        background: 'linear-gradient(135deg,#F6F9FC 0%,#F8FAFB 20%,#FAF8FA 35%,#FBF7F9 50%,#FAF5F1 65%,#F9F3ED 100%)',
        backgroundAttachment: 'fixed',
      }}>
      <TopNavbar showBackArrow={true} isPersonalAreaActive={false} navigate={navigate} />
      <div className="flex flex-1 overflow-hidden">
        <RightSidebar
          onSelectDepartment={dept => { setSelectedDept(dept); setSelectedFolder(null); setSelectedFolderSub(null); setSelectedEnvFolder(null); setSelectedEnvDept(null); setActiveTab('distributed'); setShowTrash(false); }}
          selectedDepartment={selectedDept}
          onSelectFolder={(dept, folder, sub) => {
            if (dept === 'כל המסמכים') { setSelectedEnvFolder(folder); setSelectedEnvDept(sub ?? null); }
            else { setSelectedFolder(folder); setSelectedFolderSub(sub ?? null); }
          }}
          onOpenCommandPage={org => onEditDoc?.({ id: org, name: org, status: 'מבצעית', orderNum: '001' })}
        />
        {showTrash ? (
          <TrashCatalog onBack={() => setShowTrash(false)} />
        ) : selectedDept ? (
          <DocumentCatalog department={selectedDept} tab={activeTab} setTab={setActiveTab} onEditDoc={onEditDoc} onOpenTrash={() => setShowTrash(true)} folderFilter={selectedFolder} subFilter={selectedFolderSub} envFolderFilter={selectedEnvFolder} envDeptFilter={selectedEnvDept} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-7 h-7 text-gray-300" />
              </div>
              <p className="text-gray-400 text-sm">בחר אגף מהסרגל הצדדי להצגת הקטלוג</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
