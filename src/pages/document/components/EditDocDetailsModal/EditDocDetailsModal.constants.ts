export type EditDocDetailsMode = 'edit' | 'duplicate' | 'issue-update' | 'issue-new';

export const MODAL_TITLES: Record<EditDocDetailsMode, string> = {
  edit: 'עריכת פרטי מסמך',
  duplicate: 'שכפול מסמך',
  'issue-update': 'הנפקת עדכון',
  'issue-new': 'הנפקת מסמך חדש',
};

export const SUBMIT_LABELS: Record<EditDocDetailsMode, string> = {
  edit: 'שמור שינויים',
  duplicate: 'שכפל',
  'issue-update': 'הנפק עדכון',
  'issue-new': 'הנפק מסמך',
};

export const CLASSIFICATION_OPTIONS = ['בלמ"ס', 'סודי', 'סודי ביותר'];

export const ORGANIZATION_OPTIONS = ['ארגון א׳', 'ארגון ב׳', 'ארגון ג׳', 'ארגון ד׳'];

export const DEPARTMENT_OPTIONS = ['אגף מבצעים', 'אגף משאבי אנוש', 'אגף לוגיסטיקה', 'אגף תקשוב'];
