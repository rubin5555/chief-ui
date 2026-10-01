import type { ExcelImportFailureReason } from './ExcelFailedList';

export const FAILURE_LABELS: Record<ExcelImportFailureReason, string> = {
  'not-found': 'לא נמצא במערכת',
  invalid: 'מספר אישי לא תקין',
};
