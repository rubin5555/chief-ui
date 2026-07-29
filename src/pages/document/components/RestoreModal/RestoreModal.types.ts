import type { Section } from '../../types';

export interface DeletedSectionEntry {
  subjectId: string;
  /**
   * The number the section carried when it was deleted (`2.3`), kept with it
   * because the tree it was numbered by no longer contains it — there is nothing
   * left to recompute the number from.
   */
  label: string;
  section: Section;
}
