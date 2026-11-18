import { useState, useRef, useEffect, type ReactNode } from 'react';
import { User, ChevronDown, Eye, X, Phone, FileEdit, Trash2, Search, Plus, FileText, FileSpreadsheet, Users, Layers, List, PenLine, UserCheck, Network, Check, Download, Inbox, Clock, XCircle, CheckCircle2, Undo2, RotateCcw, type LucideIcon } from 'lucide-react';

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

type PermRequestStatus = 'pending' | 'approved' | 'rejected';
type PermRequest = {
  id: string;
  user: PermUser;
  // fields filled in the "בקשת הרשאה" dialog
  role: string;
  phone: string;
  reason: string;
  date: string;
  status: PermRequestStatus;
  handledBy?: string;
  handledAt?: string;
  rejectReason?: string;
};
const PERM_REQUESTS_DATA: PermRequest[] = [
  { id: 'r1', user: { id: 'p4',  name: 'רחל דוד',     idNumber: '045678901', environment: 'ארגון ג׳' },
    role: 'קצינת לוגיסטיקה', phone: '050-1234567',
    reason: 'אני אחראית על תיאום הלוגיסטיקה ונדרשת לי גישה לפקודה המופצת.', date: 'היום, 09:42', status: 'pending' },
  { id: 'r2', user: { id: 'p13', name: 'עמי שלו',     idNumber: '134567890', environment: 'ארגון ד׳' },
    role: 'רמ״ד תכנון', phone: '052-7654321',
    reason: 'הפקודה רלוונטית לתחום האחריות שלי ואינני ברשימת התפוצה.', date: 'היום, 08:15', status: 'pending' },
  { id: 'r3', user: { id: 'p15', name: 'גיל אלון',    idNumber: '156789012', environment: 'ארגון ג׳' },
    role: 'קצין מבצעים', phone: '054-3322110',
    reason: 'אני מתכלל את פעילות המבצעים בגזרה וצריך להכיר את הוראות הפקודה.', date: 'אתמול, 17:30', status: 'pending' },
  { id: 'r4', user: { id: 'n2',  name: 'רונית שפיר',  idNumber: '202345678', environment: 'ארגון ב׳', subLabel: 'מערכת סודי' },
    role: 'ע. ראש מדור', phone: '053-9988776',
    reason: 'נדרשת לי גישה לפקודה לצורך תיאום מול היחידה.', date: 'אתמול, 11:05', status: 'pending' },
  { id: 'r5', user: { id: 'p7',  name: 'דני אברהם',   idNumber: '078901234', environment: 'ארגון ד׳' },
    role: 'סגן רמ״ד', phone: '050-5566778',
    reason: 'מחליף את רמ״ד בזמן היעדרותו.', date: '12/11/2026', status: 'approved', handledBy: 'אבי כהן', handledAt: '12/11/2026' },
  { id: 'r6', user: { id: 'p12', name: 'תמר ברק',     idNumber: '123456789', environment: 'ארגון ב׳' },
    role: 'מש״קית הדרכה', phone: '058-4433221',
    reason: 'לצורך הכנת מצגת.', date: '10/11/2026', status: 'rejected', handledBy: 'אבי כהן', handledAt: '11/11/2026', rejectReason: 'הפקודה אינה רלוונטית לתפקידך.' },
];

// ─── Grants model ─────────────────────────────────────────────────────────────
// A grant = one person holding one permission type, received through one source ("via"),
// optionally scoped to a clause (section editors / approvers).
type ViaKind = 'direct' | 'hamal' | 'miraz' | 'list' | 'doc' | 'excel' | 'request';
type Via = { kind: ViaKind; id: string; label: string };
type Grant = { perm: number; person: PermUser; via: Via; clause?: string };

const viaKey = (v: Via) => `${v.kind}:${v.id}`;
const grantKey = (g: Grant) => `${g.perm}|${g.person.id}|${viaKey(g.via)}|${g.clause ?? ''}`;

// Calm palette — same family as the field-type badges in the template source-fields panel
const VIA_META: Record<ViaKind, { label: string; Icon: LucideIcon; bg: string; fg: string }> = {
  direct:  { label: 'ישיר',          Icon: User,            bg: '#EEF1F5', fg: '#475569' },
  hamal:   { label: 'קבוצת חמ"ל',    Icon: Users,           bg: '#E3F2FB', fg: '#0369A1' },
  miraz:   { label: "קבוצת מיראז'",  Icon: Layers,          bg: '#E6ECF5', fg: '#1B3A6B' },
  list:    { label: 'רשימת תפוצה',   Icon: List,            bg: '#E0F4F1', fg: '#0F766E' },
  doc:     { label: 'ממסמך קיים',    Icon: FileText,        bg: '#ECEBFA', fg: '#4F46A5' },
  excel:   { label: 'Excel',         Icon: FileSpreadsheet, bg: '#E7F3EC', fg: '#1D6F42' },
  request: { label: 'בקשת הרשאה',    Icon: Inbox,           bg: '#EEF1F5', fg: '#475569' },
};
const DIRECT_VIA: Via = { kind: 'direct', id: 'direct', label: 'ישיר' };

// Clause labels for section editors / approvers
const PERM_CLAUSES: { id: string; label: string; chapter: string; depth: 0 | 1 }[] = PERM_DOC_STRUCTURE.flatMap(ch =>
  ch.sections.flatMap(s => [
    { id: s.id, label: `${s.num}. ${s.title}`, chapter: ch.title, depth: 0 as const },
    ...s.subs.map((ss, i) => ({ id: ss.id, label: `${s.num}.${i + 1} ${ss.title}`, chapter: ch.title, depth: 1 as const })),
  ]));
const clauseLabel = (id?: string) => PERM_CLAUSES.find(c => c.id === id)?.label ?? '';

const CHANGE = {
  added:   { bar: '#7CC29A', bg: '#E6F4EC', fg: '#2F7A50' },
  removed: { bar: '#E2A3A3', bg: '#FBECEC', fg: '#A23B3B' },
};

function ViaTile({ kind, size = 24 }: { kind: ViaKind; size?: number }) {
  const m = VIA_META[kind];
  return (
    <span className="group/via relative flex-shrink-0" aria-label={m.label}>
      <span className="rounded-md flex items-center justify-center" style={{ width: size, height: size, background: m.bg, color: m.fg }}>
        <m.Icon className={size > 22 ? 'w-3.5 h-3.5' : 'w-3 h-3'} strokeWidth={2} />
      </span>
      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 rounded-md bg-gray-900 text-white text-[11px] font-medium whitespace-nowrap shadow-lg opacity-0 group-hover/via:opacity-100 transition-opacity z-20">
        {m.label}
      </span>
    </span>
  );
}

// Seed so the dialog opens with realistic content
const SEED_GRANTS: Grant[] = (() => {
  const P = (id: string) => PERM_PEOPLE_POOL.find(p => p.id === id)!;
  const miraz = PERM_MIRAZ_GROUPS[0];
  const list = PERM_PERSONAL_LISTS[0];
  const g: Grant[] = [];
  ['p7', 'p9'].forEach(id => g.push({ perm: 0, person: P(id), via: DIRECT_VIA }));
  miraz.members.forEach(m => g.push({ perm: 0, person: m, via: { kind: 'miraz', id: miraz.id, label: miraz.name } }));
  list.members.forEach(m => g.push({ perm: 0, person: m, via: { kind: 'list', id: list.id, label: list.name } }));
  g.push({ perm: 1, person: P('p3'), via: DIRECT_VIA });
  g.push({ perm: 2, person: P('p1'), via: DIRECT_VIA });
  g.push({ perm: 3, person: P('p2'), via: DIRECT_VIA, clause: 's1' });
  g.push({ perm: 3, person: P('p2'), via: DIRECT_VIA, clause: 's3' });
  g.push({ perm: 3, person: P('p6'), via: DIRECT_VIA, clause: 'ss21' });
  g.push({ perm: 4, person: P('p1'), via: DIRECT_VIA, clause: 's3' });
  return g;
})();

type BasketItem = { via: Via; people: PermUser[] };

/** "Add" dialog: sources on the right, a basket of everything picked (across all sources) on the left. */
function AddPermissionsDialog({ permLabel, clauseMode, isGranted, onAdd, onClose }: {
  permLabel: string; clauseMode: boolean;
  isGranted: (personId: string) => boolean;
  onAdd: (items: BasketItem[], clauses: string[]) => void;
  onClose: () => void;
}) {
  type Src = 'network' | 'doc' | 'hamal' | 'miraz' | 'personal' | 'excel';
  const [src, setSrc] = useState<Src>('network');
  const [q, setQ] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [networkFilter, setNetworkFilter] = useState<'sodibioti' | 'sodi' | 'aman'>('sodibioti');
  const [docTab, setDocTab] = useState<'distributed' | 'drafts'>('distributed');
  const [listTab, setListTab] = useState<'mine' | 'all'>('mine');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [basket, setBasket] = useState<BasketItem[]>([]);
  const [clauses, setClauses] = useState<string[]>([]);
  const [clauseOpen, setClauseOpen] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [manualUser, setManualUser] = useState('');
  const [manualName, setManualName] = useState('');
  const [confirmClose, setConfirmClose] = useState(false);

  const inBasket = (v: Via) => basket.some(b => viaKey(b.via) === viaKey(v));
  const personInBasket = (id: string) => basket.some(b => b.people.some(p => p.id === id));
  const toggleItem = (item: BasketItem) =>
    setBasket(p => p.some(b => viaKey(b.via) === viaKey(item.via)) ? p.filter(b => viaKey(b.via) !== viaKey(item.via)) : [...p, item]);
  const addPerson = (p: PermUser) => {
    if (personInBasket(p.id) && basket.some(b => b.via.kind === 'direct' && b.people[0]?.id === p.id)) return;
    setBasket(prev => [...prev, { via: { kind: 'direct', id: p.id, label: p.name }, people: [p] }]);
  };
  const newPeople = new Set(basket.flatMap(b => b.people).filter(p => !isGranted(p.id)).map(p => p.id));
  const canAdd = basket.length > 0 && (!clauseMode || clauses.length > 0);
  const requestClose = () => { if (basket.length) setConfirmClose(true); else onClose(); };

  const switchSrc = (s: Src) => { setSrc(s); setQ(''); setExpanded(null); setSearchOpen(false); setManualOpen(false); };
  const SOURCES: { key: Src; label: string; Icon: LucideIcon }[] = [
    { key: 'network',  label: 'הוסף מרשתות',   Icon: Network },
    { key: 'doc',      label: 'ממסמך קיים',    Icon: FileText },
    { key: 'hamal',    label: 'קבוצות חמ"ל',   Icon: Users },
    { key: 'miraz',    label: "קבוצות מיראז'", Icon: Layers },
    { key: 'personal', label: 'אזור אישי',      Icon: List },
    { key: 'excel',    label: 'Excel',          Icon: FileSpreadsheet },
  ];

  const peopleResults = q.trim()
    ? [...PERM_NETWORK_PEOPLE.filter(p => p.network === networkFilter).map(p => ({ ...p, subLabel: p.networkLabel })), ...PERM_PEOPLE_POOL]
        .filter(p => p.name.includes(q) || p.idNumber.includes(q))
    : [];

  // generic expandable checkbox row for groups / lists / docs
  const PickRow = ({ via, people, title, meta }: { via: Via; people: PermUser[]; title: string; meta?: ReactNode }) => {
    const allGranted = people.length > 0 && people.every(p => isGranted(p.id));
    const sel = inBasket(via);
    const open = expanded === via.id;
    return (
      <div className="border-b border-gray-50 last:border-0">
        <div className={`grid items-center px-4 py-2.5 transition-colors ${allGranted ? '' : 'cursor-pointer'} ${sel ? 'bg-[#EEF4FF]' : 'hover:bg-gray-50'}`}
          style={{ gridTemplateColumns: '24px 1fr auto 28px', columnGap: 8 }}
          onClick={() => !allGranted && toggleItem({ via, people })}>
          <span className={`w-[18px] h-[18px] rounded border-[1.5px] flex items-center justify-center ${allGranted ? 'border-gray-200' : sel ? 'bg-[#1B3A6B] border-[#1B3A6B]' : 'border-gray-300'}`}>
            {allGranted ? <Check className="w-3 h-3 text-gray-300" strokeWidth={2.5} /> : sel && <Check className="w-3 h-3 text-white" />}
          </span>
          <span className={`text-xs font-medium truncate ${allGranted ? 'text-gray-400' : 'text-gray-800'}`}>
            {title} <span className="font-normal text-gray-400">({people.length})</span>
          </span>
          <span className="flex items-center gap-2 text-[11px] text-gray-400 whitespace-nowrap">
            {meta}{allGranted && <span>כבר מורשים</span>}
          </span>
          <button type="button" onClick={e => { e.stopPropagation(); setExpanded(open ? null : via.id); }} aria-label="הצגת חברים"
            className="flex items-center justify-center w-6 h-6 rounded hover:bg-gray-200 transition-colors">
            <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
        </div>
        {open && (
          <div className="bg-blue-50/40 border-t border-blue-100 py-1">
            {people.map(p => (
              <div key={p.id} className="grid items-center px-4 py-1.5" style={{ gridTemplateColumns: '24px 1fr 90px 80px', columnGap: 8 }}>
                <span />
                <span className={`text-[11px] font-medium truncate ${isGranted(p.id) ? 'text-gray-400' : 'text-gray-700'}`}>{p.name}</span>
                <span className="text-[11px] text-gray-500 tabular-nums text-center">{p.idNumber}</span>
                <span className="text-[11px] text-gray-400 text-center">{isGranted(p.id) ? 'כבר מורשה' : p.environment}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  const ListHeader = ({ label }: { label: string }) => (
    <div className="sticky top-0 z-10 grid items-center px-4 py-2 text-[10px] font-semibold text-gray-500 select-none"
      style={{ background: '#EBEBEB', gridTemplateColumns: '24px 1fr auto 28px', columnGap: 8 }}>
      <span /><span>{label}</span><span /><span />
    </div>
  );
  const SubTabs = ({ tabs, value, onChange }: { tabs: readonly (readonly [string, string])[]; value: string; onChange: (v: string) => void }) => (
    <div className="flex gap-5 px-4 border-b border-gray-100 flex-shrink-0">
      {tabs.map(([val, label]) => (
        <button key={val} type="button" onClick={() => onChange(val)}
          className={`relative py-2.5 text-xs font-semibold whitespace-nowrap transition-colors ${value === val ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
          {label}
          {value === val && <span className="absolute bottom-0 right-0 left-0 h-0.5 rounded-full bg-gray-900" />}
        </button>
      ))}
    </div>
  );

  // basket grouped by source kind
  const basketGroups = (Object.keys(VIA_META) as ViaKind[])
    .map(kind => ({ kind, items: basket.filter(b => b.via.kind === kind) }))
    .filter(g => g.items.length);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center" dir="rtl">
      <div className="absolute inset-0 bg-gray-900/30" onMouseDown={requestClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden w-[1040px] max-w-[94%] h-[560px] max-h-[94%]"
        onMouseDown={e => e.stopPropagation()}>
        {/* header */}
        <div className="flex items-center justify-between px-7 py-4 border-b border-gray-100 flex-shrink-0">
          <h3 className="text-lg font-bold text-gray-900">הוספה ל{permLabel}</h3>
          <button type="button" onClick={requestClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors" aria-label="סגירה">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 flex min-h-0">
          {/* RIGHT: sources */}
          <div className="w-[560px] flex-shrink-0 flex flex-col border-l border-gray-100 min-h-0">
            {clauseMode && (
              <div className="px-4 pt-3.5 flex-shrink-0 relative">
                <p className="text-[11px] text-gray-400 mb-1.5 font-medium">לאילו סעיפים להוסיף</p>
                <button type="button" onClick={() => setClauseOpen(o => !o)}
                  className={`w-full min-h-[40px] flex items-center gap-1.5 flex-wrap px-2.5 py-1.5 border rounded-xl text-right transition-colors ${clauses.length ? 'border-gray-200' : 'border-amber-300 bg-amber-50/40'}`}>
                  {clauses.length === 0
                    ? <span className="text-xs text-gray-400 px-1">בחר סעיף אחד או יותר...</span>
                    : clauses.map(c => (
                      <span key={c} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#EEF4FF] text-[#1B3A6B]">
                        {clauseLabel(c)}
                        <span role="button" aria-label="הסרה" onClick={e => { e.stopPropagation(); setClauses(p => p.filter(x => x !== c)); }}><X className="w-3 h-3" /></span>
                      </span>
                    ))}
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-400 mr-auto transition-transform ${clauseOpen ? 'rotate-180' : ''}`} />
                </button>
                {clauseOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setClauseOpen(false)} />
                    <div className="absolute right-4 left-4 top-full mt-1 z-40 bg-white border border-gray-100 rounded-xl shadow-xl max-h-64 overflow-y-auto py-1">
                      {PERM_DOC_STRUCTURE.map(ch => (
                        <div key={ch.id}>
                          <p className="px-3 pt-2 pb-1 text-[11px] font-bold text-[#1B3A6B]">{ch.title}</p>
                          {PERM_CLAUSES.filter(c => c.chapter === ch.title).map(c => {
                            const on = clauses.includes(c.id);
                            return (
                              <button key={c.id} type="button" onClick={() => setClauses(p => on ? p.filter(x => x !== c.id) : [...p, c.id])}
                                className="w-full flex items-center gap-2 py-1.5 hover:bg-gray-50 text-right" style={{ paddingRight: c.depth ? 34 : 14, paddingLeft: 12 }}>
                                <span className={`w-4 h-4 rounded border-[1.5px] flex items-center justify-center flex-shrink-0 ${on ? 'bg-[#1B3A6B] border-[#1B3A6B]' : 'border-gray-300'}`}>
                                  {on && <Check className="w-2.5 h-2.5 text-white" />}
                                </span>
                                <span className={`text-xs ${c.depth ? 'text-gray-600' : 'font-semibold text-gray-800'}`}>{c.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="px-4 pt-3.5 pb-3 flex-shrink-0">
              <p className="text-[11px] text-gray-400 mb-2 font-medium">הוספה מ־</p>
              <div className="grid grid-cols-3 gap-1.5">
                {SOURCES.map(({ key, label, Icon }) => {
                  const active = src === key;
                  return (
                    <button key={key} type="button" onClick={() => switchSrc(key)}
                      className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl border transition-all text-right ${active ? '' : 'border-gray-100 bg-gray-50/60 hover:bg-white hover:border-gray-200 hover:shadow-sm'}`}
                      style={active ? { background: '#1B3A6B07', borderColor: '#1B3A6B35', boxShadow: '0 1px 3px rgba(27,58,107,0.08)' } : undefined}>
                      <span className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={active ? { background: '#1B3A6B18' } : { background: 'white', border: '1px solid #f3f4f6' }}>
                        <Icon className="w-2.5 h-2.5" style={{ color: active ? '#1B3A6B' : key === 'excel' ? '#1D6F42' : '#9ca3af' }} />
                      </span>
                      <span className="text-[11px] font-semibold truncate" style={{ color: active ? '#1B3A6B' : '#374151' }}>{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {src !== 'excel' && (
              <div className="px-4 pb-3 flex-shrink-0 flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input type="text" value={q} dir="rtl" autoComplete="off"
                    onChange={e => { setQ(e.target.value); setSearchOpen(true); }}
                    onFocus={() => setSearchOpen(true)}
                    onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
                    placeholder={src === 'network' ? 'הוספה או חיפוש לפי שם או ת.ז...' : src === 'doc' ? 'חיפוש מסמך...' : src === 'personal' ? 'חיפוש רשימה...' : 'חיפוש קבוצה...'}
                    className="w-full pr-9 pl-4 py-2.5 border border-gray-200 rounded-xl text-sm text-right focus:outline-none focus:border-[#1B3A6B] bg-white transition-colors" />
                  {src === 'network' && searchOpen && q.trim() !== '' && (
                    <div className="absolute top-full right-0 left-0 mt-1.5 z-30 rounded-xl border border-gray-100 bg-white shadow-lg max-h-64 overflow-y-auto">
                      {peopleResults.length === 0
                        ? <div className="py-5 text-center text-sm text-gray-400">לא נמצאו תוצאות</div>
                        : peopleResults.map(p => {
                          const granted = isGranted(p.id);
                          const picked = personInBasket(p.id);
                          const disabled = granted || picked;
                          return (
                            <button key={p.id} type="button" disabled={disabled}
                              onMouseDown={() => { if (disabled) return; addPerson(p); setQ(''); setSearchOpen(false); }}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 border-b border-gray-50 last:border-0 text-right transition-colors ${disabled ? 'cursor-default' : 'hover:bg-gray-50'}`}>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium truncate ${disabled ? 'text-gray-400' : 'text-gray-800'}`}>{p.name}</p>
                                <p className="text-xs text-gray-400">{p.idNumber}{(p as { subLabel?: string }).subLabel && <span className="mr-1.5 text-gray-300">· {(p as { subLabel?: string }).subLabel}</span>}</p>
                              </div>
                              {granted ? <span className="text-[11px] text-gray-400 flex-shrink-0">כבר מורשה</span>
                                : picked ? <span className="flex items-center gap-1 text-[11px] font-medium text-[#1B3A6B] flex-shrink-0"><Check className="w-3.5 h-3.5" />בסל</span>
                                : <Plus className="w-4 h-4 text-gray-300 flex-shrink-0" />}
                            </button>
                          );
                        })}
                    </div>
                  )}
                </div>
                {src === 'network' && (
                  <button type="button" onClick={() => setManualOpen(o => !o)}
                    className={`flex items-center gap-1 px-3 py-2 text-xs rounded-xl font-semibold transition-colors whitespace-nowrap flex-shrink-0 ${manualOpen ? 'bg-gray-100 text-gray-600' : 'bg-[#1B3A6B] text-white hover:bg-[#152e54]'}`}>
                    {manualOpen ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    הוספה ידנית
                  </button>
                )}
              </div>
            )}

            {src === 'network' && manualOpen && (
              <div className="mx-4 mb-3 p-3 rounded-xl border border-dashed border-[#c7d9ff] bg-[#F8FAFF] grid gap-2 flex-shrink-0" style={{ gridTemplateColumns: '1fr 1fr auto' }}>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white focus-within:border-[#1B3A6B]" dir="ltr">
                  <input type="text" value={manualUser} onChange={e => setManualUser(e.target.value)} placeholder="מזהה משתמש" dir="rtl"
                    className="flex-1 min-w-0 px-2.5 py-2 text-xs focus:outline-none text-right" />
                  <span className="px-2 py-2 text-[11px] text-gray-400 bg-gray-50 border-l border-gray-200 whitespace-nowrap">@army.idf.il</span>
                </div>
                <input type="text" value={manualName} onChange={e => setManualName(e.target.value)} placeholder="שם תצוגה" dir="rtl"
                  className="px-2.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B3A6B] bg-white" />
                <button type="button" disabled={!manualUser.trim() && !manualName.trim()}
                  onClick={() => {
                    const networkLabel = networkFilter === 'sodibioti' ? 'סודי ביותר' : networkFilter === 'sodi' ? 'סודי' : 'אמ"ן';
                    addPerson({ id: `manual-${Date.now()}`, name: manualName.trim() || manualUser.trim(), idNumber: manualUser.trim(), environment: networkLabel });
                    setManualUser(''); setManualName(''); setManualOpen(false);
                  }}
                  className="px-3 py-2 rounded-lg text-xs font-semibold bg-[#1B3A6B] text-white hover:bg-[#152e54] transition-colors disabled:opacity-40">
                  הוספה
                </button>
              </div>
            )}

            {/* source content */}
            <div className="flex-1 min-h-0 flex flex-col border-t border-gray-100">
              {src === 'network' && (
                <>
                  <SubTabs tabs={[['sodibioti', 'סודי ביותר'], ['sodi', 'סודי'], ['aman', 'אמ"ן']] as const} value={networkFilter} onChange={v => { setNetworkFilter(v as 'sodibioti' | 'sodi' | 'aman'); setQ(''); }} />
                  <div className="flex-1 flex items-center justify-center"><p className="text-xs text-gray-400">חפש לפי שם או ת.ז. להוספה</p></div>
                </>
              )}
              {src === 'doc' && (
                <>
                  <SubTabs tabs={[['distributed', 'פקודות שהופצו'], ['drafts', 'טיוטות']] as const} value={docTab} onChange={v => setDocTab(v as 'distributed' | 'drafts')} />
                  <div className="flex-1 overflow-y-auto">
                    <ListHeader label="שם מסמך" />
                    {PERM_DOCS_DATA.filter(d => !q || d.name.includes(q)).map(d => (
                      <PickRow key={d.id} via={{ kind: 'doc', id: d.id, label: d.name }} people={d.distribution} title={d.name}
                        meta={<span className="tabular-nums">{d.orderNum} · {d.updateNum}</span>} />
                    ))}
                  </div>
                </>
              )}
              {src === 'hamal' && (
                <div className="flex-1 overflow-y-auto">
                  <ListHeader label="שם הקבוצה" />
                  {PERM_HAMAL_GROUPS.filter(g => !q || g.name.includes(q)).map(g => (
                    <PickRow key={g.id} via={{ kind: 'hamal', id: g.id, label: g.name }} people={g.members} title={g.name} />
                  ))}
                </div>
              )}
              {src === 'miraz' && (
                <div className="flex-1 overflow-y-auto">
                  <ListHeader label="שם הקבוצה" />
                  {PERM_MIRAZ_GROUPS.filter(g => !q || g.name.includes(q)).map(g => (
                    <PickRow key={g.id} via={{ kind: 'miraz', id: g.id, label: g.name }} people={g.members} title={g.name} />
                  ))}
                </div>
              )}
              {src === 'personal' && (
                <>
                  <SubTabs tabs={[['mine', 'רשימות של המכלול שלי'], ['all', 'כלל רשימות התפוצה']] as const} value={listTab} onChange={v => setListTab(v as 'mine' | 'all')} />
                  <div className="flex-1 overflow-y-auto">
                    <ListHeader label="שם הרשימה" />
                    {PERM_PERSONAL_LISTS.filter(l => !q || l.name.includes(q)).map(l => (
                      <PickRow key={l.id} via={{ kind: 'list', id: l.id, label: l.name }} people={l.members} title={l.name} />
                    ))}
                  </div>
                </>
              )}
              {src === 'excel' && (
                <div className="flex-1 flex flex-col">
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                    <input type="file" accept=".xlsx,.xls" className="hidden" id="perm-excel-input"
                      onChange={e => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        // mock parse: first rows of column A → people
                        toggleItem({ via: { kind: 'excel', id: f.name, label: f.name }, people: PERM_PEOPLE_POOL.slice(11, 15) });
                        e.target.value = '';
                      }} />
                    <button type="button" onClick={() => document.getElementById('perm-excel-input')?.click()}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-colors hover:opacity-90" style={{ background: '#1D6F42' }}>
                      <Plus className="w-3.5 h-3.5" />ייבוא מאקסל
                    </button>
                    <span className="text-[11px] text-gray-400">קובץ .xlsx עם עמודה A בלבד ורשימת מספרים אישיים</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center px-6">
                    <div style={{ width: 320, textAlign: 'right', marginBottom: 6 }}><span className="text-xs text-gray-400 font-medium">:לדוגמא</span></div>
                    <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm" style={{ direction: 'ltr', fontSize: 12, userSelect: 'none', width: 320 }}>
                      <div className="flex" style={{ background: '#f8f9fa' }}>
                        <div style={{ width: 32, borderRight: '1px solid #e2e4e7', borderBottom: '1px solid #e2e4e7' }} />
                        {['A', 'B', 'C'].map((col, i) => (
                          <div key={col} style={{ flex: 1, borderRight: i < 2 ? '1px solid #e2e4e7' : undefined, borderBottom: '1px solid #e2e4e7', padding: '4px 8px', textAlign: 'center', fontWeight: 600, background: col === 'A' ? '#1B3A6B' : undefined, color: col === 'A' ? '#fff' : '#555' }}>{col}</div>
                        ))}
                      </div>
                      {['s1234567', 's7654321', 'm1234567', 'm7654321', ''].map((val, i) => (
                        <div key={i} className="flex" style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                          <div style={{ width: 32, borderRight: '1px solid #e2e4e7', borderBottom: '1px solid #e2e4e7', padding: '4px 0', textAlign: 'center', color: '#aaa', fontSize: 10, background: '#f8f9fa' }}>{i + 1}</div>
                          <div style={{ flex: 1, borderRight: '1px solid #e2e4e7', borderBottom: '1px solid #e2e4e7', padding: '4px 8px', textAlign: 'right' }}>{val}</div>
                          {['', ''].map((_, j) => <div key={j} style={{ flex: 1, borderRight: j < 1 ? '1px solid #e2e4e7' : undefined, borderBottom: '1px solid #e2e4e7' }} />)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* LEFT: basket */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#FAFBFD]">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 flex-shrink-0">
              <span className="text-sm font-semibold text-gray-800">נבחרו להוספה {basket.length > 0 && <span className="font-normal text-gray-500">({basket.length})</span>}</span>
              {basket.length > 0 && <span className="text-[11px] text-gray-500">{newPeople.size} אנשים חדשים</span>}
            </div>
            <div className="flex-1 overflow-y-auto">
              {basket.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <Users className="w-9 h-9 text-gray-200 mx-auto mb-2.5" />
                  <p className="text-xs text-gray-400 leading-relaxed">בחר אנשים, קבוצות או רשימות מהפאנל הימני.<br />אפשר לשלב כמה מקורות לפני ההוספה.</p>
                </div>
              ) : basketGroups.map(g => (
                <div key={g.kind}>
                  <div className="flex items-center gap-2 px-5 pt-3 pb-1.5 text-[11px] font-semibold text-gray-500">
                    <ViaTile kind={g.kind} size={20} />{g.kind === 'direct' ? 'אנשים' : VIA_META[g.kind].label}
                  </div>
                  {g.items.map(b => {
                    const fresh = b.people.filter(p => !isGranted(p.id)).length;
                    return (
                      <div key={viaKey(b.via)} className="flex items-center gap-3 pr-12 pl-4 py-2 hover:bg-gray-100/60 transition-colors">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-800 truncate">{b.via.kind === 'direct' ? b.people[0].name : b.via.label}</p>
                          <p className="text-[11px] text-gray-400 tabular-nums">
                            {b.via.kind === 'direct' ? b.people[0].idNumber : `${b.people.length} אנשים · ${fresh} חדשים`}
                          </p>
                        </div>
                        <button type="button" onClick={() => setBasket(p => p.filter(x => viaKey(x.via) !== viaKey(b.via)))} aria-label="הסרה מהסל"
                          className="p-1 rounded text-gray-400 hover:text-[#1B3A6B] hover:bg-[#EEF4FF] transition-colors">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="flex items-center justify-between px-7 py-3.5 border-t border-gray-100 flex-shrink-0">
          <button type="button" onClick={requestClose} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">ביטול</button>
          <div className="flex items-center gap-3">
            {clauseMode && basket.length > 0 && clauses.length === 0 && <span className="text-xs text-amber-700">יש לבחור לפחות סעיף אחד</span>}
            <button type="button" disabled={!canAdd} onClick={() => onAdd(basket, clauses)}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors ${canAdd ? 'bg-[#1B3A6B] text-white hover:bg-[#152e54]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
              {basket.length ? `הוסף ${basket.length}` : 'הוסף'}
            </button>
          </div>
        </div>

        {confirmClose && (
          <div className="absolute inset-0 bg-gray-900/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-[360px] flex flex-col gap-3">
              <p className="font-bold text-gray-900">לסגור בלי להוסיף?</p>
              <p className="text-sm text-gray-500 leading-relaxed">יש {basket.length} פריטים בסל שעדיין לא נוספו. אם תסגור עכשיו, הם לא יתווספו.</p>
              <div className="flex items-center justify-between mt-2">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">סגירה בלי הוספה</button>
                <button type="button" onClick={() => setConfirmClose(false)} className="px-4 py-2 bg-[#1B3A6B] text-white rounded-xl text-sm font-medium hover:bg-[#152e54] transition-colors">חזרה</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function DocPermissionsModal({ onClose, initialTab = 0, isDistributed = false }: { onClose: () => void; initialTab?: number; isDistributed?: boolean }) {
  const PERMISSIONS = [
    { label: 'צפייה לאחר הפצה', short: 'צפייה אחרי הפצה', role: 'צופה', Icon: Eye,
      desc: 'יכולים לצפות בתוכן הפקודה לאחר הפצתה.' },
    { label: isDistributed ? 'מורשים לייצוא לוורד' : 'צפייה טרם הפצה', short: isDistributed ? 'ייצוא לוורד' : 'צפייה לפני הפצה',
      role: isDistributed ? 'מייצא לוורד' : 'צופה טרם הפצה', Icon: Eye,
      desc: isDistributed
        ? 'יכולים לייצא את הפקודה ל-Word.'
        : 'יכולים לצפות בתוכן הפקודה כשהיא ״בהכנה״ או ״בסבב אישורים״, ולייצא אותה ל-Word ו-PDF.' },
    { label: 'ניהול פקודה', short: 'ניהול פקודה', role: 'מנהל פקודה', Icon: Network,
      desc: 'מנהלים את הפקודה כמו ״בעל פקודה״: עורכים ומאשרים את כל הסעיפים ומשנים את סדר הפקודה.' },
    { label: 'עורכי סעיפים', short: 'עורכי סעיפים', role: 'עורך סעיף', Icon: PenLine,
      desc: 'יכולים לערוך את הסעיף שבעבורו ניתנה ההרשאה, כשהפקודה ״בהכנה״. אינם משויכים לרשימת התפוצה.' },
    { label: 'מאשרי סעיף', short: 'מאשרי סעיף', role: 'מאשר סעיף', Icon: UserCheck,
      desc: 'יכולים לאשר את הסעיף שבעבורו ניתנה ההרשאה, כשהפקודה ״בהכנה״. אינם משויכים לרשימת התפוצה.' },
  ];

  const [activeIdx, setActiveIdx] = useState(initialTab);
  const [grants, setGrants]       = useState<Grant[]>(SEED_GRANTS);
  const [removed, setRemoved]     = useState<Set<string>>(new Set());
  const initialKeys = useRef(new Set(SEED_GRANTS.map(grantKey))).current;
  const [view, setView]           = useState<'flat' | 'source' | 'clause'>('flat');
  const [listQ, setListQ]         = useState('');
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [addOpen, setAddOpen]     = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);

  const REQUESTS_IDX = PERMISSIONS.length;
  const isRequests = activeIdx === REQUESTS_IDX;
  const [requests, setRequests]             = useState<PermRequest[]>(PERM_REQUESTS_DATA);
  const [reqTab, setReqTab]                 = useState<'pending'|'handled'>('pending');
  const [reqSearch, setReqSearch]           = useState('');
  const [rejectingId, setRejectingId]       = useState<string|null>(null);
  const [rejectText, setRejectText]         = useState('');
  const pendingCount = requests.filter(r => r.status === 'pending').length;

  const isClauseMode = activeIdx === 3 || activeIdx === 4;
  useEffect(() => { if (!isClauseMode && view === 'clause') setView('flat'); }, [isClauseMode, view]);

  const live = (g: Grant) => !removed.has(grantKey(g));
  const isNew = (g: Grant) => !initialKeys.has(grantKey(g));
  const permGrants = (idx: number) => grants.filter(g => g.perm === idx);
  const peopleCount = (idx: number) => new Set(permGrants(idx).filter(live).map(g => g.person.id)).size;
  const rolesOf = (personId: string) =>
    PERMISSIONS.map((p, i) => ({ i, role: p.role })).filter(({ i }) => grants.some(g => g.perm === i && g.person.id === personId && live(g)));

  const removeGrants = (gs: Grant[]) => {
    const fresh = new Set(gs.filter(isNew).map(grantKey));
    if (fresh.size) setGrants(p => p.filter(g => !fresh.has(grantKey(g))));
    const existing = gs.filter(g => !isNew(g)).map(grantKey);
    if (existing.length) setRemoved(p => { const n = new Set(p); existing.forEach(k => n.add(k)); return n; });
  };
  const restoreGrants = (gs: Grant[]) => setRemoved(p => { const n = new Set(p); gs.forEach(g => n.delete(grantKey(g))); return n; });

  const addFromBasket = (items: BasketItem[], clauses: string[]) => {
    const scopes = isClauseMode ? clauses : [undefined];
    const next: Grant[] = [];
    items.forEach(b => b.people.forEach(person => scopes.forEach(clause => {
      const via = b.via.kind === 'direct' ? DIRECT_VIA : b.via;
      next.push({ perm: activeIdx, person, via, clause });
    })));
    // re-adding something marked for removal just un-marks it
    restoreGrants(next);
    setGrants(p => {
      const keys = new Set(p.map(grantKey));
      return [...p, ...next.filter(g => !keys.has(grantKey(g)))];
    });
    setAddOpen(false);
  };

  const added   = grants.filter(g => isNew(g)).length;
  const dirty   = added > 0 || removed.size > 0;
  const tabAdded   = permGrants(activeIdx).filter(isNew).length;
  const tabRemoved = permGrants(activeIdx).filter(g => removed.has(grantKey(g))).length;
  const requestClose = () => { if (dirty) setConfirmClose(true); else onClose(); };

  /* ── permission requests ── */
  const requestVia: Via = { kind: 'request', id: 'request', label: 'בקשת הרשאה' };
  const approveRequests = (ids: string[]) => {
    const toApprove = requests.filter(r => ids.includes(r.id) && r.status === 'pending');
    if (!toApprove.length) return;
    // requests are always for "צפייה לאחר הפצה" (PERMISSIONS[0])
    setGrants(prev => [...prev, ...toApprove.map(r => ({ perm: 0, person: r.user, via: requestVia }))
      .filter(g => !prev.some(x => grantKey(x) === grantKey(g)))]);
    setRequests(prev => prev.map(r => ids.includes(r.id) && r.status === 'pending'
      ? { ...r, status: 'approved', handledBy: 'אני', handledAt: 'עכשיו' } : r));
  };
  const rejectRequests = (ids: string[], why = '') => {
    setRequests(prev => prev.map(r => ids.includes(r.id) && r.status === 'pending'
      ? { ...r, status: 'rejected', handledBy: 'אני', handledAt: 'עכשיו', rejectReason: why.trim() || undefined } : r));
    setRejectingId(null); setRejectText('');
  };
  const undoRequest = (id: string) => {
    const r = requests.find(x => x.id === id);
    if (!r) return;
    if (r.status === 'approved') setGrants(prev => prev.filter(g => !(g.perm === 0 && g.via.kind === 'request' && g.person.id === r.user.id)));
    setRequests(prev => prev.map(x => x.id === id ? { ...x, status: 'pending', handledBy: undefined, handledAt: undefined, rejectReason: undefined } : x));
  };

  /* ── Requests panel (unchanged) ── */
  const renderRequestsPanel = () => {
    const q = reqSearch.trim();
    const inTab = requests.filter(r => reqTab === 'pending' ? r.status === 'pending' : r.status !== 'pending');
    const visible = inTab
      .filter(r => !q || r.user.name.includes(q) || r.user.idNumber.includes(q));
    const handledCount = requests.length - pendingCount;

    return (
      <div className="flex-1 flex flex-col min-w-0" dir="rtl">
        {/* tabs + search */}
        <div className="px-5 pt-1 flex items-end justify-between gap-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex gap-5">
            {([['pending', 'ממתינות לטיפול', pendingCount], ['handled', 'טופלו', handledCount]] as const).map(([val, label, count]) => (
              <button key={val} onClick={() => { setReqTab(val); setRejectingId(null); }}
                className={`pb-2.5 pt-2 text-sm font-semibold relative whitespace-nowrap transition-colors flex items-center gap-1.5 ${reqTab === val ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
                {label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${reqTab === val ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}`}>{count}</span>
                {reqTab === val && <span className="absolute bottom-0 right-0 left-0 h-0.5 rounded-full bg-gray-900" />}
              </button>
            ))}
          </div>
          <div className="relative w-64 mb-2">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input type="text" value={reqSearch} onChange={e => setReqSearch(e.target.value)}
              placeholder="חיפוש מבקש לפי שם או ת.ז..." dir="rtl"
              className="w-full pr-9 pl-3 py-2 border border-gray-200 rounded-xl text-xs text-right focus:outline-none focus:border-[#1B3A6B] bg-white transition-colors" />
          </div>
        </div>

        {/* list */}
        <div className="flex-1 overflow-y-auto px-5 py-3 flex flex-col gap-2.5">
          {visible.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
              <Inbox className="w-10 h-10 text-gray-200 mb-3" />
              <p className="text-sm font-medium text-gray-500">{reqTab === 'pending' ? 'אין בקשות ממתינות' : 'אין בקשות שטופלו'}</p>
              <p className="text-xs text-gray-400 mt-1">
                {q ? 'נסה לשנות את החיפוש' : reqTab === 'pending' ? 'בקשות חדשות שיוגשו דרך ״בקשת הרשאה״ יופיעו כאן' : ''}
              </p>
            </div>
          ) : visible.map(r => {
            const isPending = r.status === 'pending';
            return (
              <div key={r.id}
                className={`rounded-2xl border bg-white transition-colors border-gray-100 hover:border-gray-200`}>
                <div className="flex items-start gap-3 p-3.5">
                  {/* main */}
                  <div className="flex-1 min-w-0">
                    {/* name + role */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-gray-900">{r.user.name}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-md font-medium"
                        style={{ background: '#1B3A6B0d', color: '#1B3A6B' }}>{r.role}</span>
                    </div>
                    {/* id · org · phone */}
                    <div className="flex items-center gap-2 flex-wrap mt-1 text-[11px] text-gray-400">
                      <span className="tabular-nums">ת.ז. {r.user.idNumber}</span>
                      <span className="text-gray-300">·</span>
                      <span>{r.user.environment}</span>
                      {r.user.subLabel && <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-500">{r.user.subLabel}</span>}
                      <span className="text-gray-300">·</span>
                      <span className="flex items-center gap-1 text-gray-500">
                        <Phone className="w-3 h-3" />
                        <span dir="ltr" className="tabular-nums">{r.phone}</span>
                      </span>
                    </div>

                    {/* reason */}
                    <div className="mt-2.5 bg-gray-50 rounded-xl px-3 py-2 border-r-2 border-gray-200">
                      <p className="text-[10px] font-semibold text-gray-400 mb-0.5">סיבת הבקשה</p>
                      <p className="text-xs text-gray-600 leading-relaxed">{r.reason}</p>
                    </div>

                    {/* handled info */}
                    {!isPending && (
                      <div className="mt-2 flex items-center gap-1.5 text-[11px] text-gray-400 flex-wrap">
                        {r.status === 'approved'
                          ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          : <XCircle className="w-3.5 h-3.5 text-red-400" />}
                        <span>{r.status === 'approved' ? 'אושרה' : 'נדחתה'} ע״י {r.handledBy} · {r.handledAt}</span>
                        {r.rejectReason && <span className="text-gray-500">— ״{r.rejectReason}״</span>}
                      </div>
                    )}

                    {/* inline reject form */}
                    {rejectingId === r.id && (
                      <div className="mt-2.5 rounded-xl border border-red-100 bg-red-50/30 p-2.5">
                        <textarea value={rejectText} onChange={e => setRejectText(e.target.value)} autoFocus rows={2}
                          placeholder="סיבת הדחייה (אופציונלי) — תישלח למבקש/ת"
                          className="w-full text-xs px-2.5 py-2 rounded-lg border border-gray-200 bg-white resize-none focus:outline-none focus:border-red-300 text-right" />
                        <div className="flex justify-end gap-2 mt-2">
                          <button onClick={() => { setRejectingId(null); setRejectText(''); }}
                            className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-gray-500 hover:bg-white transition-colors">ביטול</button>
                          <button onClick={() => rejectRequests([r.id], rejectText)}
                            className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors">דחיית הבקשה</button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* side: date + actions */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className="flex items-center gap-1 text-[11px] text-gray-400 whitespace-nowrap">
                      <Clock className="w-3 h-3" />{r.date}
                    </span>
                    {isPending ? (
                      rejectingId !== r.id && (
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => { setRejectingId(r.id); setRejectText(''); }}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-600 hover:bg-red-50/40 transition-colors">
                            דחייה
                          </button>
                          <button onClick={() => approveRequests([r.id])}
                            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white hover:opacity-90 transition-colors disabled:opacity-40 flex items-center gap-1"
                            style={{ background: '#1B3A6B' }}>
                            <Check className="w-3.5 h-3.5" />
                            אישור
                          </button>
                        </div>
                      )
                    ) : (
                      <button onClick={() => undoRequest(r.id)}
                        className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-600 transition-colors">
                        <Undo2 className="w-3 h-3" />
                        החזר לממתינות
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  /* ── list rows ── */
  type Row = { key: string; person: PermUser; clause?: string; grants: Grant[] };
  const q = listQ.trim();
  const tabGrants = permGrants(activeIdx).filter(g => !q || g.person.name.includes(q) || g.person.idNumber.includes(q) || g.via.label.includes(q));
  const toRows = (gs: Grant[]): Row[] => {
    const m = new Map<string, Row>();
    gs.forEach(g => {
      const k = `${g.person.id}|${isClauseMode ? g.clause ?? '' : ''}`;
      const r = m.get(k) ?? { key: k, person: g.person, clause: isClauseMode ? g.clause : undefined, grants: [] };
      r.grants.push(g); m.set(k, r);
    });
    return [...m.values()];
  };

  const RowLine = ({ row, showClause, showVia, indent }: { row: Row; showClause: boolean; showVia: boolean; indent?: boolean }) => {
    const allRemoved = row.grants.every(g => removed.has(grantKey(g)));
    const allNew = row.grants.every(isNew);
    const shown = allRemoved ? row.grants : row.grants.filter(live);
    const vias = [...new Map(shown.map(g => [viaKey(g.via), g.via])).values()];
    const roles = rolesOf(row.person.id);
    const cols = [showClause ? '150px' : null, '1fr', '96px', '76px', showVia ? '170px' : null, '190px', '32px'].filter(Boolean).join(' ');
    const bar = allRemoved ? CHANGE.removed.bar : allNew ? CHANGE.added.bar : null;
    const muted = allRemoved ? 'text-gray-300 line-through decoration-gray-300' : '';
    return (
      <div className="relative grid items-center px-4 py-2.5 hover:bg-gray-50 transition-colors" style={{ gridTemplateColumns: cols, columnGap: 8, borderBottom: '1px solid #f5f5f5' }}>
        {bar && <span className="absolute right-0 top-1.5 bottom-1.5 w-[3px] rounded-l-full" style={{ background: bar }} />}
        {showClause && (
          <span className="min-w-0"><span className="inline-block max-w-full truncate text-[11px] font-semibold text-[#1B3A6B] bg-[#F6F8FC] border border-[#E3E9F4] px-1.5 py-0.5 rounded-md">{clauseLabel(row.clause)}</span></span>
        )}
        <span className={`flex items-center gap-1.5 min-w-0 ${indent ? 'pr-8' : ''}`}>
          <span className={`text-xs font-medium truncate ${allRemoved ? muted : 'text-gray-800'}`}>{row.person.name}</span>
          {allRemoved && <span className="flex-shrink-0 px-1.5 py-px rounded text-[10px] font-medium" style={{ background: CHANGE.removed.bg, color: CHANGE.removed.fg }}>יוסר</span>}
        </span>
        <span className={`text-center text-xs tabular-nums ${allRemoved ? muted : 'text-gray-600'}`}>{row.person.idNumber || '—'}</span>
        <span className={`text-center text-xs truncate ${allRemoved ? muted : 'text-gray-600'}`}>{row.person.environment || '—'}</span>
        {showVia && (
          <span className={`flex items-center gap-1.5 min-w-0 ${allRemoved ? 'opacity-50' : ''}`}>
            <ViaTile kind={vias[0].kind} size={22} />
            <span className="text-[11px] text-gray-600 truncate">{vias[0].label}</span>
            {vias.length > 1 && (
              <span className="flex-shrink-0 text-[10px] font-semibold text-gray-500 bg-gray-100 rounded px-1" title={vias.slice(1).map(v => v.label).join(', ')}>+{vias.length - 1}</span>
            )}
          </span>
        )}
        <span className="flex flex-wrap gap-1 min-w-0">
          {roles.length === 0
            ? <span className="text-[11px] text-gray-300">—</span>
            : roles.map(r => (
              <span key={r.i} className={`text-[10.5px] px-1.5 py-0.5 rounded-full whitespace-nowrap ${r.i === activeIdx ? 'bg-[#EEF4FF] text-[#1B3A6B] font-semibold' : 'bg-gray-100 text-gray-500'}`}>{r.role}</span>
            ))}
        </span>
        {allRemoved ? (
          <button type="button" onClick={() => restoreGrants(row.grants)} title="ביטול הסרה" aria-label="ביטול הסרה"
            className="flex items-center justify-center p-1 rounded text-gray-400 hover:text-[#1B3A6B] transition-colors"><RotateCcw className="w-3.5 h-3.5" /></button>
        ) : (
          <button type="button" onClick={() => removeGrants(row.grants.filter(live))} title="הסרה" aria-label="הסרה"
            className="flex items-center justify-center p-1 rounded text-gray-400 hover:text-[#1B3A6B] transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
        )}
      </div>
    );
  };

  const HeaderRow = ({ showClause, showVia }: { showClause: boolean; showVia: boolean }) => {
    const cols = [showClause ? '150px' : null, '1fr', '96px', '76px', showVia ? '170px' : null, '190px', '32px'].filter(Boolean).join(' ');
    return (
      <div className="sticky top-0 z-10 grid items-center px-4 py-2 text-[10px] font-semibold text-gray-500 select-none" style={{ background: '#EBEBEB', gridTemplateColumns: cols, columnGap: 8 }}>
        {showClause && <span>סעיף</span>}
        <span>שם</span><span className="text-center">תעודת זהות</span><span className="text-center">ארגון</span>
        {showVia && <span>מקור</span>}
        <span>הרשאות במסמך</span><span />
      </div>
    );
  };

  const GroupHeader = ({ id, title, tile, count, gs, removable }: { id: string; title: string; tile?: ReactNode; count: number; gs: Grant[]; removable: boolean }) => {
    const open = !collapsed.has(id);
    const allRemoved = gs.length > 0 && gs.every(g => removed.has(grantKey(g)));
    const allNew = gs.length > 0 && gs.every(isNew);
    const bar = allRemoved ? CHANGE.removed.bar : allNew ? CHANGE.added.bar : null;
    return (
      <div className="relative flex items-center gap-2 px-4 py-2.5 bg-[#F7F9FC] border-b border-gray-100 cursor-pointer select-none"
        onClick={() => setCollapsed(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; })}>
        {bar && <span className="absolute right-0 top-1.5 bottom-1.5 w-[3px] rounded-l-full" style={{ background: bar }} />}
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${open ? '' : 'rotate-90'}`} />
        {tile}
        <span className={`text-xs font-semibold ${allRemoved ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{title}</span>
        <span className="text-[11px] text-gray-500">· {count} אנשים</span>
        <span className="flex-1" />
        {removable && (allRemoved ? (
          <button type="button" onClick={e => { e.stopPropagation(); restoreGrants(gs); }} title="ביטול הסרה" aria-label="ביטול הסרה"
            className="p-1 rounded text-gray-400 hover:text-[#1B3A6B] transition-colors"><RotateCcw className="w-3.5 h-3.5" /></button>
        ) : (
          <button type="button" onClick={e => { e.stopPropagation(); removeGrants(gs.filter(live)); }} title="הסרת כל הקבוצה" aria-label="הסרת כל הקבוצה"
            className="p-1 rounded text-gray-400 hover:text-[#1B3A6B] transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
        ))}
      </div>
    );
  };

  const renderList = () => {
    if (tabGrants.length === 0) {
      const P = PERMISSIONS[activeIdx];
      return (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <P.Icon className="w-10 h-10 text-gray-200 mb-3" />
          <p className="text-sm text-gray-500">{q ? 'לא נמצאו תוצאות' : `עדיין אין הרשאות ${P.label}`}</p>
          {!q && <p className="text-xs text-gray-400 mt-1">לחץ על ״הוספה״ כדי להוסיף אנשים, קבוצות או רשימות</p>}
        </div>
      );
    }
    if (view === 'flat') {
      return (
        <div className="flex-1 overflow-y-auto">
          <HeaderRow showClause={isClauseMode} showVia />
          {toRows(tabGrants)
            .sort((a, b) => isClauseMode ? PERM_CLAUSES.findIndex(c => c.id === a.clause) - PERM_CLAUSES.findIndex(c => c.id === b.clause) : 0)
            .map(r => <RowLine key={r.key} row={r} showClause={isClauseMode} showVia />)}
        </div>
      );
    }
    if (view === 'source') {
      const groups = new Map<string, { via: Via; gs: Grant[] }>();
      tabGrants.forEach(g => { const k = viaKey(g.via); const e = groups.get(k) ?? { via: g.via, gs: [] }; e.gs.push(g); groups.set(k, e); });
      const order: ViaKind[] = ['direct', 'request', 'miraz', 'hamal', 'list', 'doc', 'excel'];
      return (
        <div className="flex-1 overflow-y-auto">
          <HeaderRow showClause={isClauseMode} showVia={false} />
          {[...groups.entries()].sort((a, b) => order.indexOf(a[1].via.kind) - order.indexOf(b[1].via.kind)).map(([k, { via, gs }]) => (
            <div key={k}>
              <GroupHeader id={`src-${k}`} title={via.kind === 'direct' ? 'ישיר (נוסף ידנית)' : via.label} tile={<ViaTile kind={via.kind} size={22} />}
                count={new Set(gs.map(g => g.person.id)).size} gs={gs} removable={via.kind !== 'direct'} />
              {!collapsed.has(`src-${k}`) && toRows(gs).map(r => <RowLine key={r.key} row={r} showClause={isClauseMode} showVia={false} indent />)}
            </div>
          ))}
        </div>
      );
    }
    // by clause
    const byClause = PERM_CLAUSES.map(c => ({ c, gs: tabGrants.filter(g => g.clause === c.id) })).filter(x => x.gs.length);
    return (
      <div className="flex-1 overflow-y-auto">
        <HeaderRow showClause={false} showVia />
        {byClause.map(({ c, gs }) => (
          <div key={c.id}>
            <GroupHeader id={`cl-${c.id}`} title={c.label} count={new Set(gs.map(g => g.person.id)).size} gs={gs} removable />
            {!collapsed.has(`cl-${c.id}`) && toRows(gs).map(r => <RowLine key={r.key} row={r} showClause={false} showVia indent />)}
          </div>
        ))}
      </div>
    );
  };

  const P = PERMISSIONS[activeIdx] ?? PERMISSIONS[0];
  const views: { key: 'flat' | 'source' | 'clause'; label: string; Icon: LucideIcon }[] = [
    { key: 'flat',   label: 'כל האנשים', Icon: List },
    { key: 'source', label: 'לפי מקור',  Icon: Layers },
    ...(isClauseMode ? [{ key: 'clause' as const, label: 'לפי סעיף', Icon: FileText }] : []),
  ];
  const curPeople = peopleCount(activeIdx);
  const curClauses = new Set(permGrants(activeIdx).filter(live).map(g => g.clause)).size;

  return (<>
    <div className="fixed inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 99999 }}
      onClick={requestClose}>
      <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col" dir="rtl"
        style={{ width: 1200, height: 640, maxWidth: '96vw', maxHeight: '92vh' }}
        onClick={e => e.stopPropagation()}>
        {/* header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-sm font-semibold text-gray-900">הרשאות מסמך</h2>
          <button onClick={requestClose} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors" aria-label="סגירה">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* rail: icon + label + count */}
          <nav className="w-[96px] flex-shrink-0 border-l border-gray-100 bg-gray-50/60 flex flex-col gap-0.5 p-1.5 overflow-y-auto">
            {PERMISSIONS.map((perm, i) => {
              const active = i === activeIdx;
              const n = peopleCount(i);
              return (
                <button key={i} type="button" onClick={() => { setActiveIdx(i); setListQ(''); }} title={perm.label}
                  className={`flex flex-col items-center gap-1 px-1 py-2.5 rounded-xl transition-colors ${active ? 'bg-white shadow-sm' : 'hover:bg-white/70'}`}>
                  <span className={`relative w-8 h-8 rounded-[10px] flex items-center justify-center ${active ? 'bg-[#EEF4FF] text-[#1B3A6B]' : 'text-gray-400'}`}>
                    <perm.Icon className="w-4 h-4" />
                    <span className={`absolute -top-1.5 -left-2 min-w-[16px] h-4 px-1 rounded-full text-[9.5px] font-bold flex items-center justify-center ${active ? 'bg-[#1B3A6B] text-white' : 'bg-gray-200 text-gray-600'}`}>{n}</span>
                  </span>
                  <span className={`text-[10.5px] leading-tight text-center ${active ? 'font-bold text-gray-900' : 'font-medium text-gray-500'}`}>{perm.short}</span>
                </button>
              );
            })}
            <div className="h-px bg-gray-200 mx-3 my-1" />
            <button type="button" onClick={() => setActiveIdx(REQUESTS_IDX)}
              className={`flex flex-col items-center gap-1 px-1 py-2.5 rounded-xl transition-colors ${isRequests ? 'bg-white shadow-sm' : 'hover:bg-white/70'}`}>
              <span className={`relative w-8 h-8 rounded-[10px] flex items-center justify-center ${isRequests ? 'bg-[#EEF4FF] text-[#1B3A6B]' : 'text-gray-400'}`}>
                <Inbox className="w-4 h-4" />
                {pendingCount > 0 && <span className="absolute -top-1.5 -left-2 min-w-[16px] h-4 px-1 rounded-full text-[9.5px] font-bold flex items-center justify-center bg-[#1B3A6B] text-white">{pendingCount}</span>}
              </span>
              <span className={`text-[10.5px] leading-tight text-center ${isRequests ? 'font-bold text-gray-900' : 'font-medium text-gray-500'}`}>בקשות הרשאה</span>
            </button>
          </nav>

          {isRequests ? renderRequestsPanel() : (
            <div className="flex-1 flex flex-col min-w-0">
              {/* list header */}
              <div className="flex items-center justify-between gap-4 px-5 py-3 border-b border-gray-100 bg-gray-50/50 flex-shrink-0">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    {P.label} <span className="font-normal text-gray-500">({curPeople} אנשים{isClauseMode ? ` · ${curClauses} סעיפים` : ''})</span>
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5 truncate">{P.desc}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="inline-flex bg-gray-100 rounded-[10px] p-[3px] gap-0.5">
                    {views.map(v => (
                      <button key={v.key} type="button" onClick={() => setView(v.key)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${view === v.key ? 'bg-white text-[#1B3A6B] font-semibold shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                        <v.Icon className="w-3 h-3" />{v.label}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                    <input type="text" value={listQ} onChange={e => setListQ(e.target.value)} placeholder="חיפוש..." dir="rtl"
                      className="w-40 pr-8 pl-2 py-1.5 border border-gray-200 rounded-xl text-xs text-right focus:outline-none focus:border-[#1B3A6B] bg-white transition-colors" />
                  </div>
                  <div className="relative">
                    <button type="button" title="ייצוא" aria-label="ייצוא" onClick={() => setExportMenuOpen(o => !o)}
                      className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"><Download className="w-4 h-4" /></button>
                    {exportMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-30" onClick={() => setExportMenuOpen(false)} />
                        <div className="absolute top-full left-0 mt-1 z-40 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden min-w-[130px]">
                          <button type="button" onClick={() => setExportMenuOpen(false)} className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-gray-50 transition-colors text-right">
                            <FileEdit className="w-3.5 h-3.5 text-[#2B579A] flex-shrink-0" /><span className="text-xs font-medium text-gray-700">ייצוא ל-Word</span>
                          </button>
                          <div className="h-px bg-gray-100 mx-2" />
                          <button type="button" onClick={() => setExportMenuOpen(false)} className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-gray-50 transition-colors text-right">
                            <FileText className="w-3.5 h-3.5 text-[#1D6F42] flex-shrink-0" /><span className="text-xs font-medium text-gray-700">ייצוא ל-Excel</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                  <button type="button" onClick={() => setAddOpen(true)}
                    className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#1B3A6B] text-white hover:bg-[#152e54] transition-colors">
                    <Plus className="w-3.5 h-3.5" />הוספה
                  </button>
                </div>
              </div>
              {(tabAdded > 0 || tabRemoved > 0) && (
                <div className="flex items-center gap-1.5 px-5 py-2 border-b border-gray-100 text-[11px] text-gray-500 flex-shrink-0">
                  שינויים שלא נשמרו:
                  {tabAdded > 0 && <span className="px-1.5 py-0.5 rounded-md font-semibold" style={{ background: CHANGE.added.bg, color: CHANGE.added.fg }}>{tabAdded} נוספו</span>}
                  {tabRemoved > 0 && <span className="px-1.5 py-0.5 rounded-md font-semibold" style={{ background: CHANGE.removed.bg, color: CHANGE.removed.fg }}>{tabRemoved} יוסרו</span>}
                </div>
              )}
              {renderList()}
            </div>
          )}
        </div>

        {/* footer */}
        <div className="border-t border-gray-100 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <button onClick={requestClose} className="px-2 py-2 rounded-xl text-sm text-gray-400 hover:text-gray-600 transition-colors">ביטול</button>
          <div className="flex items-center gap-3">
            {dirty && <span className="flex items-center gap-1.5 text-xs text-amber-700"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" />שינויים שלא נשמרו</span>}
            <button onClick={onClose} className="px-6 py-2 rounded-xl text-sm font-semibold text-white transition-colors hover:opacity-90" style={{ background: '#1B3A6B' }}>
              אישור
            </button>
          </div>
        </div>

        {addOpen && !isRequests && (
          <AddPermissionsDialog
            permLabel={P.label}
            clauseMode={isClauseMode}
            isGranted={id => permGrants(activeIdx).some(g => g.person.id === id && live(g))}
            onAdd={addFromBasket}
            onClose={() => setAddOpen(false)}
          />
        )}

        {confirmClose && (
          <div className="absolute inset-0 bg-gray-900/30 flex items-center justify-center z-[60]">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-[360px] flex flex-col gap-3">
              <p className="font-bold text-gray-900">לצאת בלי לשמור?</p>
              <p className="text-sm text-gray-500 leading-relaxed">יש שינויים בהרשאות שעדיין לא נשמרו. אם תצא עכשיו, הם לא יישמרו.</p>
              <div className="flex items-center justify-between mt-2">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">יציאה בלי שמירה</button>
                <button type="button" onClick={() => setConfirmClose(false)} className="px-4 py-2 bg-[#1B3A6B] text-white rounded-xl text-sm font-medium hover:bg-[#152e54] transition-colors">חזרה לעריכה</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </>);
}
