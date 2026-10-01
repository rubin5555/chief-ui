import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  List,
  ListOrdered,
  type LucideIcon,
  PilcrowLeft,
  PilcrowRight,
  Strikethrough,
  Underline,
} from 'lucide-react';

export interface ToolbarToggle {
  id: string;
  title: string;
  Icon: LucideIcon;
  command: string;
  dir?: 'rtl' | 'ltr';
}

export const TEXT_FORMAT_TOGGLES: ToolbarToggle[] = [
  { id: 'bold', title: 'מודגש (Ctrl+B)', Icon: Bold, command: 'Bold' },
  { id: 'italic', title: 'נטוי (Ctrl+I)', Icon: Italic, command: 'Italic' },
  { id: 'underline', title: 'קו תחתון (Ctrl+U)', Icon: Underline, command: 'Underline' },
  { id: 'strikethrough', title: 'קו חוצה', Icon: Strikethrough, command: 'Strikethrough' },
];

export const LIST_TOGGLES: ToolbarToggle[] = [
  {
    id: 'list-ordered',
    title: 'רשימה ממוספרת (1 2 3)',
    Icon: ListOrdered,
    command: 'InsertOrderedList',
  },
  { id: 'list-unordered', title: 'רשימת תבליטים', Icon: List, command: 'InsertUnorderedList' },
];

export const ALIGN_TOGGLES: ToolbarToggle[] = [
  { id: 'align-right', title: 'יישור לימין', Icon: AlignRight, command: 'JustifyRight' },
  { id: 'align-center', title: 'מרכוז', Icon: AlignCenter, command: 'JustifyCenter' },
  { id: 'align-left', title: 'יישור לשמאל', Icon: AlignLeft, command: 'JustifyLeft' },
  { id: 'align-justify', title: 'יישור לשני הצדדים', Icon: AlignJustify, command: 'JustifyFull' },
];

export const DIRECTION_TOGGLES: ToolbarToggle[] = [
  {
    id: 'dir-rtl',
    title: 'כיוון טקסט מימין לשמאל',
    Icon: PilcrowRight,
    command: 'mceDirectionRTL',
    dir: 'rtl',
  },
  {
    id: 'dir-ltr',
    title: 'כיוון טקסט משמאל לימין',
    Icon: PilcrowLeft,
    command: 'mceDirectionLTR',
    dir: 'ltr',
  },
];

export const ALL_TOGGLES: ToolbarToggle[] = [
  ...TEXT_FORMAT_TOGGLES,
  ...LIST_TOGGLES,
  ...ALIGN_TOGGLES,
  ...DIRECTION_TOGGLES,
];

export const TOOLBAR_ICON_SIZE = 14;

export const RIBBON_MARKER_ATTR = 'data-editor-ribbon';

export const TEXT_COLORS = [
  '#000000',
  '#374151',
  '#dc2626',
  '#f97316',
  '#f59e0b',
  '#16a34a',
  '#2563eb',
  '#1B3A6B',
  '#7c3aed',
  '#db2777',
  '#6b7280',
  '#ffffff',
];

export const HIGHLIGHT_COLORS = [
  '#fde047',
  '#86efac',
  '#fdba74',
  '#f9a8d4',
  '#93c5fd',
  '#c4b5fd',
  '#6ee7b7',
  '#fca5a5',
  '#e5e7eb',
  '#fef08a',
  '#bfdbfe',
  '#ffffff',
];

export const DEFAULT_TEXT_COLOR = '#000000';
export const DEFAULT_HIGHLIGHT_COLOR = '#fde047';
export const DEFAULT_FILL_COLOR = '#ffffff';

export const WHITE = '#ffffff';
