export const DOC_PERMISSIONS_MODAL_IDS = {
  root: 'doc-permissions-modal',
  level: (id: string) => `doc-permissions-modal-level-${id}`,
  description: 'doc-permissions-modal-description',
  sectionTree: 'doc-permissions-modal-section-tree',
  subjectRow: (id: string) => `doc-permissions-modal-subject-${id}`,
  sectionRow: (id: string) => `doc-permissions-modal-section-${id}`,
  sectionMemberCount: (id: string) => `doc-permissions-modal-section-count-${id}`,
  clearSections: 'doc-permissions-modal-clear-sections',
  unassigned: 'doc-permissions-modal-unassigned',
  cancelBtn: 'doc-permissions-modal-cancel',
  doneBtn: 'doc-permissions-modal-done',
};
