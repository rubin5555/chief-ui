import type { useDragReorder } from '@/hooks/useDragReorder';
import { numberSubjects } from '../../document.numbering';
import type { Section, Subject, SubSection } from '../../types';
import type { DropEdge, OutlineRow } from './DocumentOutlineTree.types';

export const getDropEdge = (
  ids: string[],
  drag: ReturnType<typeof useDragReorder>,
  id: string,
): DropEdge => {
  if (drag.dragOverId !== id || !drag.draggedId) return null;
  const from = ids.indexOf(drag.draggedId);
  const to = ids.indexOf(id);

  if (from === -1 || to === -1) return null;
  return from > to ? 'top' : 'bottom';
};

export const flattenOutline = (
  subjects: Subject[],
  isExpanded: (subjectId: string) => boolean,
  readOnly: boolean,
): OutlineRow[] => {
  const rows: OutlineRow[] = [];

  const pushSection = (
    subject: Subject,
    section: Section,
    index: number,
    number: number,
    siblingIds: string[],
  ) => {
    rows.push({
      kind: 'section',
      key: section.id,
      subjectId: subject.id,
      section,
      index,
      number,
      siblingIds,
    });

    const subSiblingIds = section.subSections.map((subSection: SubSection) => subSection.id);
    section.subSections.forEach((subSection, subIndex) => {
      rows.push({
        kind: 'subSection',
        key: subSection.id,
        subjectId: subject.id,
        sectionId: section.id,
        subSection,
        index: subIndex,
        siblingIds: subSiblingIds,
      });
    });

    if (!readOnly) {
      rows.push({
        kind: 'addSubSection',
        key: `add-sub-section-${section.id}`,
        subjectId: subject.id,
        sectionId: section.id,
      });
    }
  };

  for (const { subject, firstSectionNumber } of numberSubjects(subjects)) {
    rows.push({ kind: 'subject', key: subject.id, subject });
    if (!isExpanded(subject.id)) continue;

    const siblingIds = subject.sections.map((section) => section.id);
    subject.sections.forEach((section, index) => {
      pushSection(subject, section, index, firstSectionNumber + index, siblingIds);
    });

    if (!readOnly) {
      rows.push({ kind: 'addSection', key: `add-section-${subject.id}`, subjectId: subject.id });
    }
  }

  return rows;
};
