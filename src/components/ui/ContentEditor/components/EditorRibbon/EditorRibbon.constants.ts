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
  /**
   * The TinyMCE command the button runs. Unless `dir` says otherwise, the same
   * command's `queryCommandState` is what lights the button — so which buttons are
   * on is read off the caret rather than remembered, and typing into text someone
   * else made bold lights `bold` without anyone having pressed it.
   */
  command: string;
  /**
   * Direction is the one pair TinyMCE won't answer `queryCommandState` for. Its
   * own buttons read the containing block's `direction`/`dir` instead
   * (plugins/directionality), and so does readRibbonState.
   */
  dir?: 'rtl' | 'ltr';
}

// main declares these one <TB> at a time (Edit.tsx:1221-1381). As data they render
// from one `.map()` per group, and each carries the command that makes it real.
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

/**
 * Every toggle in the ribbon, in one list, because reading the caret's state is a
 * single pass over all of them and doesn't care which group a button is drawn in.
 *
 * There is no exclusivity table any more. main kept one — pressing an alignment
 * had to turn the other three off by hand — because its buttons were the only
 * record of what was set. Here the document is that record: after
 * `JustifyCenter`, `JustifyRight` reports false because the paragraph really is
 * centred.
 */
export const ALL_TOGGLES: ToolbarToggle[] = [
  ...TEXT_FORMAT_TOGGLES,
  ...LIST_TOGGLES,
  ...ALIGN_TOGGLES,
  ...DIRECTION_TOGGLES,
];

export const TOOLBAR_ICON_SIZE = 14;

/**
 * Marks the ribbon and everything it opens as still being "inside the editor",
 * even though its panels are portalled onto `document.body` and are therefore
 * nowhere near it in the DOM.
 *
 * ContentEditor closes a field when focus leaves it, and a colour palette or a
 * find box taking focus is not leaving — it is the toolbar being used. Without
 * the marker, opening the picker would close the very field it is about to paint.
 */
export const RIBBON_MARKER_ATTR = 'data-editor-ribbon';

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
