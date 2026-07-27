import type { SectionMetaMap, SectionStatus, Subject } from '../../../../types';
import {
  ApprovedFill,
  PreparingFill,
  ProgressLabel,
  ProgressList,
  ProgressRow,
  Track,
} from './DocProgressBars.styles';
import { DOC_PROGRESS_BARS_IDS } from './DocProgressBars.testids';

export interface DocProgressBarsProps {
  subjects: Subject[];
  sectionMeta: SectionMetaMap;
}

// Counts sections, not sub-sections: main's labels say `סעיפים`, and its own seed
// tree is two levels deep, so a sub-section has never been part of this number.
const countSections = (subjects: Subject[], sectionMeta: SectionMetaMap, status: SectionStatus) => {
  const sections = subjects.flatMap((subject) => subject.sections);
  const matching = sections.filter((section) => sectionMeta[section.id]?.status === status);
  return { count: matching.length, total: sections.length };
};

const toPercent = ({ count, total }: { count: number; total: number }) =>
  total === 0 ? 0 : Math.round((count / total) * 100);

// How much of the document is written and how much is signed off (main,
// Edit.tsx:3826).
//
// main hardcodes `0/3` and `2/5` — two fractions that don't even share a
// denominator — so these are derived from the tree instead. The bars look
// identical; the numbers are the ones the document actually has, which is the
// point of a progress bar. Derived during render from props, so nothing has to
// stay in sync and there is no effect here.
export const DocProgressBars = ({ subjects, sectionMeta }: DocProgressBarsProps) => {
  const preparing = countSections(subjects, sectionMeta, 'editing');
  const approved = countSections(subjects, sectionMeta, 'approved');

  return (
    <ProgressList data-testid={DOC_PROGRESS_BARS_IDS.root}>
      <ProgressRow>
        <ProgressLabel data-testid={DOC_PROGRESS_BARS_IDS.preparingLabel}>
          {preparing.count}/{preparing.total} סעיפים בהכנה
        </ProgressLabel>
        <Track>
          <PreparingFill $percent={toPercent(preparing)} />
        </Track>
      </ProgressRow>

      <ProgressRow>
        <ProgressLabel data-testid={DOC_PROGRESS_BARS_IDS.approvedLabel}>
          {approved.count}/{approved.total} סעיפים אושרו
        </ProgressLabel>
        <Track>
          <ApprovedFill $percent={toPercent(approved)} />
        </Track>
      </ProgressRow>
    </ProgressList>
  );
};
