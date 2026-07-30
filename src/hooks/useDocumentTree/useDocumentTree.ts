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

  const reorderSections = (draggedId: string, targetId: string) =>
    setSubjects((prev) =>
      prev.map((subject) => {
        const hasBoth =
          subject.sections.some((section) => section.id === draggedId) &&
          subject.sections.some((section) => section.id === targetId);
        return hasBoth
          ? { ...subject, sections: reorderById(subject.sections, draggedId, targetId) }
          : subject;
      }),
    );

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

  const reorderSubSections = (draggedId: string, targetId: string) =>
    setSubjects((prev) =>
      prev.map((subject) => ({
        ...subject,
        sections: subject.sections.map((section) => {
          const hasBoth =
            section.subSections.some((subSection) => subSection.id === draggedId) &&
            section.subSections.some((subSection) => subSection.id === targetId);
          return hasBoth
            ? { ...section, subSections: reorderById(section.subSections, draggedId, targetId) }
            : section;
        }),
      })),
    );

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
    reorderSections,
    updateSectionTitle,
    updateSectionContent,
    updateSectionPermissions,
    addSubSection,
    removeSubSection,
    reorderSubSections,
    updateSubSectionTitle,
    updateSubSectionContent,
    updateSubSectionPermissions,
    reset,
  } as const;
};
