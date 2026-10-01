import type { useDocumentTree } from '@/hooks/useDocumentTree';
import type { useDocumentOverrides } from '../../hooks/useDocumentOverrides';
import type { useDocumentTrash } from '../../hooks/useDocumentTrash';
import type { Subject } from '../../types';
import { SubjectHeaderRow, SubjectRoot } from '../components.shared.styles';
import { NodeTitleField } from '../NodeTitleField';
import { SectionBlock } from '../SectionBlock';
import { SUBJECT_BLOCK_IDS } from './SubjectBlock.testids';

export interface SubjectBlockProps {
  subject: Subject;
  firstSectionNumber: number;
  filteredSectionIds: Set<string>;
  searchMatchIds: Set<string>;
  tree: ReturnType<typeof useDocumentTree>;
  overrides: ReturnType<typeof useDocumentOverrides>;
  trash: ReturnType<typeof useDocumentTrash>;
  readOnly: boolean;
  isDistributed: boolean;
}

export const SubjectBlock = ({
  subject,
  firstSectionNumber,
  filteredSectionIds,
  searchMatchIds,
  tree,
  overrides,
  trash,
  readOnly,
  isDistributed,
}: SubjectBlockProps) => {
  const handleTitleChange = (title: string) => tree.updateSubjectTitle(subject.id, title);

  return (
    <SubjectRoot
      $highlighted={searchMatchIds.has(subject.id)}
      data-testid={SUBJECT_BLOCK_IDS.root(subject.id)}
    >
      <SubjectHeaderRow>
        <NodeTitleField
          nodeId={subject.id}
          variant="subject"
          value={subject.title}
          onChange={handleTitleChange}
        />
      </SubjectHeaderRow>

      {subject.sections.map((section, sectionIndex) =>
        filteredSectionIds.has(section.id) ? null : (
          <SectionBlock
            key={section.id}
            subjectId={subject.id}
            section={section}
            number={firstSectionNumber + sectionIndex}
            filteredSectionIds={filteredSectionIds}
            searchMatchIds={searchMatchIds}
            tree={tree}
            overrides={overrides}
            trash={trash}
            readOnly={readOnly}
            isDistributed={isDistributed}
          />
        ),
      )}
    </SubjectRoot>
  );
};
