import {
  Bookmark,
  Copy,
  FileEdit,
  FolderPlus,
  GitBranch,
  Hash,
  Link,
  Link2,
  Monitor,
  RefreshCw,
  RotateCcw,
  Share2,
  Shield,
  Trash2,
  XCircle,
} from 'lucide-react';
import type { ElementType } from 'react';
import type { CatalogTab } from '@/api/catalog';

export type RowAction = { label: string; Icon: ElementType; danger?: boolean } | { sep: true };

// The action labels are the identity of an action, not just its caption —
// `DocumentCatalog` branches on them to decide which modal to open. They are
// exported as one union so that branch can be exhaustive.
export const ROW_ACTION = {
  duplicate: 'שכפול',
  editDetails: 'עריכת פרטי מסמך',
  editDetailsAlt: 'עריכת פרטי המסמך',
  permissions: 'הרשאות',
  viewPermissions: 'הרשאות צפייה',
  controlPermissions: 'הרשאות ובקרה',
  assignFolder: 'שייך לתיקייה',
  copyLink: 'העתקת קישור',
  liveLink: 'יצירת לינק מתעדכן',
  projectAsMain: 'הקרנה כפקודה ראשית',
  shareDoc: 'שיתוף המסמך',
  issueUpdate: 'הוצאת עדכון למסמך',
  changeOrderNum: 'שינוי מס׳ פקודה',
  viewApprovalRound: 'צפייה בסבב אישורים',
  buildHierarchy: 'יצירת היררכית מסמכים',
  cancelDoc: 'ביטול מסמך',
  deleteDoc: 'מחיקת המסמך',
  restore: 'שחזור',
  purge: 'מחיקה לצמיתות',
} as const;

// These three report progress inside the menu instead of opening anything, so
// the menu stays open while they run.
export const INLINE_PHASE_ACTIONS = new Set<string>([
  ROW_ACTION.copyLink,
  ROW_ACTION.liveLink,
  ROW_ACTION.projectAsMain,
]);

export const ROW_ACTIONS: Record<CatalogTab, RowAction[]> = {
  drafts: [
    { label: ROW_ACTION.duplicate, Icon: Copy },
    { label: ROW_ACTION.editDetails, Icon: FileEdit },
    { label: ROW_ACTION.permissions, Icon: Shield },
    { label: ROW_ACTION.assignFolder, Icon: FolderPlus },
    { sep: true },
    { label: ROW_ACTION.copyLink, Icon: Link },
    { sep: true },
    { label: ROW_ACTION.deleteDoc, Icon: Trash2, danger: true },
  ],
  distribution: [
    { label: ROW_ACTION.viewPermissions, Icon: Shield },
    { label: ROW_ACTION.viewApprovalRound, Icon: GitBranch },
    { label: ROW_ACTION.editDetailsAlt, Icon: FileEdit },
  ],
  distributed: [
    { label: ROW_ACTION.duplicate, Icon: Copy },
    { label: ROW_ACTION.issueUpdate, Icon: RefreshCw },
    { label: ROW_ACTION.changeOrderNum, Icon: Hash },
    { label: ROW_ACTION.editDetails, Icon: FileEdit },
    { sep: true },
    { label: ROW_ACTION.cancelDoc, Icon: XCircle, danger: true },
    { label: ROW_ACTION.controlPermissions, Icon: Shield },
    { sep: true },
    { label: ROW_ACTION.assignFolder, Icon: FolderPlus },
    { label: ROW_ACTION.buildHierarchy, Icon: Bookmark },
    { sep: true },
    { label: ROW_ACTION.viewApprovalRound, Icon: GitBranch },
    { label: ROW_ACTION.copyLink, Icon: Link },
    { label: ROW_ACTION.liveLink, Icon: Link2 },
    { label: ROW_ACTION.projectAsMain, Icon: Monitor },
    { label: ROW_ACTION.shareDoc, Icon: Share2 },
  ],
  archive: [
    { label: ROW_ACTION.duplicate, Icon: Copy },
    { label: ROW_ACTION.issueUpdate, Icon: RefreshCw },
    { label: ROW_ACTION.changeOrderNum, Icon: Hash },
    { label: ROW_ACTION.editDetailsAlt, Icon: FileEdit },
    { sep: true },
    { label: ROW_ACTION.viewPermissions, Icon: Shield },
    { label: ROW_ACTION.shareDoc, Icon: Share2 },
    { label: ROW_ACTION.copyLink, Icon: Link },
  ],
};

export const TRASH_ROW_ACTIONS: RowAction[] = [
  { label: ROW_ACTION.restore, Icon: RotateCcw },
  { sep: true },
  { label: ROW_ACTION.purge, Icon: Trash2, danger: true },
];

// How long the inline actions spend claiming to work, and how long they leave
// the tick up afterwards. main's numbers.
export const INLINE_PHASE_MS = { done: 900, close: 1900 } as const;
