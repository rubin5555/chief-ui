import { useState } from 'react';
import { reorderById } from '@/utils/reorderById';

export interface NodePermissions {
  approvers: string[];
  editors: string[];
}

export interface SubSection {
  id: string;
  title: string;
  content: string;
  permissions: NodePermissions;
}

export interface Section {
  id: string;
  title: string;
  content: string;
  permissions: NodePermissions;
  subSections: SubSection[];
}

export interface Subject {
  id: string;
  title: string;
  sections: Section[];
}

const makeId = (prefix: string) => `${prefix}-${self.crypto.randomUUID()}`;

export type InsertAt = 'before' | 'end';

// Lands the node above the sibling it was dropped on; dropping on the parent
// itself has no sibling to aim at, so it goes to the head of the list.
const insertAt = <T extends { id: string }>(
  items: T[],
  item: T,
  beforeId: string,
  at: InsertAt,
): T[] => {
  if (at === 'end') return [...items, item];

  const index = items.findIndex((candidate) => candidate.id === beforeId);
  const next = [...items];
  next.splice(index === -1 ? 0 : index, 0, item);
  return next;
};

const emptySection = (title: string): Section => ({
  id: makeId('section'),
  title,
  content: '',
  permissions: { approvers: [], editors: [] },
  subSections: [],
});

const emptySubSection = (title: string): SubSection => ({
  id: makeId('subsection'),
  title,
  content: '',
  permissions: { approvers: [], editors: [] },
});

export const useDocumentTree = (initialSubjects: Subject[] = []) => {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);

  const mapSection = (subjectId: string, sectionId: string, fn: (section: Section) => Section) =>
    setSubjects((prev) =>
      prev.map((subject) =>
        subject.id !== subjectId
          ? subject
          : {
              ...subject,
              sections: subject.sections.map((section) =>
                section.id !== sectionId ? section : fn(section),
              ),
            },
      ),
    );

  const mapSubSection = (
    subjectId: string,
    sectionId: string,
    subSectionId: string,
    fn: (subSection: SubSection) => SubSection,
  ) =>
    mapSection(subjectId, sectionId, (section) => ({
      ...section,
      subSections: section.subSections.map((subSection) =>
        subSection.id !== subSectionId ? subSection : fn(subSection),
      ),
    }));

  const addSubject = (title = '') => {
    const subject: Subject = { id: makeId('subject'), title, sections: [] };
    setSubjects((prev) => [...prev, subject]);
    return subject.id;
  };

  const removeSubject = (subjectId: string) =>
    setSubjects((prev) => prev.filter((subject) => subject.id !== subjectId));

  const reorderSubjects = (draggedId: string, targetId: string) =>
    setSubjects((prev) => reorderById(prev, draggedId, targetId));

  const updateSubjectTitle = (subjectId: string, title: string) =>
    setSubjects((prev) =>
      prev.map((subject) => (subject.id !== subjectId ? subject : { ...subject, title })),
    );

  const addSection = (subjectId: string, title = '') => {
    const section = emptySection(title);
    setSubjects((prev) =>
      prev.map((subject) =>
        subject.id !== subjectId
          ? subject
          : { ...subject, sections: [...subject.sections, section] },
      ),
    );
    return section.id;
  };

  const removeSection = (subjectId: string, sectionId: string) =>
    setSubjects((prev) =>
      prev.map((subject) =>
        subject.id !== subjectId
          ? subject
          : {
              ...subject,
              sections: subject.sections.filter((section) => section.id !== sectionId),
            },
      ),
    );

  // The target is either a sibling section — a plain reorder — or the subject
  // that should take the section in, which puts it at the head of its list, or
  // at the tail when the drop asked for the end.
  const moveSection = (draggedId: string, targetId: string, at: InsertAt = 'before') =>
    setSubjects((prev) => {
      const source = prev.find((subject) =>
        subject.sections.some((section) => section.id === draggedId),
      );
      const moved = source?.sections.find((section) => section.id === draggedId);
      if (!source || !moved) return prev;

      if (source.sections.some((section) => section.id === targetId))
        return prev.map((subject) =>
          subject.id !== source.id
            ? subject
            : { ...subject, sections: reorderById(subject.sections, draggedId, targetId) },
        );

      const target = prev.find(
        (subject) =>
          subject.id === targetId || subject.sections.some((section) => section.id === targetId),
      );
      if (!target) return prev;

      return prev.map((subject) => {
        if (subject.id !== source.id && subject.id !== target.id) return subject;

        const kept =
          subject.id === source.id
            ? subject.sections.filter((section) => section.id !== draggedId)
            : subject.sections;

        return {
          ...subject,
          sections: subject.id === target.id ? insertAt(kept, moved, targetId, at) : kept,
        };
      });
    });

  const updateSectionTitle = (subjectId: string, sectionId: string, title: string) =>
    mapSection(subjectId, sectionId, (section) => ({ ...section, title }));

  const updateSectionContent = (subjectId: string, sectionId: string, content: string) =>
    mapSection(subjectId, sectionId, (section) => ({ ...section, content }));

  const updateSectionPermissions = (
    subjectId: string,
    sectionId: string,
    permissions: NodePermissions,
  ) => mapSection(subjectId, sectionId, (section) => ({ ...section, permissions }));

  const addSubSection = (subjectId: string, sectionId: string, title = '') => {
    const subSection = emptySubSection(title);
    mapSection(subjectId, sectionId, (section) => ({
      ...section,
      subSections: [...section.subSections, subSection],
    }));
    return subSection.id;
  };

  const removeSubSection = (subjectId: string, sectionId: string, subSectionId: string) =>
    mapSection(subjectId, sectionId, (section) => ({
      ...section,
      subSections: section.subSections.filter((subSection) => subSection.id !== subSectionId),
    }));

  // Same targets one level down: a sibling sub-section, or the section that
  // should take this one in.
  const moveSubSection = (draggedId: string, targetId: string, at: InsertAt = 'before') =>
    setSubjects((prev) => {
      const sections = prev.flatMap((subject) => subject.sections);
      const source = sections.find((section) =>
        section.subSections.some((subSection) => subSection.id === draggedId),
      );
      const moved = source?.subSections.find((subSection) => subSection.id === draggedId);
      if (!source || !moved) return prev;

      const isSibling = source.subSections.some((subSection) => subSection.id === targetId);
      const target = sections.find(
        (section) =>
          section.id === targetId ||
          section.subSections.some((subSection) => subSection.id === targetId),
      );
      if (!target) return prev;

      const mapSubSections = (section: Section): Section => {
        if (isSibling)
          return section.id !== source.id
            ? section
            : { ...section, subSections: reorderById(section.subSections, draggedId, targetId) };

        if (section.id !== source.id && section.id !== target.id) return section;

        const kept =
          section.id === source.id
            ? section.subSections.filter((subSection) => subSection.id !== draggedId)
            : section.subSections;

        return {
          ...section,
          subSections: section.id === target.id ? insertAt(kept, moved, targetId, at) : kept,
        };
      };

      return prev.map((subject) => ({
        ...subject,
        sections: subject.sections.map(mapSubSections),
      }));
    });

  const updateSubSectionTitle = (
    subjectId: string,
    sectionId: string,
    subSectionId: string,
    title: string,
  ) =>
    mapSubSection(subjectId, sectionId, subSectionId, (subSection) => ({ ...subSection, title }));

  const updateSubSectionContent = (
    subjectId: string,
    sectionId: string,
    subSectionId: string,
    content: string,
  ) =>
    mapSubSection(subjectId, sectionId, subSectionId, (subSection) => ({
      ...subSection,
      content,
    }));

  const updateSubSectionPermissions = (
    subjectId: string,
    sectionId: string,
    subSectionId: string,
    permissions: NodePermissions,
  ) =>
    mapSubSection(subjectId, sectionId, subSectionId, (subSection) => ({
      ...subSection,
      permissions,
    }));

  const reset = (next: Subject[] = []) => setSubjects(next);

  return {
    subjects,
    addSubject,
    removeSubject,
    reorderSubjects,
    updateSubjectTitle,
    addSection,
    removeSection,
    moveSection,
    updateSectionTitle,
    updateSectionContent,
    updateSectionPermissions,
    addSubSection,
    removeSubSection,
    moveSubSection,
    updateSubSectionTitle,
    updateSubSectionContent,
    updateSubSectionPermissions,
    reset,
  } as const;
};
