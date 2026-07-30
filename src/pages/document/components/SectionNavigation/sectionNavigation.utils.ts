import type { Subject } from '../../types';

/**
 * Which topic holds `nodeId` — the topic itself, one of its sections, or one of
 * their sub-sections. `-1` when the document doesn't hold it at all.
 *
 * The paper virtualizes by topic, so this is the question it has to answer
 * before it can scroll anywhere: a section in a topic nobody has scrolled to is
 * not in the DOM, and no amount of scrolling toward it will conjure the element.
 * The topic is what gets mounted; the section comes with it.
 */
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
