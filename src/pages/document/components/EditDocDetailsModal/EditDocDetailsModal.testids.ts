export const EDIT_DOC_DETAILS_MODAL_IDS = {
  root: 'edit-doc-details-modal',

  factsGrid: 'edit-doc-details-facts',
  fact: (field: string) => `edit-doc-details-fact-${field}`,
  nameInput: 'edit-doc-details-name',
  departmentSelect: 'edit-doc-details-department',
  docTypeSelect: 'edit-doc-details-doc-type',
  folderSelect: 'edit-doc-details-folder',
  entityTypeSelect: 'edit-doc-details-entity-type',
  entityNameSelect: 'edit-doc-details-entity-name',
  effectiveDate: 'edit-doc-details-effective-date',
  expiryDate: 'edit-doc-details-expiry-date',
  pdfAccessOption: (id: string) => `edit-doc-details-pdf-${id}`,
  optionToggle: (field: string) => `edit-doc-details-toggle-${field}`,
  dirtyWarning: 'edit-doc-details-dirty-warning',
  submitBtn: 'edit-doc-details-submit',
  duplicateNameHint: 'edit-doc-details-duplicate-hint',

  readOnlyValue: (field: string) => `edit-doc-details-readonly-${field}`,
};
