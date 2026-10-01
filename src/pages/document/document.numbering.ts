import type { Subject } from './types';

export interface NumberedSubject {
  subject: Subject;
  firstSectionNumber: number;
}

export const numberSubjects = (subjects: Subject[]): NumberedSubject[] => {
  let nextNumber = 1;
  return subjects.map((subject) => {
    const firstSectionNumber = nextNumber;
    nextNumber += subject.sections.length;
    return { subject, firstSectionNumber };
  });
};
