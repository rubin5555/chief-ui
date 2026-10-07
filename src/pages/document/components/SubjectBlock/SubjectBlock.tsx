import type { useDocumentTree } from '@/hooks/useDocumentTree';
import type { Subject } from '../../types';
import { SubjectHeaderRow, SubjectRoot } from '../components.shared.styles';
import { NodeTitleField } from '../NodeTitleField';
import { SUBJECT_BLOCK_IDS } from './SubjectBlock.testids';

export interface SubjectBlockProps {
  subject: Subject;
  searchMatchIds: Set<string>;
  tree: ReturnType<typeof useDocumentTree>;
  isFirst?: boolean;
}

// ponytail: SubjectBlock is a single virtual item rendering only the topic header row. Sections are virtualized independently.
export const SubjectBlock = ({ subject, searchMatchIds, tree, isFirst }: SubjectBlockProps) => {
  const handleTitleChange = (title: string) => tree.updateSubjectTitle(subject.id, title);

  return (
    <SubjectRoot
      $highlighted={searchMatchIds.has(subject.id)}
      $isFirst={isFirst}
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
    </SubjectRoot>
  );
};
