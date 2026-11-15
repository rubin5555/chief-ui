import { FileSpreadsheet, FileText, Layers, List, Network, Users } from 'lucide-react';
import type { ComponentType } from 'react';
import { excelColors } from '@/styles/theme';

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
  hasSearch?: boolean;
}> = [
  { id: 'network', label: 'הוסף מרשתות', Icon: Network },
  { id: 'doc', label: 'ממסמך קיים', Icon: FileText },
  { id: 'hamal', label: 'קבוצות חמ"ל', Icon: Users },
  { id: 'mirage', label: "קבוצות מיראז'", Icon: Layers },
  { id: 'personal', label: 'אזור אישי', Icon: List },

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
