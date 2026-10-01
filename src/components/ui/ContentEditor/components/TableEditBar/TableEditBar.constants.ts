import type { TableGridIconVariant } from './components/TableGridIcon';

export interface TableBarAction {
  id: string;
  title: string;
  command: string;
  glyph?: TableGridIconVariant;
  danger?: boolean;
}

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
