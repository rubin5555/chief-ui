import { STATUS_FLOW } from '../../document.constants';

export const getNextStatus = (status: string): string | null => {
  const index = STATUS_FLOW.indexOf(status);
  if (index === -1) return STATUS_FLOW[0];
  return index < STATUS_FLOW.length - 1 ? STATUS_FLOW[index + 1] : null;
};

export const getPrevStatus = (status: string): string | null => {
  const index = STATUS_FLOW.indexOf(status);
  return index > 0 ? STATUS_FLOW[index - 1] : null;
};

export const getAdvanceLabel = (status: string, canStep: boolean): string | null => {
  if (status === 'ממתין להפצה') return 'הפץ מסמך';
  const next = getNextStatus(status);
  if (!canStep || !next) return null;
  if (status === 'בסבב אישורים') return 'אישור/דחיית המסמך';
  if (next === 'בסבב אישורים') return 'העבר לסבב אישורים';
  return `העבר ל${next}`;
};

export const getRevertLabel = (status: string, canStep: boolean): string | null => {
  if (status === 'ממתין להפצה') return 'החזר לעריכה';
  const prev = getPrevStatus(status);
  if (!canStep || !prev) return null;
  if (status === 'בסבב אישורים') return 'החזר לעריכה';
  return `החזר למסמך ${prev}`;
};
