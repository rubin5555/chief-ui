import type { Subject } from '../../types';

export const findSubjectIndexForNode = (subjects: Subject[], nodeId: string): number =>
  subjects.findIndex(
    (subject) =>
      subject.id === nodeId ||
      subject.sections.some(
        (section) =>
          section.id === nodeId ||
          section.subSections.some((subSection) => subSection.id === nodeId),
      ),
  );
