import { colors, docStatusColors, gray } from '@/styles/theme';
import type { SectionStatus } from './types';

export const HE_ALPHA = 'אבגדהוזחטיכלמנסעפצקרשת'.split('');

export const SUPERSCRIPT_NUMS = ['¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹', '¹⁰', '¹¹', '¹²'];

export const DOC_NODE_ATTR = 'data-doc-node';
export const docNodeSelector = (id: string) => `[${DOC_NODE_ATTR}="${id}"]`;

export const OUTLINE_NODE_ATTR = 'data-outline-node';
export const outlineNodeSelector = (id: string) => `[${OUTLINE_NODE_ATTR}="${id}"]`;

export const STATUS_FLOW = ['טיוטה פנימית', 'בהכנה', 'בסבב אישורים', 'ממתין להפצה'];

export const EDITABLE_STATUSES = new Set(['טיוטה פנימית', 'טיוטה', 'בהכנה']);

export const DISTRIBUTED_STATUSES = new Set(['מבצעית', 'נצורה', 'הסתיימה', 'התבטלה']);

export const LIMITED_EDIT_STATUSES = new Set(['מבצעית', 'נצורה', 'הסתיימה', 'התבטלה']);

export const FILTER_STATUSES: { id: SectionStatus; label: string }[] = [
  { id: 'editing', label: 'בעריכה' },
  { id: 'pending', label: 'ממתין לאישור' },
  { id: 'approved', label: 'מאושר' },
  { id: 'fix', label: 'לתיקון' },
  { id: 'idle', label: 'לא בעבודה' },
];

export const SECTION_STATUS_COLOR: Record<SectionStatus, string> = {
  editing: colors.primary,
  pending: colors.warning,
  approved: docStatusColors.approved,
  fix: docStatusColors.fix,
  idle: gray[400],
};

export const DOC_STATUS_COLOR: Record<string, string> = {
  'טיוטה פנימית': docStatusColors.idle,
  בהכנה: docStatusColors.preparing,
  'בסבב אישורים': docStatusColors.inApproval,
  'ממתין להפצה': docStatusColors.awaitingDistribution,
};

export const DOC_STATUS_FALLBACK_COLOR = gray[500];
