import { Bell, MessageCircle, User, ChevronDown, BookOpen, Eye, Edit, X, HelpCircle, Play, ExternalLink, ArrowRight, Lock, MessageSquare, Phone, ChevronLeft, ChevronRight, Filter, FileEdit, Copy, Trash2, UserCog, Loader2, Search, Plus, FileText, FileSpreadsheet, Users, Layers, List, PenLine, UserCheck, Network, Check, Download, RefreshCw, FilePlus, GitCompare } from 'lucide-react';

function WordIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* document shape with folded corner */}
      <path d="M2 2.5 C2 1.67 2.67 1 3.5 1 H10 L14 5 V13.5 C14 14.33 13.33 15 12.5 15 H3.5 C2.67 15 2 14.33 2 13.5 Z"
        stroke="#6b7280" strokeWidth="1.1" fill="white"/>
      <path d="M10 1 L10 5 L14 5" stroke="#6b7280" strokeWidth="1.1" fill="none" strokeLinejoin="round"/>
      {/* W centred in document */}
      <text x="8" y="12" fontSize="7" fontWeight="800" fill="#6b7280"
        fontFamily="Arial,sans-serif" textAnchor="middle">W</text>
    </svg>
  );
}

function PdfIcon() {
  // Exact Adobe Acrobat "A" path (24×24 source), scaled into the document content area
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* document shape — same as WordIcon */}
      <path d="M2 2.5 C2 1.67 2.67 1 3.5 1 H10 L14 5 V13.5 C14 14.33 13.33 15 12.5 15 H3.5 C2.67 15 2 14.33 2 13.5 Z"
        stroke="#6b7280" strokeWidth="1.1" fill="white"/>
      <path d="M10 1 L10 5 L14 5" stroke="#6b7280" strokeWidth="1.1" fill="none" strokeLinejoin="round"/>
      {/* Adobe "A" logo — exact path from 24×24 viewBox, scaled & translated into doc body */}
      <g transform="translate(3.2, 2.8) scale(0.41)">
        <path
          fill="#6b7280"
          d="M23.63 15.3c-.71-.745-2.166-1.17-4.224-1.17-1.1 0-2.377.106-3.761.354a19.443 19.443 0 0 1-2.307-2.661c-.532-.71-.994-1.49-1.42-2.236.817-2.484 1.207-4.507 1.207-5.962 0-1.632-.603-3.336-2.342-3.336-.532 0-1.065.32-1.349.781-.78 1.384-.425 4.4.923 7.381a60.277 60.277 0 0 1-1.703 4.507c-.568 1.349-1.207 2.733-1.917 4.01C2.834 18.53.314 20.34.03 21.758c-.106.533.071 1.03.462 1.42.142.107.639.533 1.49.533 2.59 0 5.323-4.188 6.707-6.707 1.065-.355 2.13-.71 3.194-.994a34.963 34.963 0 0 1 3.407-.745c2.732 2.448 5.145 2.839 6.352 2.839 1.49 0 2.023-.604 2.2-1.1.32-.64.106-1.349-.213-1.704zm-1.42 1.03c-.107.532-.64.887-1.384.887-.213 0-.39-.036-.604-.071-1.348-.32-2.626-.994-3.903-2.059a17.717 17.717 0 0 1 2.98-.248c.746 0 1.385.035 1.81.142.497.106 1.278.426 1.1 1.348zm-7.524-1.668a38.01 38.01 0 0 0-2.945.674 39.68 39.68 0 0 0-2.52.745 40.05 40.05 0 0 0 1.207-2.555c.426-.994.78-2.023 1.136-2.981.354.603.745 1.207 1.135 1.739a50.127 50.127 0 0 0 1.987 2.378zM10.038 1.46a.768.768 0 0 1 .674-.425c.745 0 .887.851.887 1.526 0 1.135-.355 2.874-.958 4.861-1.03-2.768-1.1-5.074-.603-5.962zM6.134 17.997c-1.81 2.981-3.549 4.826-4.613 4.826a.872.872 0 0 1-.532-.177c-.213-.213-.32-.461-.249-.745.213-1.065 2.271-2.555 5.394-3.904Z"
        />
      </g>
    </svg>
  );
}
import React, { useState, useRef, useEffect } from 'react';

// ─── Document clause hierarchy ───────────────────────────────────────────────
const PERM_DOC_STRUCTURE = [
  { id: 'ch1', title: 'מבוא', sections: [
    { id: 's1', num: '1', title: 'כללי', subs: [
      { id: 'ss11', title: 'רקע ומטרות' },
      { id: 'ss12', title: 'הגדרות' },
      { id: 'ss13', title: 'תחולה' },
    ]},
    { id: 's2', num: '2', title: 'אחריות', subs: [
      { id: 'ss21', title: 'אחריות מנהלית' },
      { id: 'ss22', title: 'אחריות תפעולית' },
    ]},
  ]},
  { id: 'ch2', title: 'הוראות ביצוע', sections: [
    { id: 's3', num: '3', title: 'נהלים', subs: [
      { id: 'ss31', title: 'נוהל קבלה' },
      { id: 'ss32', title: 'נוהל שחרור' },
      { id: 'ss33', title: 'נוהל חירום' },
    ]},
    { id: 's4', num: '4', title: 'דיווח', subs: [
      { id: 'ss41', title: 'דיווח שוטף' },
      { id: 'ss42', title: 'דיווח חריגים' },
    ]},
  ]},
  { id: 'ch3', title: 'נספחים', sections: [
    { id: 's5', num: '5', title: 'טפסים', subs: [
      { id: 'ss51', title: 'טופס א׳' },
      { id: 'ss52', title: 'טופס ב׳' },
    ]},
  ]},
];

// ─── Data for DocPermissionsModal ────────────────────────────────────────────
const PERM_PEOPLE_POOL = [
  { id: 'p1',  name: 'אבי כהן',     idNumber: '012345678', environment: 'ארגון א׳' },
  { id: 'p2',  name: 'שרה לוי',      idNumber: '023456789', environment: 'ארגון ב׳' },
  { id: 'p3',  name: 'משה ישראלי',   idNumber: '034567890', environment: 'ארגון א׳' },
  { id: 'p4',  name: 'רחל דוד',      idNumber: '045678901', environment: 'ארגון ג׳' },
  { id: 'p5',  name: 'יוסף מזרחי',   idNumber: '056789012', environment: 'ארגון ב׳' },
  { id: 'p6',  name: 'מירי פרץ',     idNumber: '067890123', environment: 'ארגון א׳' },
  { id: 'p7',  name: 'דני אברהם',    idNumber: '078901234', environment: 'ארגון ד׳' },
  { id: 'p8',  name: 'לאה כץ',       idNumber: '089012345', environment: 'ארגון ב׳' },
  { id: 'p9',  name: 'אורן שמש',     idNumber: '090123456', environment: 'ארגון א׳' },
  { id: 'p10', name: 'נועה גרין',    idNumber: '101234567', environment: 'ארגון ג׳' },
  { id: 'p11', name: 'יעקב בן-דוד', idNumber: '112345678', environment: 'ארגון א׳' },
  { id: 'p12', name: 'תמר ברק',      idNumber: '123456789', environment: 'ארגון ב׳' },
  { id: 'p13', name: 'עמי שלו',      idNumber: '134567890', environment: 'ארגון ד׳' },
  { id: 'p14', name: 'ריקי נחום',    idNumber: '145678901', environment: 'ארגון א׳' },
  { id: 'p15', name: 'גיל אלון',     idNumber: '156789012', environment: 'ארגון ג׳' },
];
const PERM_NETWORK_PEOPLE = [
  { id: 'n1', name: 'דוד לוי',      idNumber: '201234567', environment: 'ארגון א׳', network: 'sodi'      as const, networkLabel: 'מערכת סודי'  },
  { id: 'n2', name: 'רונית שפיר',   idNumber: '202345678', environment: 'ארגון ב׳', network: 'sodi'      as const, networkLabel: 'מערכת סודי'  },
  { id: 'n3', name: 'אייל כץ',      idNumber: '203456789', environment: 'ארגון א׳', network: 'sodi'      as const, networkLabel: 'מערכת סודי'  },
  { id: 'n4', name: 'מיכל אברמוב', idNumber: '204567890', environment: 'ארגון ג׳', network: 'sodi'      as const, networkLabel: 'מערכת סודי'  },
  { id: 'n5', name: 'גדעון רוזן',   idNumber: '301234567', environment: 'ארגון ב׳', network: 'aman'      as const, networkLabel: 'אמ"ן'         },
  { id: 'n6', name: 'טל חיים',      idNumber: '302345678', environment: 'ארגון א׳', network: 'aman'      as const, networkLabel: 'אמ"ן'         },
  { id: 'n7', name: 'שירה בן-דוד', idNumber: '303456789', environment: 'ארגון ג׳', network: 'aman'      as const, networkLabel: 'אמ"ן'         },
  { id: 'n8', name: 'אלון מזרחי',   idNumber: '401234567', environment: 'ארגון א׳', network: 'sodibioti' as const, networkLabel: 'סודי ביותר'  },
  { id: 'n9', name: 'יפית הרוש',    idNumber: '402345678', environment: 'ארגון ב׳', network: 'sodibioti' as const, networkLabel: 'סודי ביותר'  },
];
const PERM_DOCS_DATA = [
  { id: 'd1', name: 'נוהל בטיחות 2026',  environment: 'ארגון א׳', lastUpdate: '10/05/2026', orderNum: '001', updateNum: 'גרסה 2', docType: 'נוהל', refNum: '1001',
    distribution: [
      { id: 'p1', name: 'אבי כהן',   idNumber: '012345678', environment: 'ארגון א׳' },
      { id: 'p2', name: 'שרה לוי',    idNumber: '023456789', environment: 'ארגון ב׳' },
      { id: 'p7', name: 'דני אברהם', idNumber: '078901234', environment: 'ארגון ד׳' },
      { id: 'p9',  name: 'אורן שמש', idNumber: '090123456', environment: 'ארגון א׳' },
      { id: 'p10', name: 'נועה גרין', idNumber: '101234567', environment: 'ארגון ג׳' },
      { id: 'p14', name: 'ריקי נחום', idNumber: '145678901', environment: 'ארגון א׳' },
    ]},
  { id: 'd2', name: 'נוהל גיוס עובדים', environment: 'ארגון ב׳', lastUpdate: '08/05/2026', orderNum: '002', updateNum: 'גרסה 1', docType: 'נוהל', refNum: '1002',
    distribution: [
      { id: 'p3', name: 'משה ישראלי', idNumber: '034567890', environment: 'ארגון א׳' },
      { id: 'p8', name: 'לאה כץ',     idNumber: '089012345', environment: 'ארגון ב׳' },
    ]},
  { id: 'd3', name: 'תקנון משמעת',       environment: 'ארגון א׳', lastUpdate: '05/05/2026', orderNum: '003', updateNum: 'גרסה 3', docType: 'תקנון', refNum: '1003',
    distribution: [
      { id: 'p9',  name: 'אורן שמש', idNumber: '090123456', environment: 'ארגון א׳' },
      { id: 'p10', name: 'נועה גרין', idNumber: '101234567', environment: 'ארגון ג׳' },
      { id: 'p14', name: 'ריקי נחום', idNumber: '145678901', environment: 'ארגון א׳' },
      { id: 'p4', name: 'רחל דוד',    idNumber: '045678901', environment: 'ארגון ג׳' },
    ]},
  { id: 'd4', name: 'נוהל רכש ואספקה',  environment: 'ארגון ג׳', lastUpdate: '03/05/2026', orderNum: '004', updateNum: 'גרסה 1', docType: 'נוהל', refNum: '1004',
    distribution: [
      { id: 'p5', name: 'יוסף מזרחי', idNumber: '056789012', environment: 'ארגון ב׳' },
      { id: 'p11', name: 'יעקב בן-דוד', idNumber: '112345678', environment: 'ארגון א׳' },
    ]},
];
const PERM_HAMAL_GROUPS = [
  { id: 'h1', name: 'חמל ביטחון שטח', type: 'ביטחוני',  environment: 'ארגון א׳',
    members: [
      { id: 'p1', name: 'אבי כהן',   idNumber: '012345678', environment: 'ארגון א׳' },
      { id: 'p2', name: 'שרה לוי',    idNumber: '023456789', environment: 'ארגון ב׳' },
      { id: 'p6', name: 'מירי פרץ',   idNumber: '067890123', environment: 'ארגון א׳' },
      { id: 'p11', name: 'יעקב בן-דוד', idNumber: '112345678', environment: 'ארגון א׳' },
    ]},
  { id: 'h2', name: 'חמל לוגיסטי',      type: 'לוגיסטי',  environment: 'ארגון ב׳',
    members: [
      { id: 'p3', name: 'משה ישראלי', idNumber: '034567890', environment: 'ארגון א׳' },
      { id: 'p8', name: 'לאה כץ',     idNumber: '089012345', environment: 'ארגון ב׳' },
      { id: 'p5', name: 'יוסף מזרחי', idNumber: '056789012', environment: 'ארגון ב׳' },
    ]},
  { id: 'h3', name: 'חמל מודיעין',      type: 'מודיעיני', environment: 'ארגון א׳',
    members: [
      { id: 'p9',  name: 'אורן שמש', idNumber: '090123456', environment: 'ארגון א׳' },
      { id: 'p10', name: 'נועה גרין', idNumber: '101234567', environment: 'ארגון ג׳' },
    ]},
  { id: 'h4', name: 'חמל תקשורת',       type: 'תקשורתי', environment: 'ארגון ג׳',
    members: [
      { id: 'p14', name: 'ריקי נחום', idNumber: '145678901', environment: 'ארגון א׳' },
      { id: 'p12', name: 'תמר ברק',   idNumber: '123456789', environment: 'ארגון ב׳' },
    ]},
  { id: 'h5', name: 'חמל רפואי',         type: 'רפואי',    environment: 'ארגון ב׳',
    members: [
      { id: 'p15', name: 'דנה אלון',   idNumber: '156789012', environment: 'ארגון ב׳' },
      { id: 'p16', name: 'רון שפירא',  idNumber: '167890123', environment: 'ארגון א׳' },
      { id: 'p17', name: 'מיכל דוד',   idNumber: '178901234', environment: 'ארגון ג׳' },
      { id: 'p18', name: 'אלי גולן',   idNumber: '189012345', environment: 'ארגון ב׳' },
    ]},
];
const PERM_MIRAZ_GROUPS = [
  { id: 'm1', name: "מיראז' קרבי",   type: 'קרבי',     environment: 'ארגון א׳',
    members: [
      { id: 'p1', name: 'אבי כהן',  idNumber: '012345678', environment: 'ארגון א׳' },
      { id: 'p6', name: 'מירי פרץ', idNumber: '067890123', environment: 'ארגון א׳' },
      { id: 'p11', name: 'יעקב בן-דוד', idNumber: '112345678', environment: 'ארגון א׳' },
    ]},
  { id: 'm2', name: "מיראז' סייבר",  type: 'סייבר',    environment: 'ארגון ב׳',
    members: [
      { id: 'p2',  name: 'שרה לוי',  idNumber: '023456789', environment: 'ארגון ב׳' },
      { id: 'p12', name: 'תמר ברק',  idNumber: '123456789', environment: 'ארגון ב׳' },
      { id: 'p10', name: 'נועה גרין', idNumber: '101234567', environment: 'ארגון ג׳' },
    ]},
  { id: 'm3', name: "מיראז' מודיעין", type: 'מודיעיני', environment: 'ארגון א׳',
    members: [
      { id: 'p9',  name: 'אורן שמש',  idNumber: '090123456', environment: 'ארגון א׳' },
      { id: 'p13', name: 'דני אברהם', idNumber: '134567890', environment: 'ארגון ב׳' },
    ]},
  { id: 'm4', name: "מיראז' לוגיסטי", type: 'לוגיסטי', environment: 'ארגון ג׳',
    members: [
      { id: 'p3', name: 'משה ישראלי', idNumber: '034567890', environment: 'ארגון א׳' },
      { id: 'p5', name: 'יוסף מזרחי', idNumber: '056789012', environment: 'ארגון ב׳' },
      { id: 'p8', name: 'לאה כץ',     idNumber: '089012345', environment: 'ארגון ב׳' },
    ]},
  { id: 'm5', name: "מיראז' רפואי",   type: 'רפואי',    environment: 'ארגון ב׳',
    members: [
      { id: 'p15', name: 'דנה אלון',  idNumber: '156789012', environment: 'ארגון ב׳' },
      { id: 'p16', name: 'רון שפירא', idNumber: '167890123', environment: 'ארגון א׳' },
      { id: 'p17', name: 'מיכל דוד',  idNumber: '178901234', environment: 'ארגון ג׳' },
      { id: 'p18', name: 'אלי גולן',  idNumber: '189012345', environment: 'ארגון ב׳' },
    ]},
];
const PERM_PERSONAL_LISTS = [
  { id: 'pl1', name: 'רשימת הפצה — מטה מבצעי', members: [
      { id: 'p1', name: 'אבי כהן',   idNumber: '012345678', environment: 'ארגון א׳' },
      { id: 'p2', name: 'שרה לוי',   idNumber: '023456789', environment: 'ארגון ב׳' },
      { id: 'p3', name: 'משה ישראלי',idNumber: '034567890', environment: 'ארגון א׳' },
    ]},
  { id: 'pl2', name: 'רשימת הפצה — לוגיסטיקה', members: [
      { id: 'p5', name: 'יוסף מזרחי', idNumber: '056789012', environment: 'ארגון ב׳' },
      { id: 'p8', name: 'לאה כץ',     idNumber: '089012345', environment: 'ארגון ב׳' },
      { id: 'p9', name: 'אורן שמש',   idNumber: '090123456', environment: 'ארגון א׳' },
      { id: 'p10', name: 'נועה גרין', idNumber: '101234567', environment: 'ארגון ג׳' },
    ]},
  { id: 'pl3', name: 'צוות מודיעין — רשימה א׳', members: [
      { id: 'p11', name: 'יעקב בן-דוד', idNumber: '112345678', environment: 'ארגון א׳' },
      { id: 'p12', name: 'תמר ברק',     idNumber: '123456789', environment: 'ארגון ב׳' },
    ]},
];

// ─── DocPermissionsModal ──────────────────────────────────────────────────────
type PermUser = { id: string; name: string; idNumber: string; environment: string; subLabel?: string };

function DocPermissionsModal({ onClose, initialTab = 0, isDistributed = false }: { onClose: () => void; initialTab?: number; isDistributed?: boolean }) {
  const PERMISSIONS = [
    {
      label: 'צפייה לאחר הפצה', Icon: Eye, color: '#111827',
      desc: 'המשתמשים עם הרשאה זו יוכלו לצפות בתוכן הפקודה לאחר הפצתה.',
    },
    {
      label: isDistributed ? 'מורשים לייצוא לוורד' : 'צפייה טרם הפצה', Icon: Eye, color: '#111827',
      desc: isDistributed
        ? 'המשתמשים עם הרשאה זו יוכלו לייצא את הפקודה ל-Word.'
        : 'המשתמשים עם הרשאה זו יוכלו לצפות בתוכן הפקודה כשהיא בסטטוס ״בהכנה״ או ״בסבב אישורים״, וייצא אותה ל-Word ו-PDF. הם לא יוכלו לערוך תוכן זה.',
    },
    {
      label: 'ניהול פקודה', Icon: Network, color: '#111827',
      desc: 'המשתמשים עם הרשאה זו יוכלו לנהל את הפקודה כמו ״בעל פקודה״ — לערוך ולאשר את כל הסעיפים, לשנות את סדר הפקודה ולנהל את הרשאות הצפייה, העריכה והאישור.',
    },
    {
      label: 'עורכי סעיפים', Icon: PenLine, color: '#111827',
      desc: 'המשתמשים עם הרשאה זו יוכלו לערוך את הסעיף כשהפקודה בסטטוס ״בהכנה״. עורכי הסעיף יוכלו לערוך רק את הסעיף שבעבורו ניתנה להם ההרשאה. משתמשים אלו יהיו משויכים לרשימת התפוצה.',
    },
    {
      label: 'מאשרי סעיף', Icon: UserCheck, color: '#111827',
      desc: 'המשתמשים עם הרשאה זו יוכלו לאשר את הסעיף כשהפקודה בסטטוס ״בהכנה״. מאשרי הסעיף יוכלו לאשר רק את הסעיף שבעבורו ניתנה להם ההרשאה. משתמשים אלו משויכים לרשימת התפוצה.',
    },
  ];

  const [activeIdx, setActiveIdx]           = useState(initialTab);
  const [members,   setMembers]             = useState<Record<number, PermUser[]>>({0:[],1:[],2:[],3:[],4:[]});
  const [importTab, setImportTab]           = useState<'doc'|'hamal'|'miraz'|'personal'|'network'|'excel'|null>(null);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const exportBtnRef = useRef<HTMLButtonElement>(null);
  const [searchQuery, setSearchQuery]       = useState('');
  const [searchOpen,  setSearchOpen]        = useState(false);
  const [networkFilter, setNetworkFilter]   = useState<'sodibioti'|'sodi'|'aman'>('sodibioti');
  const [docSearch, setDocSearch]           = useState('');
  const [expandedId, setExpandedId]         = useState<string|null>(null);
  const [selectedClauses, setSelectedClauses] = useState<string[]>([]);
  const [memberClauses, setMemberClauses]   = useState<Record<string, string[]>>({});
  const [openChapters,  setOpenChapters]    = useState<string[]>([]);
  const [openSections,  setOpenSections]    = useState<string[]>([]);
  const [openClauseMembers, setOpenClauseMembers] = useState<string[]>([]);
  const [manualAddOpen, setManualAddOpen]   = useState(false);
  const [manualAddPos,  setManualAddPos]    = useState<{top:number;left:number}|null>(null);
  const [manualAddUsername, setManualAddUsername]       = useState('');
  const [manualAddDisplayName, setManualAddDisplayName] = useState('');
  const manualAddBtnRef = useRef<HTMLButtonElement>(null);
  const [docTabFilter, setDocTabFilter] = useState<'distributed'|'drafts'>('distributed');
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const [personalListTab, setPersonalListTab] = useState<'mine'|'all'>('mine');
  const [addToGroupModal, setAddToGroupModal] = useState<{ groupId: string; groupName: string; x: number; y: number } | null>(null);
  const [addToGroupSearch, setAddToGroupSearch] = useState('');

  const isClauseMode = activeIdx === 3 || activeIdx === 4;

  const toggleClause = (id: string) =>
    setSelectedClauses(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  const toggleChapter = (id: string) =>
    setOpenChapters(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  const toggleSection = (id: string) =>
    setOpenSections(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  const toggleClauseMembers = (id: string) =>
    setOpenClauseMembers(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);

  const curMembers = members[activeIdx] || [];
  const clauseMembers = (clauseId: string) =>
    curMembers.filter(m => (memberClauses[m.id] || []).includes(clauseId));

  const removeMemberFromClause = (memberId: string, clauseId: string) => {
    setMemberClauses(prev => {
      const next = (prev[memberId] || []).filter(c => c !== clauseId);
      return { ...prev, [memberId]: next };
    });
  };

  const addMember = (p: PermUser) => {
    setMembers(prev => {
      const cur = prev[activeIdx] || [];
      return cur.some(m => m.id === p.id) ? prev : { ...prev, [activeIdx]: [...cur, p] };
    });
    if (isClauseMode && selectedClauses.length > 0) {
      setMemberClauses(prev => ({ ...prev, [p.id]: [...new Set([...(prev[p.id]||[]), ...selectedClauses])] }));
    }
  };

  const addMany = (people: PermUser[]) => {
    setMembers(prev => {
      const cur = prev[activeIdx] || [];
      const next = people.filter(p => !cur.some(m => m.id === p.id));
      return next.length ? { ...prev, [activeIdx]: [...cur, ...next] } : prev;
    });
    if (isClauseMode && selectedClauses.length > 0) {
      setMemberClauses(prev => {
        const updated = { ...prev };
        people.forEach(p => {
          updated[p.id] = [...new Set([...(prev[p.id] || []), ...selectedClauses])];
        });
        return updated;
      });
    }
  };

  const removeMember = (id: string) =>
    setMembers(prev => ({ ...prev, [activeIdx]: (prev[activeIdx]||[]).filter(m => m.id !== id) }));

  const networkPool = PERM_NETWORK_PEOPLE.filter(p => p.network === networkFilter);
  const searchResults = searchQuery.trim()
    ? [...networkPool.map(p=>({...p, subLabel: p.networkLabel})), ...PERM_PEOPLE_POOL]
        .filter(p => p.name.includes(searchQuery) || p.idNumber.includes(searchQuery))
    : [];

  const GroupList = ({ groups, colHeader, showAdd = true }: { groups: typeof PERM_HAMAL_GROUPS; colHeader: string; showAdd?: boolean }) => {
    const allSelected = groups.every(g => selectedGroupIds.includes(g.id));
    const toggleGroup = (id: string) =>
      setSelectedGroupIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    return (
      <div className="flex flex-col" dir="rtl">
        {/* header row */}
        <div className="grid items-center px-4 py-1.5 text-[10px] font-semibold text-gray-400 select-none border-b border-gray-100 bg-gray-50/60"
          style={{ gridTemplateColumns: '24px 1fr 32px 28px' }}>
          <span />
          <span className="text-right">{colHeader}</span>
          <span />
          <span />
        </div>
        {/* rows */}
        <div>
          {groups.map(g => {
            const isSel = selectedGroupIds.includes(g.id);
            const isExp = expandedId === g.id;
            return (
              <div key={g.id} className={`border-b border-gray-100 last:border-0 ${isSel ? 'bg-blue-50/20' : ''}`}>
                <div className="grid items-center px-4 py-2.5 hover:bg-gray-50/80 transition-colors cursor-pointer"
                  style={{ gridTemplateColumns: '24px 1fr 32px 28px' }}
                  onClick={() => toggleGroup(g.id)}>
                  <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${isSel ? 'border-[#1B3A6B]' : 'border-gray-300'}`}
                    style={isSel ? { background: '#1B3A6B' } : {}}>
                    {isSel && <Check className="w-2.5 h-2.5 text-white" />}
                  </div>
                  <span className="text-xs font-semibold text-gray-800 truncate pr-1">
                    {g.name} <span className="font-normal text-gray-400">({g.members.length})</span>
                  </span>
                  {showAdd ? (
                    <button onClick={e => { e.stopPropagation(); const r = (e.currentTarget as HTMLElement).getBoundingClientRect(); setAddToGroupSearch(''); setAddToGroupModal({ groupId: g.id, groupName: g.name, x: r.left, y: r.bottom + 6 }); }}
                      className="flex items-center justify-center w-6 h-6 rounded hover:bg-gray-200 transition-colors"
                      title="הוסף משתמש">
                      <Plus className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                  ) : <span />}
                  <button onClick={e => { e.stopPropagation(); setExpandedId(isExp ? null : g.id); }}
                    className="flex items-center justify-center w-6 h-6 rounded hover:bg-gray-200 transition-colors">
                    <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isExp ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                {isExp && (
                  <div className="border-t border-gray-100" style={{ borderRight: '3px solid #1B3A6B20' }}>
                    {g.members.map(p => {
                      const added = curMembers.some(m => m.id === p.id);
                      return (
                        <button key={p.id} disabled={added}
                          onMouseDown={() => { if (!added) addMember(p); }}
                          className={`w-full grid items-center px-8 py-2 border-b border-gray-50 last:border-0 transition-colors text-right ${added ? 'opacity-50 cursor-default' : 'hover:bg-blue-50/40'}`}
                          style={{ gridTemplateColumns: '1fr 120px' }}>
                          <span className="text-xs font-semibold text-gray-800">{p.name}</span>
                          <span className="text-xs text-gray-400">{p.idNumber}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {/* footer when groups selected */}
        {selectedGroupIds.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-white sticky bottom-0" dir="rtl">
            <span className="text-xs text-gray-500">{selectedGroupIds.length} קבוצות נבחרו</span>
            <button onClick={() => {
              const people = groups.filter(g => selectedGroupIds.includes(g.id)).flatMap(g => g.members);
              addMany(people);
              setSelectedGroupIds([]);
            }} className="px-4 py-2 rounded-xl text-xs font-semibold text-white transition-colors" style={{ background: '#1B3A6B' }}>
              הוסף לרשימה
            </button>
          </div>
        )}
      </div>
    );
  };

  return (<>
    <div className="fixed inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 99999 }}
      onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col" dir="rtl"
        style={{ width: isClauseMode ? 1260 : 1200, height: 600, maxWidth: '96vw', maxHeight: '92vh', transition: 'width 0.2s' }}
        onClick={e => e.stopPropagation()}>
        {/* ── UNIFIED HEADER ── */}
        <div className="flex items-center justify-between px-5 py-2.5 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-sm font-semibold text-gray-900">הרשאות מסמך</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* ── BODY (3 columns) ── */}
        <div className="flex flex-1 min-h-0">

        {/* ── LEFT: permission type list ── */}
        <div className="w-52 flex-shrink-0 border-l border-gray-100 bg-gray-50/60 flex flex-col">
          <nav className="py-1">
            {PERMISSIONS.map(({ label, Icon, color }, i) => {
              const active = i === activeIdx;
              return (
                <button key={i} onClick={() => setActiveIdx(i)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-right transition-colors ${active ? 'bg-white shadow-sm' : 'hover:bg-white/70'}`}>
                  <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
                  <span className={`flex-1 text-sm leading-tight ${active ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>{label}</span>
                </button>
              );
            })}
          </nav>
          {/* description for active permission */}
          <div className="flex-1 px-4 py-3 border-t border-gray-100 flex flex-col justify-end">
            <p className="text-[11px] text-gray-400 leading-relaxed text-right">
              {PERMISSIONS[activeIdx].desc}
            </p>
          </div>
        </div>

        {/* ── MIDDLE: search + import panel ── */}
        <div className={`flex flex-col min-w-0 ${isClauseMode ? 'flex-1 border-r border-gray-100' : 'flex-1'}`}
          style={isClauseMode ? { order: 3 } : undefined}>

          {/* source chips — fixed single row */}
          <div className="px-4 pt-1 pb-3 flex-shrink-0" dir="rtl">
            <div className="flex gap-1.5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {([
                { key: 'network'  as const, label: 'הוסף מרשתות',   Icon: Network  },
                { key: 'doc'      as const, label: 'ממסמך קיים',    Icon: FileText },
                { key: 'hamal'    as const, label: 'קבוצות חמ"ל',   Icon: Users    },
                { key: 'miraz'    as const, label: "קבוצות מיראז'", Icon: Layers   },
                { key: 'personal' as const, label: 'אזור אישי',      Icon: List     },
              ]).map(({ key, label, Icon }) => {
                const active = importTab === key;
                return (
                  <button key={key}
                    onClick={() => { setImportTab(active ? null : key); setExpandedId(null); setSearchQuery(''); setSearchOpen(false); if (!active && key !== 'network') setNetworkFilter('sodibioti'); }}
                    className={`flex items-center gap-1.5 flex-1 min-w-0 px-2 py-2 rounded-xl border transition-all text-right ${
                      active ? '' : 'border-gray-100 bg-gray-50/60 hover:bg-white hover:border-gray-200 hover:shadow-sm'
                    }`}
                    style={active ? { background: '#1B3A6B07', borderColor: '#1B3A6B35', boxShadow: '0 1px 3px rgba(27,58,107,0.08)' } : undefined}>
                    <div className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={active ? { background: '#1B3A6B18' } : { background: 'white', border: '1px solid #f3f4f6' }}>
                      <Icon className="w-2.5 h-2.5" style={{ color: active ? '#1B3A6B' : '#9ca3af' }} />
                    </div>
                    <span className="text-[11px] font-semibold truncate" style={{ color: active ? '#1B3A6B' : '#374151' }}>{label}</span>
                  </button>
                );
              })}
              {/* Excel import chip — compact, fixed width */}
              {(() => {
                const active = importTab === 'excel';
                return (
                  <button
                    onClick={() => setImportTab(active ? null : 'excel')}
                    className={`flex items-center gap-1 flex-shrink-0 px-2 py-2 rounded-xl border transition-all ${active ? '' : 'border-gray-100 bg-gray-50/60 hover:bg-white hover:border-gray-200 hover:shadow-sm'}`}
                    style={active ? { background: '#1B3A6B07', borderColor: '#1B3A6B35', boxShadow: '0 1px 3px rgba(27,58,107,0.08)' } : undefined}>
                    <div className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={active ? { background: '#1B3A6B18' } : { background: 'white', border: '1px solid #f3f4f6' }}>
                      <FileSpreadsheet className="w-2.5 h-2.5" style={{ color: active ? '#1B3A6B' : '#1D6F42' }} />
                    </div>
                    <span className="text-[11px] font-semibold" style={{ color: active ? '#1B3A6B' : '#374151' }}>Excel</span>
                  </button>
                );
              })()}
            </div>
          </div>

          {/* fixed search bar — always visible */}
          <div className="px-4 pb-3 flex-shrink-0 flex items-center gap-2" dir="rtl">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input type="text" value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setSearchOpen(true); if (importTab === null) setImportTab('network'); }}
                onFocus={() => { if (searchQuery.trim()) setSearchOpen(true); if (importTab === null) setImportTab('network'); }}
                onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
                placeholder="הוספה או חיפוש לפי שם או ת.ז..."
                dir="rtl"
                className={`w-full pr-9 py-2.5 border border-gray-200 rounded-xl text-sm text-right focus:outline-none focus:border-[#1B3A6B] bg-white transition-colors ${importTab === 'doc' ? 'pl-9' : 'pl-4'}`} />
              {/* Search results dropdown — only for network/null mode */}
              {searchOpen && searchQuery.trim() && (importTab === 'network' || importTab === null) && (() => {
                const results = searchResults;
                return (
                  <div className="absolute top-full right-0 left-0 mt-1.5 z-[9999] rounded-xl border border-gray-100 bg-white shadow-lg overflow-hidden" dir="rtl">
                    {results.length === 0
                      ? <div className="py-5 text-center text-sm text-gray-400">לא נמצאו תוצאות</div>
                      : results.map(p => {
                          const alreadyAdded = curMembers.some(m => m.id === p.id);
                          return (
                            <button key={p.id} disabled={alreadyAdded}
                              onMouseDown={() => { if (alreadyAdded) return; addMember(p); setSearchQuery(''); setSearchOpen(false); }}
                              className={`w-full flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0 text-right transition-colors ${alreadyAdded ? 'cursor-default' : 'hover:bg-gray-50'}`}>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium truncate ${alreadyAdded ? 'text-gray-400' : 'text-gray-800'}`}>{p.name}</p>
                                <p className="text-xs text-gray-400">{p.idNumber}{'subLabel' in p && p.subLabel && <span className="mr-1.5 text-gray-300">· {p.subLabel}</span>}</p>
                              </div>
                              {alreadyAdded
                                ? <span className="flex items-center gap-1 text-[11px] font-medium flex-shrink-0" style={{ color: '#1B3A6B' }}><Check className="w-3.5 h-3.5" />כבר ברשימה</span>
                                : <Plus className="w-4 h-4 text-gray-300 flex-shrink-0" />}
                            </button>
                          );
                        })
                    }
                  </div>
                );
              })()}
              {importTab === 'doc' && (
                <button className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Filter className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {importTab === 'network' && (
              <button ref={manualAddBtnRef}
                onClick={() => {
                  if (!manualAddOpen && manualAddBtnRef.current) {
                    const r = manualAddBtnRef.current.getBoundingClientRect();
                    setManualAddPos({ top: r.bottom + 6, left: r.left - 280 + r.width });
                  }
                  setManualAddOpen(o => !o);
                }}
                className="flex items-center gap-1 px-3 py-2 text-xs rounded-xl font-semibold transition-colors whitespace-nowrap flex-shrink-0 bg-[#1B3A6B] text-white hover:bg-[#152e54]">
                <Plus className="w-3.5 h-3.5" />
                הוספה ידנית
              </button>
            )}
          </div>

          {/* scrollable content */}
          <div className="flex-1 overflow-y-auto border-t border-gray-100" dir="ltr">
            {importTab === 'network' ? (
              /* ── network: tabs + results ── */
              <div className="flex flex-col h-full" dir="rtl">
                <div className="px-4 pt-3 border-b border-gray-100 flex gap-5 flex-shrink-0">
                  {([['sodibioti','סודי ביותר'],['sodi','סודי'],['aman','אמ"ן']] as const).map(([val, label]) => (
                    <button key={val}
                      onClick={() => { setNetworkFilter(val); setSearchQuery(''); setSearchOpen(false); }}
                      className={`pb-2.5 text-sm font-semibold relative whitespace-nowrap transition-colors ${networkFilter === val ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
                      {label}
                      {networkFilter === val && <span className="absolute bottom-0 right-0 left-0 h-0.5 rounded-full bg-gray-900" />}
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-center flex-1">
                  <p className="text-xs text-gray-400">חפש לפי שם או ת.ז. להוספה</p>
                </div>
              </div>
            ) : importTab ? (
              /* ── expanded source content ── */
              <div dir="rtl">

                {/* DOC */}
                {importTab === 'doc' && (
                  <div className="flex flex-col">
                    {/* tabs */}
                    <div className="px-4 border-b border-gray-100 flex gap-5" dir="rtl">
                      {([['distributed','פקודות שהופצו'],['drafts','טיוטות']] as const).map(([val, label]) => (
                        <button key={val} onClick={() => { setDocTabFilter(val); setExpandedId(null); }}
                          className={`py-2.5 text-xs font-semibold relative whitespace-nowrap transition-colors ${docTabFilter === val ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
                          {label}
                          {docTabFilter === val && <span className="absolute bottom-0 right-0 left-0 h-0.5 rounded-full bg-gray-900" />}
                        </button>
                      ))}
                    </div>
                    {/* table header */}
                    <div className="grid text-[10px] font-semibold text-gray-400 border-b border-gray-100 px-4 py-1.5 bg-gray-50/60"
                      style={{ gridTemplateColumns: '24px 1fr 56px 56px 44px 60px 68px 56px 20px' }} dir="rtl">
                      <span />
                      <span>שם מסמך</span>
                      <span className="text-center">מס׳ פקודה</span>
                      <span className="text-center">מס׳ עדכון</span>
                      <span className="text-center">סוג</span>
                      <span className="text-center">ארגון</span>
                      <span className="text-center">תאריך עדכון</span>
                      <span className="text-center">מס׳ סימוכין</span>
                      <span />
                    </div>
                    {/* rows */}
                    {PERM_DOCS_DATA.filter(d => !searchQuery || d.name.includes(searchQuery)).map(doc => {
                      const isSelected = selectedDocIds.includes(doc.id);
                      const isExpanded = expandedId === doc.id;
                      const toggle = () => {
                        setSelectedDocIds(prev => isSelected ? prev.filter(id => id !== doc.id) : [...prev, doc.id]);
                        setExpandedId(isExpanded ? null : doc.id);
                      };
                      return (
                        <div key={doc.id} className={`border-b border-gray-100 last:border-0 ${isSelected ? 'bg-blue-50/20' : ''}`}>
                          <div className="grid items-center px-4 py-2.5 hover:bg-gray-50/80 transition-colors cursor-pointer"
                            style={{ gridTemplateColumns: '24px 1fr 56px 56px 44px 60px 68px 56px 20px' }} dir="rtl"
                            onClick={toggle}>
                            <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-[#1B3A6B]' : 'border-gray-300'}`}
                              style={isSelected ? { background: '#1B3A6B' } : {}}>
                              {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                            </div>
                            <span className="text-xs font-bold text-gray-800 truncate pr-1">
                              {doc.name} <span className="font-normal text-gray-400">({doc.distribution.length})</span>
                            </span>
                            <span className="text-[11px] text-gray-500 text-center">{doc.orderNum}</span>
                            <span className="text-[11px] text-gray-500 text-center">{doc.updateNum}</span>
                            <span className="text-[11px] text-gray-500 text-center">{doc.docType}</span>
                            <span className="text-[11px] text-gray-500 text-center">{doc.environment}</span>
                            <span className="text-[11px] text-gray-500 text-center">{doc.lastUpdate}</span>
                            <span className="text-[11px] text-gray-500 text-center">{doc.refNum}</span>
                            <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform justify-self-center ${isExpanded ? 'rotate-180' : ''}`} />
                          </div>
                          {isExpanded && (
                            <div className="border-t border-gray-100" style={{ borderRight: '3px solid #1B3A6B20' }}>
                              <div className="grid text-[10px] font-semibold text-gray-400 px-8 py-1.5 bg-gray-50/80 border-b border-gray-100"
                                style={{ gridTemplateColumns: '1fr 140px 100px' }} dir="rtl">
                                <span>שם מלא</span>
                                <span>תעודת זהות</span>
                                <span>ארגון</span>
                              </div>
                              {doc.distribution.map(p => {
                                const alreadyAdded = curMembers.some(m => m.id === p.id);
                                return (
                                  <button key={p.id} disabled={alreadyAdded}
                                    onMouseDown={() => { if (!alreadyAdded) addMember(p); }}
                                    className={`w-full grid items-center px-8 py-2 border-b border-gray-50 last:border-0 transition-colors ${alreadyAdded ? 'opacity-50 cursor-default' : 'hover:bg-blue-50/40'}`}
                                    style={{ gridTemplateColumns: '1fr 140px 100px' }} dir="rtl">
                                    <span className="text-xs font-semibold text-gray-800 text-right">{p.name}</span>
                                    <span className="text-xs text-gray-500">{p.idNumber}</span>
                                    <span className="text-xs text-gray-500">{p.environment}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {/* footer */}
                    {selectedDocIds.length > 0 && (
                      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-white sticky bottom-0" dir="rtl">
                        <span className="text-xs text-gray-500">{selectedDocIds.length} מסמכים נבחרו</span>
                        <button
                          onClick={() => {
                            const allPeople = PERM_DOCS_DATA
                              .filter(d => selectedDocIds.includes(d.id))
                              .flatMap(d => d.distribution);
                            addMany(allPeople);
                            setSelectedDocIds([]);
                            setExpandedId(null);
                          }}
                          className="px-4 py-2 rounded-xl text-xs font-semibold text-white transition-colors"
                          style={{ background: '#1B3A6B' }}>
                          הוסף לרשימה
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* HAMAL */}
                {importTab === 'hamal' && (
                  <GroupList groups={PERM_HAMAL_GROUPS} colHeader="שם הקבוצה" />
                )}

                {/* MIRAZ */}
                {importTab === 'miraz' && (
                  <GroupList groups={PERM_MIRAZ_GROUPS} colHeader="שם הקבוצה" showAdd={false} />
                )}

                {/* PERSONAL */}
                {importTab === 'personal' && (
                  <div className="flex flex-col" dir="rtl">
                    {/* tabs */}
                    <div className="flex gap-5 px-4 pt-3 border-b border-gray-100">
                      {[{ key: 'mine' as const, label: 'רשימות של המכלול שלי' }, { key: 'all' as const, label: 'כלל רשימות התפוצה' }].map(({ key, label }) => (
                        <button key={key} onClick={() => setPersonalListTab(key)}
                          className={`pb-2.5 text-xs transition-colors whitespace-nowrap ${personalListTab === key ? 'font-semibold text-gray-900 border-b-2 border-gray-900' : 'text-gray-400'}`}>
                          {label}
                        </button>
                      ))}
                    </div>
                    {/* header */}
                    <div className="grid items-center px-4 py-1.5 text-[10px] font-semibold text-gray-400 select-none border-b border-gray-100 bg-gray-50/60"
                      style={{ gridTemplateColumns: '24px 1fr 28px' }}>
                      <span />
                      <span className="text-right">שם הרשימה</span>
                      <span />
                    </div>
                    {/* rows */}
                    <div>
                      {PERM_PERSONAL_LISTS.map(list => {
                        const isSel = selectedGroupIds.includes(list.id);
                        const isExp = expandedId === list.id;
                        return (
                          <div key={list.id} className={`border-b border-gray-100 last:border-0 ${isSel ? 'bg-blue-50/20' : ''}`}>
                            <div className="grid items-center px-4 py-2.5 hover:bg-gray-50/80 transition-colors cursor-pointer"
                              style={{ gridTemplateColumns: '24px 1fr 28px' }}
                              onClick={() => setSelectedGroupIds(prev => prev.includes(list.id) ? prev.filter(x => x !== list.id) : [...prev, list.id])}>
                              <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${isSel ? 'border-[#1B3A6B]' : 'border-gray-300'}`}
                                style={isSel ? { background: '#1B3A6B' } : {}}>
                                {isSel && <Check className="w-2.5 h-2.5 text-white" />}
                              </div>
                              <span className="text-xs font-semibold text-gray-800 truncate pr-1">
                                {list.name} <span className="font-normal text-gray-400">({list.members.length})</span>
                              </span>
                              <button onMouseDown={e => { e.stopPropagation(); setExpandedId(isExp ? null : list.id); }}
                                className="flex items-center justify-center w-6 h-6 rounded hover:bg-gray-200 transition-colors">
                                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isExp ? 'rotate-180' : ''}`} />
                              </button>
                            </div>
                            {isExp && (
                              <div className="border-t border-gray-100" style={{ borderRight: '3px solid #1B3A6B20' }}>
                                {list.members.map(p => {
                                  const added = curMembers.some(m => m.id === p.id);
                                  return (
                                    <button key={p.id} disabled={added}
                                      onMouseDown={() => { if (!added) addMember(p); }}
                                      className={`w-full grid items-center px-8 py-2 border-b border-gray-50 last:border-0 transition-colors text-right ${added ? 'opacity-50 cursor-default' : 'hover:bg-blue-50/40'}`}
                                      style={{ gridTemplateColumns: '1fr 120px' }}>
                                      <span className="text-xs font-semibold text-gray-800">{p.name}</span>
                                      <span className="text-xs text-gray-400">{p.idNumber}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {selectedGroupIds.length > 0 && (
                      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-white sticky bottom-0" dir="rtl">
                        <span className="text-xs text-gray-500">{selectedGroupIds.length} רשימות נבחרו</span>
                        <button onClick={() => {
                          const people = PERM_PERSONAL_LISTS.filter(l => selectedGroupIds.includes(l.id)).flatMap(l => l.members);
                          addMany(people);
                          setSelectedGroupIds([]);
                        }} className="px-4 py-2 rounded-xl text-xs font-semibold text-white" style={{ background: '#1B3A6B' }}>
                          הוסף לרשימה
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {/* EXCEL */}
                {importTab === 'excel' && (
                  <div className="flex flex-col h-full" dir="rtl">
                    {/* import button */}
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                      <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-colors hover:opacity-90" style={{ background: '#1D6F42' }}>
                        <Plus className="w-3.5 h-3.5" />
                        ייבוא מאקסל
                      </button>
                      <span className="text-[11px] text-gray-400">העלה קובץ .xlsx עם עמודה A בלבד ורשימת מספרים אישיים</span>
                    </div>
                    {/* preview area — excel mockup */}
                    <div className="flex-1 flex flex-col items-center justify-center px-6">
                      <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm" style={{ direction: 'ltr', fontSize: 12, userSelect: 'none', width: 340 }}>
                        {/* header row */}
                        <div className="flex" style={{ background: '#f8f9fa' }}>
                          <div style={{ width: 32, borderRight: '1px solid #e2e4e7', borderBottom: '1px solid #e2e4e7', padding: '4px 0', textAlign: 'center', color: '#999', fontSize: 11 }} />
                          {['A', 'B', 'C', 'D'].map((col, i) => (
                            <div key={col} style={{ flex: 1, borderRight: i < 3 ? '1px solid #e2e4e7' : undefined, borderBottom: '1px solid #e2e4e7', padding: '4px 8px', textAlign: 'center', fontWeight: 600, background: col === 'A' ? '#1B3A6B' : undefined, color: col === 'A' ? '#fff' : '#555' }}>
                              {col}
                            </div>
                          ))}
                        </div>
                        {/* data rows */}
                        {(['s1234567', 's7654321', 'm1234567', 'm7654321', '', '', '']).map((val, i) => (
                          <div key={i} className="flex" style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                            <div style={{ width: 32, borderRight: '1px solid #e2e4e7', borderBottom: '1px solid #e2e4e7', padding: '4px 0', textAlign: 'center', color: '#aaa', fontSize: 10, background: '#f8f9fa' }}>{i + 1}</div>
                            <div style={{ flex: 1, borderRight: '1px solid #e2e4e7', borderBottom: '1px solid #e2e4e7', padding: '4px 8px', textAlign: 'right', color: '#1a1a1a', background: i === 0 ? '#EBF0FA' : undefined, outline: i === 0 ? '2px solid #1B3A6B' : undefined, outlineOffset: -2 }}>{val}</div>
                            {['', '', ''].map((_, j) => (
                              <div key={j} style={{ flex: 1, borderRight: j < 2 ? '1px solid #e2e4e7' : undefined, borderBottom: '1px solid #e2e4e7', padding: '4px 8px' }} />
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ── hint state ── */
              <div className="flex items-center justify-center h-full" dir="rtl">
                <p className="text-xs text-gray-400">בחר מקור ייבוא או חפש לפי שם</p>
              </div>
            )}
          </div>
        </div>

        {/* ── FAR LEFT: added members list (always) / clause hierarchy (editor & approver) ── */}
        <div className={`flex-shrink-0 border-r border-gray-100 bg-gray-50/40 flex flex-col overflow-y-auto ${isClauseMode ? 'w-72' : 'w-60'}`}
          dir="ltr" style={isClauseMode ? { order: 2 } : undefined}>
          {isClauseMode ? (
            <div dir="rtl" className="flex flex-col flex-1 min-h-0">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 flex-shrink-0">
              <span className="text-xs font-semibold text-gray-700">בחר סעיפים לשיוך</span>
              {selectedClauses.length > 0 && (
                <button onClick={() => setSelectedClauses([])} className="text-[11px] hover:underline" style={{ color: '#1B3A6B' }}>
                  {selectedClauses.length} נבחרו · נקה
                </button>
              )}
            </div>
            <div className="flex flex-col gap-0.5 p-3">
              {PERM_DOC_STRUCTURE.map(ch => {
                const chOpen = openChapters.includes(ch.id);
                return (
                  <div key={ch.id}>
                    {/* chapter row — exact Edit.tsx topic style */}
                    <div className="flex items-center gap-1.5 px-2 py-2 rounded-xl cursor-pointer hover:bg-white transition-colors" dir="rtl"
                      onClick={() => toggleChapter(ch.id)}>
                      <ChevronLeft
                        className="w-3.5 h-3.5 flex-shrink-0 text-[#1B3A6B]/50 transition-transform duration-200"
                        style={{ transform: chOpen ? 'rotate(-90deg)' : 'rotate(0deg)' }}
                      />
                      <span className="flex-1 text-sm font-semibold truncate" style={{ color: '#1B3A6B' }}>{ch.title}</span>
                    </div>

                    {chOpen && (
                      <div className="flex flex-col gap-1 mb-1" style={{ paddingRight: 30 }}>
                        {ch.sections.map((s, si) => {
                          const sSel = selectedClauses.includes(s.id);
                          const sMembers = clauseMembers(s.id);
                          const sMembersOpen = openClauseMembers.includes(s.id);
                          return (
                            <div key={s.id}>
                              {/* section row */}
                              <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl cursor-pointer transition-colors ${sSel ? 'shadow-sm' : 'hover:bg-white'}`}
                                style={sSel ? { background: '#1B3A6B14' } : undefined} dir="rtl"
                                onClick={() => toggleClause(s.id)}>
                                <span className="text-xs font-bold text-gray-500 flex-shrink-0 w-4 text-right">{si + 1}.</span>
                                <span className={`flex-1 text-xs truncate ${sSel ? 'font-semibold text-[#1B3A6B]' : 'text-gray-700'}`}>{s.title}</span>
                                {sMembers.length > 0 && (
                                  <button onClick={e => { e.stopPropagation(); toggleClauseMembers(s.id); }}
                                    className="flex items-center gap-0.5 flex-shrink-0 px-1.5 py-0.5 rounded-full hover:bg-gray-200/70 transition-colors"
                                    style={{ background: sMembersOpen ? '#1B3A6B1f' : '#f3f4f6' }}>
                                    <span className="text-[10px] font-semibold" style={{ color: sMembersOpen ? '#1B3A6B' : '#9ca3af' }}>{sMembers.length}</span>
                                    <ChevronLeft className="w-2.5 h-2.5 transition-transform duration-200"
                                      style={{ color: sMembersOpen ? '#1B3A6B' : '#9ca3af', transform: sMembersOpen ? 'rotate(-90deg)' : 'rotate(0deg)' }} />
                                  </button>
                                )}
                              </div>

                              {/* assigned users — table under the relevant section */}
                              {sMembersOpen && sMembers.length > 0 && (
                                <div className="mt-0.5 mb-1 rounded-xl overflow-hidden border border-gray-100 bg-white">
                                  <table className="w-full text-xs" dir="rtl">
                                    <thead>
                                      <tr className="bg-gray-50/80 border-b border-gray-100">
                                        <th className="text-right font-medium text-gray-400 text-[10px] px-3 py-1.5">שם מלא</th>
                                        <th className="text-right font-medium text-gray-400 text-[10px] px-3 py-1.5">תעודת זהות</th>
                                        <th className="text-right font-medium text-gray-400 text-[10px] px-3 py-1.5">ארגון</th>
                                        <th className="w-6" />
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {sMembers.map(m => (
                                        <tr key={m.id} className="border-b border-gray-50 last:border-0 group/m hover:bg-gray-50/60 transition-colors">
                                          <td className="px-3 py-1.5 text-[11px] font-medium text-gray-700 truncate">{m.name}</td>
                                          <td className="px-3 py-1.5 text-[11px] text-gray-400">{m.idNumber}</td>
                                          <td className="px-3 py-1.5 text-[11px] text-gray-400">{m.environment}</td>
                                          <td className="px-1.5 py-1.5">
                                            <button onClick={() => removeMemberFromClause(m.id, s.id)}
                                              className="opacity-0 group-hover/m:opacity-100 p-0.5 rounded hover:bg-red-50 transition-all">
                                              <X className="w-3 h-3 text-gray-400" />
                                            </button>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
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
          ) : (
            <div dir="rtl" className="flex flex-col flex-1 min-h-0">
              <div className="flex-1 overflow-y-auto">
                {/* Column header */}
                <div className="sticky top-0 grid items-center px-3 py-2 text-[10px] font-semibold text-gray-500 select-none z-10"
                  style={{ background: '#EBEBEB', gridTemplateColumns: '1fr 80px 80px 28px', columnGap: '6px' }}>
                  <span className="text-right whitespace-nowrap">שם מלא</span>
                  <span className="text-center">תעודת זהות</span>
                  <span className="text-center">ארגון</span>
                  <span />
                </div>
                {curMembers.length === 0 ? (
                  <div className="px-4 py-14 text-center mt-[177px]">
                    <Users className="w-9 h-9 text-gray-200 mx-auto mb-2.5" />
                    <p className="text-xs text-gray-400">הוסף אנשים לרשימה באמצעות<br />החיפוש או ייבוא מהפאנל הימני</p>
                  </div>
                ) : curMembers.map(m => (
                  <div key={m.id} className="grid items-center px-3 py-2.5 hover:bg-gray-50 transition-colors group"
                    style={{ gridTemplateColumns: '1fr 80px 80px 28px', columnGap: '6px', borderBottom: '1px solid #f5f5f5' }}>
                    <span className="text-right text-xs font-medium text-gray-800 truncate">{m.name}</span>
                    <span className="text-center text-xs text-gray-600 tabular-nums">{m.idNumber}</span>
                    <span className="text-center text-xs text-gray-600">{m.environment}</span>
                    <button onClick={() => removeMember(m.id)}
                      className="flex items-center justify-center opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 transition-all">
                      <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
              {/* Export icon — only when list has members */}
              {curMembers.length > 0 && (
                <div className="flex items-center justify-end px-3 py-2 border-t border-gray-100 flex-shrink-0 relative" dir="rtl">
                  <button
                    ref={exportBtnRef}
                    title="ייצוא"
                    onClick={() => setExportMenuOpen(o => !o)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
                    <Download className="w-4 h-4" />
                  </button>
                  {exportMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-[99998]" onClick={() => setExportMenuOpen(false)} />
                      <div className="absolute bottom-full left-2 mb-1 z-[99999] bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden min-w-[130px]" dir="rtl">
                        <button
                          onClick={() => setExportMenuOpen(false)}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-gray-50 transition-colors text-right">
                          <FileEdit className="w-3.5 h-3.5 text-[#2B579A] flex-shrink-0" />
                          <span className="text-xs font-medium text-gray-700">ייצוא ל-Word</span>
                        </button>
                        <div className="h-px bg-gray-100 mx-2" />
                        <button
                          onClick={() => setExportMenuOpen(false)}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-gray-50 transition-colors text-right">
                          <FileText className="w-3.5 h-3.5 text-[#1D6F42] flex-shrink-0" />
                          <span className="text-xs font-medium text-gray-700">ייצוא ל-Excel</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        </div>{/* end body */}

        {/* ── FOOTER ── */}
        <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-between flex-shrink-0">
          <button onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm text-gray-400 hover:text-gray-600 transition-colors">
            ביטול
          </button>
          <button onClick={onClose}
            className="px-6 py-2 rounded-xl text-sm font-semibold text-white transition-colors hover:opacity-90"
            style={{ background: '#1B3A6B' }}>
            אישור
          </button>
        </div>
      </div>
    </div>

    {/* manual add popover */}
    {manualAddOpen && manualAddPos && (
      <div dir="rtl"
        className="fixed bg-white rounded-2xl shadow-xl border border-gray-100 z-[99999] flex flex-col"
        style={{ top: manualAddPos.top, left: manualAddPos.left, width: 280 }}>
        <div className="px-4 pt-4 pb-3">
          <p className="text-xs font-semibold text-gray-700 mb-3">הוספה ידנית</p>
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-[#1B3A6B] focus-within:ring-1 focus-within:ring-[#1B3A6B]/20 transition-colors mb-2.5" dir="ltr">
            <input type="text" value={manualAddUsername} onChange={e => setManualAddUsername(e.target.value)}
              placeholder="מזהה משתמש" dir="rtl"
              className="flex-1 min-w-0 px-2.5 py-2 text-xs focus:outline-none bg-white text-right" />
            <span className="px-2.5 py-2 text-xs text-gray-400 bg-gray-50 border-l border-gray-200 flex-shrink-0 select-none whitespace-nowrap">@army.idf.il</span>
          </div>
          <input type="text" value={manualAddDisplayName} onChange={e => setManualAddDisplayName(e.target.value)}
            placeholder="שם תצוגה" dir="rtl"
            className="w-full px-2.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B3A6B] focus:ring-1 focus:ring-[#1B3A6B]/20 transition-colors" />
        </div>
        <div className="flex gap-2 px-4 pb-4">
          <button type="button"
            onClick={() => { setManualAddOpen(false); setManualAddUsername(''); setManualAddDisplayName(''); }}
            className="flex-1 py-1.5 rounded-xl text-xs font-semibold border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
            ביטול
          </button>
          <button type="button"
            disabled={!manualAddUsername.trim() && !manualAddDisplayName.trim()}
            onClick={() => {
              const newId = `manual-${Date.now()}`;
              const name = manualAddDisplayName.trim() || manualAddUsername.trim();
              const networkLabel = networkFilter === 'sodibioti' ? 'סודי ביותר' : networkFilter === 'sodi' ? 'סודי' : 'אמ"ן';
              setMembers(prev => ({
                ...prev,
                [activeIdx]: [...(prev[activeIdx] || []), { id: newId, name, idNumber: manualAddUsername.trim(), environment: networkLabel }]
              }));
              setManualAddOpen(false); setManualAddUsername(''); setManualAddDisplayName('');
            }}
            className="flex-1 py-1.5 rounded-xl text-xs font-semibold bg-[#1B3A6B] text-white hover:bg-[#152e54] transition-colors disabled:opacity-40">
            הוספה
          </button>
        </div>
      </div>
    )}

    {/* add to group popover */}
    {addToGroupModal && (() => {
      const searchResults = PERM_PEOPLE_POOL.filter(p =>
        (p.name.includes(addToGroupSearch) || p.idNumber.includes(addToGroupSearch)) && addToGroupSearch.trim()
      ).slice(0, 8);
      return (
        <>
          <div className="fixed inset-0 z-[999998]" onClick={() => setAddToGroupModal(null)} />
          <div dir="rtl" className="fixed bg-white rounded-2xl shadow-xl border border-gray-100 z-[999999]"
            style={{ top: addToGroupModal.y, left: addToGroupModal.x - 280, width: 280 }}>
            <div className="px-3 pt-3 pb-2">
              <p className="text-[11px] font-semibold text-gray-500 mb-2">הוסף משתמש ל{addToGroupModal.groupName}</p>
              <div className="relative">
                <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                <input type="text" value={addToGroupSearch} onChange={e => setAddToGroupSearch(e.target.value)}
                  autoFocus placeholder="חפש לפי שם או ת.ז..." autoComplete="new-password"
                  className="w-full pr-8 pl-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-[#1B3A6B] transition-colors text-right" dir="rtl" />
              </div>
            </div>
            {addToGroupSearch.trim() && (
              <div className="border-t border-gray-100 overflow-hidden">
                {searchResults.length === 0 ? (
                  <p className="px-3 py-3 text-xs text-gray-400 text-center">לא נמצאו תוצאות</p>
                ) : searchResults.map(p => (
                  <button key={p.id} type="button"
                    onClick={() => { addMember(p); setAddToGroupSearch(''); }}
                    className="w-full flex items-center justify-start px-3 py-2 hover:bg-gray-50 text-xs border-b border-gray-50 last:border-0" dir="rtl">
                    <span className="font-medium text-gray-800">{p.name}</span>
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-2 px-3 py-2.5 border-t border-gray-100">
              <button type="button" onClick={() => setAddToGroupModal(null)}
                className="flex-1 py-1.5 rounded-xl text-[11px] font-semibold border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
                ביטול
              </button>
              <button type="button" onClick={() => setAddToGroupModal(null)}
                className="flex-1 py-1.5 rounded-xl text-[11px] font-semibold bg-[#1B3A6B] text-white hover:bg-[#152e54] transition-colors">
                אישור
              </button>
            </div>
          </div>
        </>
      );
    })()}
  </>);
}

interface DocHeaderInfo {
  name: string; orderNum: string; env: string;
  template: string; dept: string; effectiveDate: string;
  classification: string; ref: string;
}

interface TopNavbarProps {
  showBackArrow?: boolean;
  isPersonalAreaActive?: boolean;
  navigate: (path: string) => void;
  showDocActions?: boolean;
  docHeader?: DocHeaderInfo | null;
  onFilterClick?: () => void;
  onEditDocClick?: () => void;
  onDuplicateClick?: () => void;
  onZoomChange?: (z: number) => void;
  onDocSearch?: (q: string) => void;
  permTrigger?: { tab: number } | null;
  onPermTriggerUsed?: () => void;
  docStatus?: string;
  onIssueUpdate?: () => void;
  onIssueNew?: () => void;
  onStartComparison?: (version: { label: string }) => void;
}

type DropPos = { top: number; left: number };

export function TopNavbar({ showBackArrow = false, isPersonalAreaActive = false, navigate, showDocActions = false, docHeader = null, onFilterClick, onEditDocClick, onDuplicateClick, onZoomChange, onDocSearch, permTrigger, onPermTriggerUsed, docStatus, onIssueUpdate, onIssueNew, onStartComparison }: TopNavbarProps) {
  const [realityMode, setRealityMode] = useState('מציאות');
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIcon, setActiveIcon] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showTraining, setShowTraining] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showDocPermissions, setShowDocPermissions] = useState(false);
  const [showReadingControl, setShowReadingControl] = useState(false);
  const [showIssueUpdate, setShowIssueUpdate] = useState(false);
  const [showIssueNew, setShowIssueNew] = useState(false);
  const [showVersionCompare, setShowVersionCompare] = useState(false);
  const isDistributed = ['מבצעית', 'נצורה', 'הסתיימה', 'התבטלה'].includes(docStatus ?? '');
  const [permModalTab, setPermModalTab] = useState(0);
  const [loadingExport, setLoadingExport] = useState<'word' | 'pdf' | null>(null);

  useEffect(() => {
    if (permTrigger) {
      setPermModalTab(permTrigger.tab);
      setShowDocPermissions(true);
      onPermTriggerUsed?.();
    }
  }, [permTrigger]);
  const [docZoom, setDocZoom] = useState(100);
  const [searchActive, setSearchActive] = useState(false);
  const [navSearch, setNavSearch] = useState('');

  const handleZoom = (delta: number) => {
    const next = Math.min(200, Math.max(50, docZoom + delta));
    setDocZoom(next);
    onZoomChange?.(next);
  };

  const handleSearchChange = (q: string) => {
    setNavSearch(q);
    onDocSearch?.(q);
  };

  const closeSearch = () => {
    setSearchActive(false);
    setNavSearch('');
    onDocSearch?.('');
  };

  const handleExport = (type: 'word' | 'pdf') => {
    if (loadingExport) return;
    setLoadingExport(type);
    setTimeout(() => setLoadingExport(null), 2000);
  };

  const [bellPos, setBellPos] = useState<DropPos | null>(null);
  const [supportPos, setSupportPos] = useState<DropPos | null>(null);
  const [bookPos, setBookPos] = useState<DropPos | null>(null);

  const bellRef = useRef<HTMLButtonElement>(null);
  const supportRef = useRef<HTMLButtonElement>(null);
  const bookRef = useRef<HTMLButtonElement>(null);

  const bellDropRef = useRef<HTMLDivElement>(null);
  const supportDropRef = useRef<HTMLDivElement>(null);
  const bookDropRef = useRef<HTMLDivElement>(null);

  const calcPos = (ref: React.RefObject<HTMLButtonElement | null>): DropPos | null => {
    if (!ref.current) return null;
    const r = ref.current.getBoundingClientRect();
    return { top: r.bottom + 8, left: r.left };
  };

  const closeAll = () => {
    setShowNotifications(false);
    setShowTraining(false);
    setShowFAQ(false);
    setShowSupport(false);
    setExpandedFAQ(null);
    setActiveIcon(null);
  };

  const toggle = (
    name: string,
    current: boolean,
    setter: (v: boolean) => void,
    ref: React.RefObject<HTMLButtonElement | null>,
    posSetter: (p: DropPos | null) => void,
  ) => {
    if (activeIcon === name) {
      closeAll();
    } else {
      closeAll();
      const pos = calcPos(ref);
      posSetter(pos);
      setActiveIcon(name);
      setter(true);
    }
  };

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      const target = e.target as Node;
      const inBell = bellRef.current?.contains(target) || bellDropRef.current?.contains(target);
      const inSupport = supportRef.current?.contains(target) || supportDropRef.current?.contains(target);
      const inBook = bookRef.current?.contains(target) || bookDropRef.current?.contains(target);
      if (!inBell && !inSupport && !inBook) closeAll();
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  return (
    <>
      <nav className="px-6 py-6 relative" style={{ zIndex: 100 }} dir="rtl">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <img src="/Chief.svg" alt="Chief" style={{ width: 26, height: 24 }} />
              <h2 className="text-[#1E3A8A]">Chief</h2>
            </div>


            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-1.5 bg-[#F2F2F4] px-4 py-1.5 rounded-full shadow-sm hover:shadow-md transition-all"
              >
                <span className="text-xs text-gray-700">{realityMode}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-600" />
              </button>
              {showDropdown && (
                <div className="absolute top-full right-0 mt-2 bg-[#F2F2F4] rounded-3xl shadow-lg z-10 min-w-[100px] overflow-hidden">
                  <button
                    onClick={() => { setRealityMode('אמת'); setShowDropdown(false); }}
                    className="w-full text-right px-4 py-1.5 hover:bg-white/30 text-xs text-gray-700"
                  >
                    אמת
                  </button>
                  <button
                    onClick={() => { setRealityMode('תרגיל'); setShowDropdown(false); }}
                    className="w-full text-right px-4 py-1.5 hover:bg-white/30 text-xs text-gray-700"
                  >
                    תרגיל
                  </button>
                </div>
              )}
            </div>

            {showDocActions && (
              <div className="flex items-center gap-1 mr-1">
                {/* action icons — differ by docStatus */}
                {!isDistributed && (
                  <button title="סינון" onClick={onFilterClick}
                    className="p-1.5 rounded-full transition-colors hover:bg-gray-100">
                    <Filter className="w-4 h-4 text-gray-500" />
                  </button>
                )}
                <button title={isDistributed ? 'פרטי מסמך' : 'עריכת פרטי מסמך'} onClick={onEditDocClick}
                  className="p-1.5 rounded-full transition-colors hover:bg-gray-100">
                  {isDistributed
                    ? <FileText className="w-4 h-4 text-gray-500" />
                    : <FileEdit className="w-4 h-4 text-gray-500" />}
                </button>
                {([
                  { icon: Copy,    title: 'שכפול', onClick: onDuplicateClick },
                  { icon: UserCog, title: isDistributed ? 'הרשאות ייצוא לוורד' : 'הרשאות', onClick: () => setShowDocPermissions(true) },
                ] as { icon: React.ElementType; title: string; onClick?: () => void }[]).map(({ icon: Icon, title, onClick }) => (
                  <button key={title} title={title} onClick={onClick}
                    className="p-1.5 rounded-full transition-colors hover:bg-gray-100">
                    <Icon className="w-4 h-4 text-gray-500" />
                  </button>
                ))}
                {isDistributed && (<>
                  <button title="השוואת גרסאות" onClick={() => setShowVersionCompare(true)}
                    className="p-1.5 rounded-full transition-colors hover:bg-gray-100">
                    <GitCompare className="w-4 h-4 text-gray-500" />
                  </button>
                  <button title="בקרת קריאה" onClick={() => setShowReadingControl(true)}
                    className="p-1.5 rounded-full transition-colors hover:bg-gray-100">
                    <Eye className="w-4 h-4 text-gray-500" />
                  </button>
                  <button title="הוצאת עדכון למסמך" onClick={() => setShowIssueUpdate(true)}
                    className="p-1.5 rounded-full transition-colors hover:bg-gray-100">
                    <RefreshCw className="w-4 h-4 text-gray-500" />
                  </button>
                  <button title="הוצאת מספר פקודה חדש" onClick={() => setShowIssueNew(true)}
                    className="p-1.5 rounded-full transition-colors hover:bg-gray-100">
                    <FilePlus className="w-4 h-4 text-gray-500" />
                  </button>
                </>)}
                <button title="ייצוא ל-Word" onClick={() => handleExport('word')}
                  className="p-1.5 rounded-full transition-colors hover:bg-gray-100">
                  {loadingExport === 'word'
                    ? <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
                    : <WordIcon />}
                </button>
                <button title="ייצוא PDF" onClick={() => handleExport('pdf')}
                  className="p-1.5 rounded-full transition-colors hover:bg-gray-100">
                  {loadingExport === 'pdf'
                    ? <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
                    : <PdfIcon />}
                </button>

                {/* divider */}
                <span className="w-px h-4 bg-gray-200 mx-0.5" />

                {/* zoom control */}
                <div className="flex items-center gap-0">
                  <button onClick={() => handleZoom(-10)}
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-600 font-bold text-base leading-none select-none">
                    −
                  </button>
                  <span className="text-xs text-gray-600 w-10 text-center tabular-nums">{docZoom}%</span>
                  <button onClick={() => handleZoom(10)}
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-600 font-bold text-base leading-none select-none">
                    +
                  </button>
                </div>

                {/* divider */}
                <span className="w-px h-4 bg-gray-200 mx-0.5" />

                {/* search in document */}
                {searchActive ? (
                  <div className="flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1">
                    <Search className="w-3 h-3 text-gray-500 flex-shrink-0" />
                    <input
                      autoFocus
                      value={navSearch}
                      onChange={e => handleSearchChange(e.target.value)}
                      onKeyDown={e => e.key === 'Escape' && closeSearch()}
                      placeholder="חיפוש במסמך..."
                      dir="rtl"
                      className="text-xs bg-transparent outline-none w-32 text-right placeholder-gray-400"
                    />
                    <button onClick={closeSearch} className="p-0.5 rounded-full hover:bg-gray-200 transition-colors flex-shrink-0">
                      <X className="w-3 h-3 text-gray-500" />
                    </button>
                  </div>
                ) : (
                  <button title="חיפוש במסמך" onClick={() => setSearchActive(true)}
                    className="p-1.5 rounded-full transition-colors hover:bg-gray-100">
                    <Search className="w-4 h-4 text-gray-500" />
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Bell */}
            <button
              ref={bellRef}
              onClick={() => toggle('bell', showNotifications, setShowNotifications, bellRef, setBellPos)}
              className={`p-1.5 rounded-full transition-all relative ${activeIcon === 'bell' ? 'bg-[#1B3A6B]' : ''}`}
            >
              <Bell className={`w-5 h-5 ${activeIcon === 'bell' ? 'text-white' : 'text-gray-500'}`} />
              {activeIcon !== 'bell' && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#1B3A6B] rounded-full"></span>
              )}
            </button>

            {/* Support */}
            <button
              ref={supportRef}
              onClick={() => toggle('support', showSupport, setShowSupport, supportRef, setSupportPos)}
              className={`p-1.5 rounded-full transition-all ${activeIcon === 'support' ? 'bg-[#1B3A6B]' : ''}`}
            >
              <MessageCircle className={`w-5 h-5 ${activeIcon === 'support' ? 'text-white' : 'text-gray-500'}`} />
            </button>

            {/* Book */}
            <button
              ref={bookRef}
              onClick={() => toggle('book', showTraining, setShowTraining, bookRef, setBookPos)}
              className={`p-1.5 rounded-full transition-all ${activeIcon === 'book' ? 'bg-[#1B3A6B]' : ''}`}
            >
              <BookOpen className={`w-5 h-5 ${activeIcon === 'book' ? 'text-white' : 'text-gray-500'}`} />
            </button>

            <button
              onClick={() => { navigate('/personal'); setActiveIcon('user'); }}
              className={`p-1.5 rounded-full transition-all ${isPersonalAreaActive || activeIcon === 'user' ? 'bg-[#1B3A6B]' : ''}`}
            >
              <User className={`w-5 h-5 ${isPersonalAreaActive || activeIcon === 'user' ? 'text-white' : 'text-gray-500'}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Bell dropdown — fixed */}
      {showNotifications && bellPos && (
        <div
          ref={bellDropRef}
          className="fixed bg-white rounded-2xl shadow-lg w-80 overflow-hidden"
          style={{ top: bellPos.top, left: bellPos.left, zIndex: 99999 }}
          dir="rtl"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <button className="text-xs text-[#2D9B8A] hover:underline">סמן הכל כנקרא</button>
              <button
                onClick={closeAll}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto space-y-0">
              {[
                { icon: 'eye', text: 'ניתנה לך הרשאה לצפות במסמך "דוחות שנתיים"', time: 'לפני 5 דקות' },
                { icon: 'edit', text: 'קיבלת הרשאת עריכה במסמך "נהלי עבודה"', time: 'לפני 2 שעות' },
                { icon: 'eye', text: 'ניתנה לך הרשאה לצפות במסמך "מסמכי תקציב 2026"', time: 'לפני 3 שעות' },
                { icon: 'edit', text: 'קיבלת הרשאת עריכה במסמך "הסכמים משפטיים"', time: 'אתמול' },
                { icon: 'eye', text: 'ניתנה לך הרשאה לצפות במסמך "תיעוד טכני"', time: 'לפני 2 ימים' },
              ].map((n, i) => (
                <div key={i}>
                  <div className="py-3">
                    <div className="flex items-start gap-3">
                      {n.icon === 'eye'
                        ? <Eye className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                        : <Edit className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      }
                      <div className="flex-1">
                        <p className="text-sm text-gray-700 text-right">{n.text}</p>
                        <span className="text-xs text-gray-400 text-right">{n.time}</span>
                      </div>
                    </div>
                  </div>
                  {i < 4 && <div className="border-t border-gray-200"></div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Support dropdown — fixed */}
      {showSupport && supportPos && (
        <div
          ref={supportDropRef}
          className="fixed bg-white rounded-2xl shadow-lg w-52 overflow-hidden"
          style={{ top: supportPos.top, left: supportPos.left, zIndex: 99999 }}
          dir="rtl"
        >
          <div className="p-2">
            <button
              onClick={() => { setShowPermissionsModal(true); closeAll(); }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors text-right"
            >
              <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-700">הרשאות</span>
            </button>
            <button
              onClick={() => window.open('#', '_blank')}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors text-right"
            >
              <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-700 flex-1">צ'אט תמיכה</span>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            </button>
          </div>
        </div>
      )}

      {/* Book dropdown — fixed */}
      {showTraining && bookPos && !showFAQ && (
        <div
          ref={bookDropRef}
          className="fixed bg-white rounded-2xl shadow-lg w-52 overflow-hidden"
          style={{ top: bookPos.top, left: bookPos.left, zIndex: 99999 }}
          dir="rtl"
        >
          <div className="p-2">
            <button
              onClick={() => setShowFAQ(true)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors text-right"
            >
              <HelpCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-700">הדרכה</span>
            </button>
            <button
              onClick={() => window.open('#', '_blank')}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors text-right"
            >
              <Play className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-700 flex-1">לומדה</span>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            </button>
          </div>
        </div>
      )}

      {showTraining && bookPos && showFAQ && (
        <div
          ref={bookDropRef}
          className="fixed bg-white rounded-2xl shadow-lg w-80 overflow-hidden"
          style={{ top: bookPos.top, left: bookPos.left, zIndex: 99999 }}
          dir="rtl"
        >
          <div className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => { setShowFAQ(false); setExpandedFAQ(null); }}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowRight className="w-4 h-4 text-gray-500" />
              </button>
              <h3 className="text-sm font-medium text-gray-900">שאלות נפוצות</h3>
            </div>
            <div className="space-y-2">
              {[
                { q: 'איך מחפשים מסמך?', a: 'כדי לחפש מסמך, השתמש בשדה החיפוש בחלק העליון של המסך או עבור לתפריט "כל המסמכים" בסרגל הצד.' },
                { q: 'איך מבקשים הרשאה?', a: 'לחץ על המסמך הרצוי, בחר "בקש הרשאה" מהתפריט, ובחר את סוג ההרשאה הנדרשת (צפייה או עריכה).' },
                { q: 'איך יוצרים תיקייה חדשה?', a: 'לחץ על כפתור "+" בחלק העליון של רשימת המסמכים, בחר "תיקייה חדשה" והזן את שם התיקייה.' },
              ].map((faq, i) => (
                <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === i ? null : i)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-right"
                  >
                    <span className="text-sm text-gray-700">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expandedFAQ === i ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedFAQ === i && (
                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                      <p className="text-sm text-gray-600 text-right">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showDocPermissions && (
        <DocPermissionsModal onClose={() => setShowDocPermissions(false)} initialTab={permModalTab} isDistributed={isDistributed} />
      )}

      {/* Reading control modal */}
      {showReadingControl && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.45)' }} onClick={() => setShowReadingControl(false)}>
          <div dir="rtl" className="bg-white rounded-2xl shadow-2xl flex flex-col" style={{ width: 480, maxHeight: '70vh' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-bold text-base text-gray-900">בקרת קריאה</h2>
              <button onClick={() => setShowReadingControl(false)} className="p-1 rounded hover:bg-gray-100"><X className="w-4 h-4 text-gray-500" /></button>
            </div>
            <div className="overflow-y-auto flex-1 px-5 py-4">
              <table className="w-full text-sm text-right border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-2 font-semibold text-gray-600 text-xs">שם משתמש</th>
                    <th className="pb-2 font-semibold text-gray-600 text-xs">דרגה</th>
                    <th className="pb-2 font-semibold text-gray-600 text-xs">תאריך צפייה</th>
                    <th className="pb-2 font-semibold text-gray-600 text-xs">שעה</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'אלוף משנה כהן דוד', rank: 'אמ״ן', date: '12/07/2026', time: '09:14' },
                    { name: 'סגן אלוף לוי יוסף', rank: 'חיל השריון', date: '12/07/2026', time: '10:32' },
                    { name: 'רב סרן גולן אריאל', rank: 'חיל הרגלים', date: '13/07/2026', time: '07:55' },
                    { name: 'סגן מזרחי נועם', rank: 'חיל האוויר', date: '13/07/2026', time: '11:20' },
                  ].map((u, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2 text-xs text-gray-800">{u.name}</td>
                      <td className="py-2 text-xs text-gray-500">{u.rank}</td>
                      <td className="py-2 text-xs text-gray-500">{u.date}</td>
                      <td className="py-2 text-xs text-gray-500">{u.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Issue update warning modal */}
      {showIssueUpdate && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center" style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(2px)' }} onClick={() => setShowIssueUpdate(false)}>
          <div dir="rtl" className="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden" style={{ width: 500 }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-800">שימו לב</h2>
              <button onClick={() => setShowIssueUpdate(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                עדכון חדש למסמך יוצר גרסה נוספת למסמך. ברגע שמסמך זה ייכנס לתוקף, הוא יבטל את המסמך הקודם והמסמך הקודם יישמר בהיסטורית הפקודה.
              </p>
              <div className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 flex flex-col gap-2">
                <p className="text-xs font-semibold text-gray-700">מה ההבדל בין יצירת מס׳ פקודה חדש לבין הוצאת עדכון?</p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  <span className="font-medium text-gray-700">כאשר מוציאים מס׳ פקודה חדש</span> — מחליטים על שינוי מהותי של תכלית המסמך.
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  <span className="font-medium text-gray-700">כאשר מוציאים עדכון לפקודה</span> — ישנם סעיפים שמשתנים מהפקודה הקודמת, אך תכליתו נשארת זהה.
                </p>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setShowIssueUpdate(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
                ביטול
              </button>
              <button onClick={() => { setShowIssueUpdate(false); onIssueUpdate?.(); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: '#1B3A6B' }}>
                המשך
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Issue new command number warning modal */}
      {showIssueNew && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center" style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(2px)' }} onClick={() => setShowIssueNew(false)}>
          <div dir="rtl" className="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden" style={{ width: 500 }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-800">שימו לב</h2>
              <button onClick={() => setShowIssueNew(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                יצירת מס׳ פקודה חדש יוצרת גרסה נוספת למסמך. ברגע שמסמך זה ייכנס לתוקף, הוא יבטל את המסמך הקודם והמסמך הקודם יישמר בהיסטורית הפקודה.
              </p>
              <div className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 flex flex-col gap-2">
                <p className="text-xs font-semibold text-gray-700">מה ההבדל בין יצירת מס׳ פקודה חדש לבין הוצאת עדכון?</p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  <span className="font-medium text-gray-700">כאשר מוציאים מס׳ פקודה חדש</span> — מחליטים על שינוי מהותי של תכלית המסמך.
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  <span className="font-medium text-gray-700">כאשר מוציאים עדכון לפקודה</span> — ישנם סעיפים שמשתנים מהפקודה הקודמת, אך תכליתו נשארת זהה.
                </p>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setShowIssueNew(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
                ביטול
              </button>
              <button onClick={() => { setShowIssueNew(false); onIssueNew?.(); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: '#1B3A6B' }}>
                המשך
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Version compare modal */}
      {showVersionCompare && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center"
          style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(2px)' }}
          onClick={() => setShowVersionCompare(false)}>
          <div dir="rtl" className="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden" style={{ width: 720 }}
            onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-sm font-bold text-gray-800">השוואת גרסאות</h2>
              <button onClick={() => setShowVersionCompare(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Version list */}
            <div className="flex flex-col divide-y divide-gray-100">
              {[
                { label: 'עדכון מס׳ 2', datetime: '14.07.2026, 09:32', ref: 'א׳-2026-147', approvedBy: 'אל״מ דוד כהן', tag: 'נוכחית' },
                { label: 'עדכון מס׳ 1', datetime: '01.06.2026, 14:15', ref: 'א׳-2026-088', approvedBy: 'אל״מ דוד כהן', tag: '' },
                { label: 'פקודה מס׳ 001', datetime: '15.03.2026, 11:00', ref: 'א׳-2026-031', approvedBy: 'תא״ל רונן לוי', tag: '' },
              ].map((v, i) => (
                <div key={i} className="flex items-center justify-between px-6 py-4 gap-4">
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-800">{v.label}</span>
                      {v.tag && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: '#1B3A6B18', color: '#1B3A6B' }}>{v.tag}</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      עודכן ב-{v.datetime} &nbsp;·&nbsp; סימוכין: {v.ref} &nbsp;·&nbsp; אושר ע״י: {v.approvedBy}
                    </span>
                  </div>
                  <button
                    onClick={() => { onStartComparison?.({ label: v.label }); setShowVersionCompare(false); }}
                    className="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90"
                    style={{ background: '#1B3A6B' }}>
                    השוואה
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showPermissionsModal && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 99999 }}
          onClick={() => setShowPermissionsModal(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-[600px] max-w-[90vw] p-8"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h2 className="font-bold text-xl text-gray-900 mb-2">טיפול בהרשאות</h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  לצפייה במסמכים ופתיחת הרשאות למערכת יש לפנות אל הפיקוד הרלוונטי אליך
                </p>
              </div>
              <button
                onClick={() => setShowPermissionsModal(false)}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 mr-4"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-0 mt-6">
              {['ארגון א\'', 'ארגון ב\'', 'ארגון ג\'', 'ארגון ד\''].map((org, i) => (
                <div key={i}>
                  <div className="py-4 flex items-center justify-between">
                    <span className="text-gray-800">{org}</span>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">050-1234567</span>
                    </div>
                    <button className="p-2 hover:bg-[#2D9B8A]/10 rounded-full transition-colors">
                      <MessageSquare className="w-5 h-5 text-[#2D9B8A]" />
                    </button>
                  </div>
                  {i < 3 && <div className="border-t border-gray-200"></div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
