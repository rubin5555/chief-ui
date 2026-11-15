import type { OutlineDeleteTarget } from '../../DocumentOutlineTree.types';

type Level = OutlineDeleteTarget['level'];

export const DELETE_LABEL: Record<Level, string> = {
  subject: 'נושא זה',
  section: 'סעיף זה',
  subSection: 'תת סעיף זה',
};

export const DELETE_WARNING: Partial<Record<Level, string>> = {
  subject: 'מחיקת הנושא תמחק את כל הסעיפים תחתיו',
  section: 'מחיקת הסעיף תמחק את כל תתי הסעיפים תחתיו',
};
