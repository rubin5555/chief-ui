import { useState } from 'react';
import type { useDocumentTree } from '@/hooks/useDocumentTree';
import type { DeletedSectionEntry } from '../components/RestoreModal';
import type { Section } from '../types';

// Deleting a section and restoring one are two ends of the same piece of state,
// but they live in different subtrees — the delete is a section's own action in
// the paper, the restore is a sidebar button. So the state sits here at their
// common ancestor and both ends get this one object rather than a pair of
// loose callbacks (.claude/skills/react-engineering.md, "Shrink Prop Lists").
//
// Unlike other deletes, a section delete snapshots the section itself, so
// RestoreModal restores real content instead of a stub. Sub-section deletes stay
// a plain removal — see RestoreModal's doc comment for that scope call.
export const useDocumentTrash = (tree: ReturnType<typeof useDocumentTree>) => {
  const [entries, setEntries] = useState<DeletedSectionEntry[]>([]);

  const remove = (subjectId: string, section: Section) => {
    // Numbered now, while the tree still holds it. Once removed there is nothing
    // left to work the number out from, and "2.3" is how the restore list names
    // a section people will recognise by where it used to be.
    const subjectIndex = tree.subjects.findIndex((subject) => subject.id === subjectId);
    const sectionIndex =
      tree.subjects[subjectIndex]?.sections.findIndex((candidate) => candidate.id === section.id) ??
      -1;

    setEntries((prev) => [
      ...prev,
      { subjectId, label: `${subjectIndex + 1}.${sectionIndex + 1}`, section },
    ]);
    tree.removeSection(subjectId, section.id);
  };

  const restore = (restored: DeletedSectionEntry[]) => {
    const nextSubjects = tree.subjects.map((subject) => {
      const forSubject = restored
        .filter((entry) => entry.subjectId === subject.id)
        .map((entry) => entry.section);
      return forSubject.length > 0
        ? { ...subject, sections: [...subject.sections, ...forSubject] }
        : subject;
    });
    tree.reset(nextSubjects);
    const restoredIds = new Set(restored.map((entry) => entry.section.id));
    setEntries((prev) => prev.filter((entry) => !restoredIds.has(entry.section.id)));
  };

  return { entries, remove, restore } as const;
};
