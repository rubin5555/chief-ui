import { useState } from 'react';
import type { useDocumentTree } from '@/hooks/useDocumentTree';
import type { DeletedSectionEntry } from '../components/RestoreModal';
import type { Section } from '../types';

export const useDocumentTrash = (tree: ReturnType<typeof useDocumentTree>) => {
  const [entries, setEntries] = useState<DeletedSectionEntry[]>([]);

  const remove = (subjectId: string, section: Section) => {
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
