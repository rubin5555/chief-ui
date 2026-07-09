import { FileText, Layers, List, Network, Users } from 'lucide-react';
import type { ComponentType } from 'react';

export type ImportTabId = 'network' | 'doc' | 'hamal' | 'mirage' | 'personal';
export type NetworkFilter = 'sodibioti' | 'sodi' | 'aman';

export interface PersonMember {
  name: string;
  idNumber: string;
  environment: string;
}

export interface Member {
  id: string;
  name: string;
  idNumber: string;
  environment: string;
  subLabel?: string;
  isGroup?: boolean;
  groupType?: string;
  groupMembers?: PersonMember[];
}

export interface DocItem {
  id: string;
  name: string;
  cmdNum: string;
  update: string;
  environment: string;
  docType: string;
  lastUpdate: string;
  refNum: string;
  status: string;
  distribution: PersonMember[];
}

export interface HamalGroup {
  id: string;
  name: string;
  type: string;
  environment: string;
  memberCount: number;
  members: PersonMember[];
}

export interface MirageGroup {
  id: string;
  name: string;
  type: string;
  environment: string;
  members: PersonMember[];
}

export interface PersonalList {
  id: string;
  name: string;
  tab: 'mine' | 'all';
  lastUpdate: string;
  members: PersonMember[];
}

export interface NetworkPerson {
  id: string;
  name: string;
  idNumber: string;
  environment: string;
  network: NetworkFilter;
  networkLabel: string;
}

export const IMPORT_TABS: Array<{
  id: ImportTabId;
  label: string;
  Icon: ComponentType<{ className?: string }>;
}> = [
  { id: 'network', label: 'הוסף מרשתות', Icon: Network },
  { id: 'doc', label: 'ממסמך קיים', Icon: FileText },
  { id: 'hamal', label: 'קבוצות חמ"ל', Icon: Users },
  { id: 'mirage', label: "קבוצות מיראז'", Icon: Layers },
  { id: 'personal', label: 'אזור אישי', Icon: List },
];

export const NETWORK_FILTERS: Array<{ value: NetworkFilter; label: string }> = [
  { value: 'sodibioti', label: 'סודי ביותר' },
  { value: 'sodi', label: 'סודי' },
  { value: 'aman', label: 'אמ"ן' },
];

export const AGAF_OPTIONS = ['מחלקת משאבי אנוש', 'מחלקת כספים', 'מחלקת טכנולוגיה', 'מחלקת תפעול'];

export const PEOPLE_POOL: NetworkPerson[] = [
  {
    id: 'p1',
    name: 'אבי כהן',
    idNumber: '012345678',
    environment: 'ארגון א׳',
    network: 'sodibioti',
    networkLabel: 'סודי ביותר',
  },
  {
    id: 'p2',
    name: 'שרה לוי',
    idNumber: '023456789',
    environment: 'ארגון ב׳',
    network: 'sodibioti',
    networkLabel: 'סודי ביותר',
  },
  {
    id: 'p3',
    name: 'משה ישראלי',
    idNumber: '034567890',
    environment: 'ארגון א׳',
    network: 'sodibioti',
    networkLabel: 'סודי ביותר',
  },
  {
    id: 'p4',
    name: 'רחל דוד',
    idNumber: '045678901',
    environment: 'ארגון ג׳',
    network: 'sodibioti',
    networkLabel: 'סודי ביותר',
  },
  {
    id: 'p5',
    name: 'יוסף מזרחי',
    idNumber: '056789012',
    environment: 'ארגון ב׳',
    network: 'sodibioti',
    networkLabel: 'סודי ביותר',
  },
  {
    id: 'p6',
    name: 'מירי פרץ',
    idNumber: '067890123',
    environment: 'ארגון א׳',
    network: 'sodibioti',
    networkLabel: 'סודי ביותר',
  },
  {
    id: 'p7',
    name: 'דני אברהם',
    idNumber: '078901234',
    environment: 'ארגון ד׳',
    network: 'sodibioti',
    networkLabel: 'סודי ביותר',
  },
  {
    id: 'p8',
    name: 'לאה כץ',
    idNumber: '089012345',
    environment: 'ארגון ב׳',
    network: 'sodibioti',
    networkLabel: 'סודי ביותר',
  },
  {
    id: 'p9',
    name: 'אורן שמש',
    idNumber: '090123456',
    environment: 'ארגון א׳',
    network: 'sodi',
    networkLabel: 'מערכת סודי',
  },
  {
    id: 'p10',
    name: 'נועה גרין',
    idNumber: '101234567',
    environment: 'ארגון ג׳',
    network: 'sodi',
    networkLabel: 'מערכת סודי',
  },
  {
    id: 'p11',
    name: 'יעקב בן-דוד',
    idNumber: '112345678',
    environment: 'ארגון א׳',
    network: 'sodi',
    networkLabel: 'מערכת סודי',
  },
  {
    id: 'p12',
    name: 'תמר ברק',
    idNumber: '123456789',
    environment: 'ארגון ב׳',
    network: 'sodi',
    networkLabel: 'מערכת סודי',
  },
  {
    id: 'p13',
    name: 'עמי שלו',
    idNumber: '134567890',
    environment: 'ארגון ד׳',
    network: 'aman',
    networkLabel: 'אמ"ן',
  },
  {
    id: 'p14',
    name: 'ריקי נחום',
    idNumber: '145678901',
    environment: 'ארגון א׳',
    network: 'aman',
    networkLabel: 'אמ"ן',
  },
  {
    id: 'p15',
    name: 'גיל אלון',
    idNumber: '156789012',
    environment: 'ארגון ג׳',
    network: 'aman',
    networkLabel: 'אמ"ן',
  },
];

export const LIST_DOCS: DocItem[] = [
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
];

export const HAMAL_GROUPS: HamalGroup[] = [
  {
    id: 'h1',
    name: 'חמל ביטחון שטח',
    type: 'ביטחוני',
    environment: 'ארגון א׳',
    memberCount: 12,
    members: [
      { name: 'אבי כהן', idNumber: '012345678', environment: 'ארגון א׳' },
      { name: 'שרה לוי', idNumber: '023456789', environment: 'ארגון ב׳' },
      { name: 'מירי פרץ', idNumber: '067890123', environment: 'ארגון א׳' },
      { name: 'יעקב בן-דוד', idNumber: '112345678', environment: 'ארגון א׳' },
    ],
  },
  {
    id: 'h2',
    name: 'חמל לוגיסטי',
    type: 'לוגיסטי',
    environment: 'ארגון ב׳',
    memberCount: 8,
    members: [
      { name: 'משה ישראלי', idNumber: '034567890', environment: 'ארגון א׳' },
      { name: 'לאה כץ', idNumber: '089012345', environment: 'ארגון ב׳' },
      { name: 'יוסף מזרחי', idNumber: '056789012', environment: 'ארגון ב׳' },
    ],
  },
  {
    id: 'h3',
    name: 'חמל מודיעין',
    type: 'מודיעיני',
    environment: 'ארגון א׳',
    memberCount: 6,
    members: [
      { name: 'אורן שמש', idNumber: '090123456', environment: 'ארגון א׳' },
      { name: 'נועה גרין', idNumber: '101234567', environment: 'ארגון ג׳' },
    ],
  },
  {
    id: 'h4',
    name: 'חמל תקשורת',
    type: 'תקשורתי',
    environment: 'ארגון ג׳',
    memberCount: 5,
    members: [
      { name: 'ריקי נחום', idNumber: '145678901', environment: 'ארגון א׳' },
      { name: 'תמר ברק', idNumber: '123456789', environment: 'ארגון ב׳' },
    ],
  },
  {
    id: 'h5',
    name: 'חמל רפואי',
    type: 'רפואי',
    environment: 'ארגון ב׳',
    memberCount: 9,
    members: [
      { name: 'גיל אלון', idNumber: '156789012', environment: 'ארגון ג׳' },
      { name: 'דני אברהם', idNumber: '078901234', environment: 'ארגון ד׳' },
      { name: 'עמי שלו', idNumber: '134567890', environment: 'ארגון ד׳' },
      { name: 'רחל דוד', idNumber: '045678901', environment: 'ארגון ג׳' },
    ],
  },
];

export const MIRAGE_GROUPS: MirageGroup[] = [
  {
    id: 'm1',
    name: "מיראז' קרבי",
    type: 'קרבי',
    environment: 'ארגון א׳',
    members: [
      { name: 'אבי כהן', idNumber: '012345678', environment: 'ארגון א׳' },
      { name: 'מירי פרץ', idNumber: '067890123', environment: 'ארגון א׳' },
      { name: 'יעקב בן-דוד', idNumber: '112345678', environment: 'ארגון א׳' },
    ],
  },
  {
    id: 'm2',
    name: "מיראז' סייבר",
    type: 'סייבר',
    environment: 'ארגון ב׳',
    members: [
      { name: 'שרה לוי', idNumber: '023456789', environment: 'ארגון ב׳' },
      { name: 'תמר ברק', idNumber: '123456789', environment: 'ארגון ב׳' },
      { name: 'נועה גרין', idNumber: '101234567', environment: 'ארגון ג׳' },
    ],
  },
  {
    id: 'm3',
    name: "מיראז' מודיעין",
    type: 'מודיעיני',
    environment: 'ארגון א׳',
    members: [
      { name: 'אורן שמש', idNumber: '090123456', environment: 'ארגון א׳' },
      { name: 'ריקי נחום', idNumber: '145678901', environment: 'ארגון א׳' },
    ],
  },
  {
    id: 'm4',
    name: "מיראז' לוגיסטי",
    type: 'לוגיסטי',
    environment: 'ארגון ג׳',
    members: [
      { name: 'משה ישראלי', idNumber: '034567890', environment: 'ארגון א׳' },
      { name: 'יוסף מזרחי', idNumber: '056789012', environment: 'ארגון ב׳' },
      { name: 'לאה כץ', idNumber: '089012345', environment: 'ארגון ב׳' },
    ],
  },
  {
    id: 'm5',
    name: "מיראז' רפואי",
    type: 'רפואי',
    environment: 'ארגון ב׳',
    members: [
      { name: 'גיל אלון', idNumber: '156789012', environment: 'ארגון ג׳' },
      { name: 'עמי שלו', idNumber: '134567890', environment: 'ארגון ד׳' },
      { name: 'דני אברהם', idNumber: '078901234', environment: 'ארגון ד׳' },
      { name: 'רחל דוד', idNumber: '045678901', environment: 'ארגון ג׳' },
    ],
  },
];

export const PERSONAL_LISTS: PersonalList[] = [
  {
    id: 'pl1',
    name: 'רשימת הפצה — מטה מבצעי',
    tab: 'mine',
    lastUpdate: '12.06.2026',
    members: [
      { name: 'אבי כהן', idNumber: '012345678', environment: 'ארגון א׳' },
      { name: 'שרה לוי', idNumber: '023456789', environment: 'ארגון ב׳' },
      { name: 'מירי פרץ', idNumber: '067890123', environment: 'ארגון א׳' },
    ],
  },
  {
    id: 'pl2',
    name: 'רשימת הפצה — לוגיסטיקה',
    tab: 'mine',
    lastUpdate: '08.06.2026',
    members: [
      { name: 'משה ישראלי', idNumber: '034567890', environment: 'ארגון א׳' },
      { name: 'לאה כץ', idNumber: '089012345', environment: 'ארגון ב׳' },
      { name: 'יוסף מזרחי', idNumber: '056789012', environment: 'ארגון ב׳' },
      { name: 'דני אברהם', idNumber: '078901234', environment: 'ארגון ד׳' },
    ],
  },
  {
    id: 'pl3',
    name: 'צוות מודיעין — רשימה א׳',
    tab: 'mine',
    lastUpdate: '01.06.2026',
    members: [
      { name: 'אורן שמש', idNumber: '090123456', environment: 'ארגון א׳' },
      { name: 'נועה גרין', idNumber: '101234567', environment: 'ארגון ג׳' },
    ],
  },
  {
    id: 'pl4',
    name: 'כלל קציני הקשר',
    tab: 'all',
    lastUpdate: '15.06.2026',
    members: [
      { name: 'יעקב בן-דוד', idNumber: '112345678', environment: 'ארגון א׳' },
      { name: 'תמר ברק', idNumber: '123456789', environment: 'ארגון ב׳' },
      { name: 'עמי שלו', idNumber: '134567890', environment: 'ארגון ד׳' },
    ],
  },
  {
    id: 'pl5',
    name: 'רשימת כוננות — מחלקת ביטחון',
    tab: 'all',
    lastUpdate: '10.06.2026',
    members: [
      { name: 'ריקי נחום', idNumber: '145678901', environment: 'ארגון א׳' },
      { name: 'גיל אלון', idNumber: '156789012', environment: 'ארגון ג׳' },
      { name: 'רחל דוד', idNumber: '045678901', environment: 'ארגון ג׳' },
    ],
  },
  {
    id: 'pl6',
    name: 'מכלול תקשורת — פיקוד עורף',
    tab: 'all',
    lastUpdate: '05.06.2026',
    members: [
      { name: 'אבי כהן', idNumber: '012345678', environment: 'ארגון א׳' },
      { name: 'משה ישראלי', idNumber: '034567890', environment: 'ארגון א׳' },
    ],
  },
];

export const DOC_GRID = '28px 1fr 64px 58px 58px 80px 80px 58px 24px';
export const MEMBERS_GRID = '28px 1fr 80px 80px 32px';
export const SUB_MEMBER_GRID = '28px 1fr 64px 80px 32px';
export const MEMBER_EXPAND_GRID = '28px 1fr 64px 80px';
