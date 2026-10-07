import type { NumberedSubject } from '../../../../document.numbering';
import type { Section, Subject, SubSection } from '../../../../types';
import { SIGNATURES_TOPIC_TITLE } from '../../../SignaturesSection/SignaturesSection.constants';

export type FlattenedPaperNode =
  | {
      type: 'signatures';
      id: string;
      subject: Subject;
    }
  | {
      type: 'subject';
      id: string;
      subject: Subject;
      isFirst: boolean;
    }
  | {
      type: 'section';
      id: string;
      subjectId: string;
      section: Section;
      number: number;
      hasSubSections: boolean;
    }
  | {
      type: 'subSection';
      id: string;
      subjectId: string;
      sectionId: string;
      subSection: SubSection;
      index: number;
      isLast: boolean;
    };

// ponytail: Flattened document tree so each subject, section, and subsection is virtualized as an independent node.
export const flattenDocumentNodes = (
  subjects: NumberedSubject[],
  filteredSectionIds: Set<string>,
  isSectionHidden: (id: string) => boolean,
): FlattenedPaperNode[] => {
  const nodes: FlattenedPaperNode[] = [];
  let isFirstSubject = true;

  for (const { subject, firstSectionNumber } of subjects) {
    if (subject.title === SIGNATURES_TOPIC_TITLE) {
      nodes.push({
        type: 'signatures',
        id: subject.id,
        subject,
      });
      continue;
    }

    nodes.push({
      type: 'subject',
      id: subject.id,
      subject,
      isFirst: isFirstSubject,
    });
    isFirstSubject = false;

    subject.sections.forEach((section, sIndex) => {
      if (filteredSectionIds.has(section.id)) return;

      const hidden = isSectionHidden(section.id);
      const visibleSubSections: { subSection: SubSection; originalIndex: number }[] = [];
      if (!hidden) {
        section.subSections.forEach((sub, subIdx) => {
          if (!filteredSectionIds.has(sub.id)) {
            visibleSubSections.push({ subSection: sub, originalIndex: subIdx });
          }
        });
      }

      nodes.push({
        type: 'section',
        id: section.id,
        subjectId: subject.id,
        section,
        number: firstSectionNumber + sIndex,
        hasSubSections: visibleSubSections.length > 0,
      });

      visibleSubSections.forEach(({ subSection, originalIndex }, idx) => {
        nodes.push({
          type: 'subSection',
          id: subSection.id,
          subjectId: subject.id,
          sectionId: section.id,
          subSection,
          index: originalIndex,
          isLast: idx === visibleSubSections.length - 1,
        });
      });
    });
  }

  return nodes;
};

export const estimateNodeSize = (node?: FlattenedPaperNode): number => {
  if (!node) return 140;
  switch (node.type) {
    case 'subject':
      return 50;
    case 'signatures':
      return 280;
    case 'section':
      return 180;
    case 'subSection':
      return 90;
  }
};
