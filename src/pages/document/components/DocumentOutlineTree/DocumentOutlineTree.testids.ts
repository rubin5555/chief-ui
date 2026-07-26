export const DOCUMENT_OUTLINE_TREE_IDS = {
  root: 'document-outline-tree',
  subject: (id: string) => `document-outline-subject-${id}`,
  subjectToggle: (id: string) => `document-outline-subject-toggle-${id}`,
  section: (id: string) => `document-outline-section-${id}`,
};
