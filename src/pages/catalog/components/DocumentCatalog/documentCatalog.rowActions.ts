import type { CatalogDoc } from '@/api/catalog';
import type { EditDocDetailsMode } from '@/modals/EditDocDetailsModal';
import type { DocumentHeader } from '@/pages/document/types';
import { ROW_ACTION } from './components/RowActionMenu';
import { HISTORY_TITLE, RECEIPTS_ACTION, RESHARE_ACTION } from './DocumentCatalog.constants';

// Which dialog a row action resolves to. `null` means the action is drawn but
// does nothing on main either, so it does nothing here.
export type CatalogModalKind =
  | 'details'
  | 'permissions'
  | 'approvalRound'
  | 'delete'
  | 'cancel'
  | 'history'
  | 'receipts'
  | 'reshare'
  | 'hierarchy';

export interface CatalogModalState {
  kind: CatalogModalKind;
  doc: CatalogDoc;
  detailsMode?: EditDocDetailsMode;
}

// main routes `שכפול` and `עריכת פרטי מסמך` to two different dialogs depending
// on the shelf — a catalog-local one for drafts, the document page's for the
// rest. The two have the same fields, and the document page's has the better
// chrome, so both shelves get that one and the mode carries the difference.
export const modalForAction = (label: string, doc: CatalogDoc): CatalogModalState | null => {
  switch (label) {
    case ROW_ACTION.duplicate:
      return { kind: 'details', doc, detailsMode: 'duplicate' };
    case ROW_ACTION.editDetails:
    case ROW_ACTION.editDetailsAlt:
      return { kind: 'details', doc, detailsMode: 'edit' };
    case ROW_ACTION.issueUpdate:
      return { kind: 'details', doc, detailsMode: 'issue-update' };
    case ROW_ACTION.changeOrderNum:
      return { kind: 'details', doc, detailsMode: 'issue-new' };
    case ROW_ACTION.permissions:
    case ROW_ACTION.viewPermissions:
    case ROW_ACTION.controlPermissions:
      return { kind: 'permissions', doc };
    case ROW_ACTION.viewApprovalRound:
      return { kind: 'approvalRound', doc };
    case ROW_ACTION.deleteDoc:
      return { kind: 'delete', doc };
    case ROW_ACTION.cancelDoc:
      return { kind: 'cancel', doc };
    case ROW_ACTION.shareDoc:
    case RESHARE_ACTION:
      return { kind: 'reshare', doc };
    case HISTORY_TITLE:
      return { kind: 'history', doc };
    case RECEIPTS_ACTION:
      return { kind: 'receipts', doc };
    case ROW_ACTION.buildHierarchy:
      return { kind: 'hierarchy', doc };
    // `שייך לתיקייה` opens nothing on main either.
    default:
      return null;
  }
};

// `EditDocDetailsModal` speaks the document page's `DocumentHeader`; a catalog
// row carries a subset of it. Everything the catalog doesn't know is left
// blank rather than invented, which is also how main's own dialog renders it.
export const catalogDocToHeader = (doc: CatalogDoc): DocumentHeader => ({
  name: doc.name,
  organization: doc.env ?? '',
  template: doc.type,
  orderNum: doc.orderNum,
  updateNum: doc.updateNum,
  classification: 'בלמ״ס',
  referenceNum: doc.refNum,
  department: doc.dept ?? '',
  docType: doc.type,
  folder: doc.folder ?? '',
  entityType: '',
  entityName: '',
  effectiveDate: '',
  expiryDate: '',
  pdfAccess: 'authorized',
  cancelApproval: false,
  watermark: false,
  distributeNatzura: false,
});

// A blank document, for the `פתיחת מסמך חדש` form. Every field starts empty
// rather than guessed — the dialog's own selects supply the options.
export const emptyDocHeader = (): DocumentHeader => ({
  name: '',
  organization: '',
  template: '',
  orderNum: '1',
  updateNum: '',
  classification: '',
  referenceNum: '',
  department: '',
  docType: '',
  folder: '',
  entityType: '',
  entityName: '',
  effectiveDate: '',
  expiryDate: '',
  pdfAccess: 'authorized',
  cancelApproval: false,
  watermark: false,
  distributeNatzura: false,
  displayName: '',
  summary: '',
  classificationTag: '',
});

// `שכפול מסמך קיים` seeds the same form from a document that already exists.
// main carries five fields across; the reference number and the dates are
// deliberately not among them, because a copy is a new document.
export const duplicateHeader = (source: CatalogDoc): DocumentHeader => ({
  ...emptyDocHeader(),
  name: source.name,
  organization: source.env ?? '',
  department: source.dept ?? '',
  docType: source.type,
  orderNum: source.orderNum,
});
