export const IMPORT_DOC_MODAL_IDS = {
  root: 'import-doc-modal',
  tab: (id: string) => `import-doc-tab-${id}`,
  docRow: (id: string) => `import-doc-row-${id}`,
  // Keyed by section id, matching the state it drives. A title would collide
  // between two same-titled sections; a list index would shift on reorder.
  sectionCheckbox: (sectionId: string) => `import-doc-section-${sectionId}`,
  importBtn: 'import-doc-import',
};
