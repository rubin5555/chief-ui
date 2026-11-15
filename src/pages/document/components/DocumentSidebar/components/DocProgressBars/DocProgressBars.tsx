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

const countSections = (subjects: Subject[], sectionMeta: SectionMetaMap, status: SectionStatus) => {
  const sections = subjects.flatMap((subject) => subject.sections);
  const matching = sections.filter((section) => sectionMeta[section.id]?.status === status);
  return { count: matching.length, total: sections.length };
};

const toPercent = ({ count, total }: { count: number; total: number }) =>
  total === 0 ? 0 : Math.round((count / total) * 100);

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
