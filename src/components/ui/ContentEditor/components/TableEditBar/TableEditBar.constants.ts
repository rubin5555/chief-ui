import type { TableGridIconVariant } from './components/TableGridIcon';

export interface TableBarAction {
  /** Also the test id suffix. */
  id: string;
  title: string;
  command: string;
  /** One of the six hand-drawn row/column glyphs, where lucide has none. */
  glyph?: TableGridIconVariant;
  danger?: boolean;
}

/**
 * The strip, in the order main draws it (Edit.tsx:1013-1073): rows, then columns,
 * then cells, then the two properties dialogs, then delete.
 *
 * Four of main's fifteen buttons are missing, and deliberately. Two were extra
 * split directions and one was a word-wrap toggle that TinyMCE's table model has
 * no command for; all three were inert in main too. Shipping them here would put
 * back exactly what got this ribbon parked in `parity/` in the first place.
 */
export const ROW_ACTIONS: TableBarAction[] = [
  {
    id: 'row-before',
    title: 'הוסף שורה מעל',
    command: 'mceTableInsertRowBefore',
    glyph: 'row-before',
  },
  {
    id: 'row-after',
    title: 'הוסף שורה מתחת',
    command: 'mceTableInsertRowAfter',
    glyph: 'row-after',
  },
  {
    id: 'row-delete',
    title: 'מחק שורה',
    command: 'mceTableDeleteRow',
    glyph: 'row-delete',
    danger: true,
  },
];

export const COLUMN_ACTIONS: TableBarAction[] = [
  {
    id: 'col-before',
    title: 'הוסף עמודה לפני',
    command: 'mceTableInsertColBefore',
    glyph: 'col-before',
  },
  {
    id: 'col-after',
    title: 'הוסף עמודה אחרי',
    command: 'mceTableInsertColAfter',
    glyph: 'col-after',
  },
  {
    id: 'col-delete',
    title: 'מחק עמודה',
    command: 'mceTableDeleteCol',
    glyph: 'col-delete',
    danger: true,
  },
];

export const ICON_SIZE = 14;
