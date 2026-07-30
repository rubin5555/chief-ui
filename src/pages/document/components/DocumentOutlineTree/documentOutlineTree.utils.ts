import type { useDragReorder } from '@/hooks/useDragReorder';
import { numberSubjects } from '../../document.numbering';
import type { Section, Subject, SubSection } from '../../types';
import type { DropEdge, OutlineRow } from './DocumentOutlineTree.types';

/**
 * Which edge of `id`'s row should show the drop rule.
 *
 * useDragReorder deals in ids, not positions, so the direction of travel has to be
 * recovered from the list: a node dragged from below lands above the row it's over
 * (rule on top), one dragged from above lands below it.
 */
export const getDropEdge = (
  ids: string[],
  drag: ReturnType<typeof useDragReorder>,
  id: string,
): DropEdge => {
  if (drag.dragOverId !== id || !drag.draggedId) return null;
  const from = ids.indexOf(drag.draggedId);
  const to = ids.indexOf(id);
  // A drag that started in a different parent has no position in this list; it is
  // not a valid drop here (reorder* are membership-scoped and would no-op), so
  // promise nothing.
  if (from === -1 || to === -1) return null;
  return from > to ? 'top' : 'bottom';
};

/**
 * The outline as one list of rows, deepest level and all.
 *
 * The tree is drawn as a flat list because that is what can be virtualized: a
 * row list has one scroll offset per row, where a nest of three levels has a
 * position that only exists relative to whatever is above it. Nesting survives
 * as an indent on the row rather than as a container around it.
 *
 * Order matches what the nested version rendered: a topic, then each of its
 * sections with its sub-sections and its `+ תת סעיף` link, then the topic's
 * `+ הוספת סעיף`. A collapsed topic contributes its own row and nothing else,
 * which is what makes collapsing cheap — the rows simply aren't there.
 *
 * Section numbers come from `numberSubjects`, the same function the sheet
 * numbers with, so a row and the section it points at always read alike — and a
 * collapsed topic still spends its numbers, because collapsing it in the sidebar
 * doesn't renumber the document.
 */
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
