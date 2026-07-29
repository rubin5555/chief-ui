import type { UnderlineTab } from '@/components/ui/UnderlineTabs';
import { docStatusColors } from '@/styles/theme';

export type ImportDocTabId = 'drafts' | 'distributed';

/**
 * main's IMPORT_DOCS also carries a `recent` list, but its modal only ever
 * renders these two tabs (Edit.tsx:1825). The data is restored in
 * `src/api/docs.ts` for fidelity; the UI keeps main's two.
 */
export const TABS: UnderlineTab[] = [
  { id: 'drafts', label: 'טיוטות' },
  { id: 'distributed', label: 'פקודות שהופצו' },
];

/** main's IMPORT_STATUS_DOT (Edit.tsx:1810), on the document-status tokens. */
export const IMPORT_STATUS_COLOR: Record<string, string> = {
  טיוטה: docStatusColors.idle,
  בהכנה: docStatusColors.importPreparing,
  הופץ: docStatusColors.approved,
};

/**
 * A status the mock doesn't name still gets a dot rather than a gap — grey, the
 * same one `טיוטה` uses, since an unrecognised status is by definition not one
 * of the states worth colouring.
 */
export const FALLBACK_STATUS_COLOR = docStatusColors.idle;

/** Name, org, date, status — main's `3fr 1fr 1fr 1fr` (Edit.tsx:1914). */
export const DOC_TABLE_COLUMNS = '3fr 1fr 1fr 1fr';

export const SEARCH_PLACEHOLDER = 'חיפוש לפי שם, מספר פקודה...';
