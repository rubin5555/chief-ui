import { FileSpreadsheet, FileText, Layers, List, Network, Users } from 'lucide-react';
import type { ComponentType } from 'react';
import { excelColors } from '@/styles/theme';

// The shapes and the source list every people picker works in, whether it is
// filling a mailing list or handing out a permission on a document.

export type ImportTabId = 'network' | 'doc' | 'hamal' | 'mirage' | 'personal' | 'excel';
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
  compact?: boolean;
  idleIconColor?: string;
  /**
   * Whether this tab puts a search box in the shared row above the content.
   * Excel doesn't — there is nothing to search in a file you haven't handed
   * over yet — so the row is hidden for it rather than left standing empty.
   */
  hasSearch?: boolean;
}> = [
  { id: 'network', label: 'הוסף מרשתות', Icon: Network },
  { id: 'doc', label: 'ממסמך קיים', Icon: FileText },
  { id: 'hamal', label: 'קבוצות חמ"ל', Icon: Users },
  { id: 'mirage', label: "קבוצות מיראז'", Icon: Layers },
  { id: 'personal', label: 'אזור אישי', Icon: List },
  // Last, compact and green (main's TopNavbar.tsx:471). It is the odd one out on
  // purpose: the five above are directories of people the organisation already
  // holds, this one is a file the user brings — so it keeps Excel's own colour
  // and takes only the width its short label needs, rather than a fifth of the row.
  {
    id: 'excel',
    label: 'Excel',
    Icon: FileSpreadsheet,
    compact: true,
    idleIconColor: excelColors.green,
    hasSearch: false,
  },
];

export const NETWORK_FILTERS: Array<{ value: NetworkFilter; label: string }> = [
  { value: 'sodibioti', label: 'סודי ביותר' },
  { value: 'sodi', label: 'סודי' },
  { value: 'aman', label: 'אמ"ן' },
];

export const DOC_GRID = '28px 1fr 64px 58px 58px 80px 80px 58px 24px';
export const MEMBERS_GRID = '28px 1fr 80px 80px 32px';
export const SUB_MEMBER_GRID = '28px 1fr 64px 80px 32px';
export const MEMBER_EXPAND_GRID = '28px 1fr 64px 80px';
