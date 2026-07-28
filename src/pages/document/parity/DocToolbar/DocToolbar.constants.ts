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
}

// main declares these one <TB> at a time (Edit.tsx:1221-1381). As data they render
// from one `.map()` per group, which is also what makes the exclusivity table below
// possible to state as ids rather than as branches in a handler.
export const TEXT_FORMAT_TOGGLES: ToolbarToggle[] = [
  { id: 'bold', title: 'מודגש (Ctrl+B)', Icon: Bold },
  { id: 'italic', title: 'נטוי (Ctrl+I)', Icon: Italic },
  { id: 'underline', title: 'קו תחתון (Ctrl+U)', Icon: Underline },
  { id: 'strikethrough', title: 'קו חוצה', Icon: Strikethrough },
];

export const LIST_TOGGLES: ToolbarToggle[] = [
  { id: 'list-ordered', title: 'רשימה ממוספרת (1 2 3)', Icon: ListOrdered },
  { id: 'list-unordered', title: 'רשימת תבליטים', Icon: List },
];

export const ALIGN_TOGGLES: ToolbarToggle[] = [
  { id: 'align-right', title: 'יישור לימין', Icon: AlignRight },
  { id: 'align-center', title: 'מרכוז', Icon: AlignCenter },
  { id: 'align-left', title: 'יישור לשמאל', Icon: AlignLeft },
  { id: 'align-justify', title: 'יישור לשני הצדדים', Icon: AlignJustify },
];

// Not in EXCLUSIVE_GROUPS, so both can be lit at once — main's behaviour
// (Edit.tsx:1191-1194 lists only alignment and lists), preserved verbatim.
export const DIRECTION_TOGGLES: ToolbarToggle[] = [
  { id: 'dir-rtl', title: 'כיוון טקסט מימין לשמאל', Icon: PilcrowRight },
  { id: 'dir-ltr', title: 'כיוון טקסט משמאל לימין', Icon: PilcrowLeft },
];

// Sets where turning one on turns the others off, because the underlying CSS
// property holds one value.
export const EXCLUSIVE_GROUPS: string[][] = [
  ALIGN_TOGGLES.map((toggle) => toggle.id),
  LIST_TOGGLES.map((toggle) => toggle.id),
];

export const TOOLBAR_ICON_SIZE = 14;

// The two palettes and the hue ramp are the only literal hex in this feature, and
// deliberately so: a swatch's colour *is* the value the button applies, not chrome
// that should follow the theme. Themed tokens here would make the picker offer a
// different colour in dark mode than the one it writes into the document.
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

// White needs an outline on a white toolbar, or the swatch reads as an empty slot.
export const WHITE = '#ffffff';
