import type { Subject } from './types';

/**
 * Pair each subject with the document-wide number its first section carries.
 *
 * main numbers sections continuously across topics (`secCounter`, Edit.tsx:4390)
 * — the third section of the first topic and the first section of the second
 * topic read `3.` and `4.`, not `1.3` and `2.1`. A subject can't derive that from
 * its own position, so it is computed once here.
 *
 * It sits at the page root rather than beside the sheet because the sheet is not
 * the only thing that numbers sections: the outline in the sidebar has to say the
 * same number against the same section, and a rule with two implementations is a
 * rule that eventually disagrees with itself.
 */
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
