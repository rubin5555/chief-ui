export const IMPORT_DOC_MODAL_IDS = {
  root: 'import-doc-modal',
  // The way back out of a chosen document, to the list of documents.
  back: 'import-doc-back',
  docRow: (id: string) => `import-doc-row-${id}`,
  noDocs: 'import-doc-no-docs',
  // Keyed by section id, matching the state it drives. A title would collide
  // between two same-titled sections; a list index would shift on reorder.
  sectionRow: (sectionId: string) => `import-doc-section-${sectionId}`,
  // The same section is selectable from the rendered document too, so the two
  // columns need ids that don't collide.
  previewRow: (sectionId: string) => `import-doc-preview-${sectionId}`,
  importBtn: 'import-doc-import',
};
