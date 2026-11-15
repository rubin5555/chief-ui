import type { UnderlineTab } from '@/components/ui/UnderlineTabs';
import { docStatusColors } from '@/styles/theme';

export type ImportDocTabId = 'drafts' | 'distributed';

export const TABS: UnderlineTab[] = [
  { id: 'drafts', label: 'טיוטות' },
  { id: 'distributed', label: 'פקודות שהופצו' },
];

export const IMPORT_STATUS_COLOR: Record<string, string> = {
  טיוטה: docStatusColors.idle,
  בהכנה: docStatusColors.importPreparing,
  הופץ: docStatusColors.approved,
};

export const FALLBACK_STATUS_COLOR = docStatusColors.idle;

export const SEARCH_PLACEHOLDER = 'חיפוש לפי שם, מספר פקודה...';
