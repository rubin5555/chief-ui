export const ATTACHMENTS_MODAL_IDS = {
  root: 'attachments-modal',
  emptyState: 'attachments-modal-empty',
  row: (attachmentId: string) => `attachments-modal-row-${attachmentId}`,
  downloadBtn: (attachmentId: string) => `attachments-modal-download-${attachmentId}`,
  deleteBtn: (attachmentId: string) => `attachments-modal-delete-${attachmentId}`,
  addMoreBtn: 'attachments-modal-add-more',
  doneBtn: 'attachments-modal-done',
};
