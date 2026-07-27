export const ADD_NODE_LINK_IDS = {
  // Keyed by the parent the new node lands under, since that is what the caller
  // has and what a test wants to name ("add a section to s1").
  addSection: (subjectId: string) => `add-node-link-section-${subjectId}`,
  addSubSection: (sectionId: string) => `add-node-link-subsection-${sectionId}`,
};
