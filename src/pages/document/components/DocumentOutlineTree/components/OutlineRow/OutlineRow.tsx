import type { useDocumentTree } from '@/hooks/useDocumentTree';
import { HE_ALPHA } from '../../../../document.constants';
import type { SectionMetaMap } from '../../../../types';
import type {
  OutlineDragApi,
  OutlineEditingApi,
  OutlineExpandApi,
  OutlineRow as OutlineRowModel,
} from '../../DocumentOutlineTree.types';
import { getDropEdge } from '../../documentOutlineTree.utils';
import { AddNodeLink } from '../AddNodeLink';
import { OutlineSectionRow } from '../OutlineSectionRow';
import { OutlineSubjectRow } from '../OutlineSubjectRow';
import { OutlineSubSectionRow } from '../OutlineSubSectionRow';

export interface OutlineRowProps {
  row: OutlineRowModel;
  tree: ReturnType<typeof useDocumentTree>;
  sectionMeta: SectionMetaMap;
  expand: OutlineExpandApi;
  editing: OutlineEditingApi;
  drag: OutlineDragApi;
  readOnly: boolean;
  isDistributed: boolean;
}

export const OutlineRow = ({
  row,
  tree,
  sectionMeta,
  expand,
  editing,
  drag,
  readOnly,
  isDistributed,
}: OutlineRowProps) => {
  switch (row.kind) {
    case 'subject':
      return (
        <OutlineSubjectRow
          subject={row.subject}
          dropEdge={getDropEdge(
            tree.subjects.map((subject) => subject.id),
            drag.subjects,
            row.subject.id,
          )}
          isDragging={drag.subjects.draggedId === row.subject.id}
          tree={tree}
          expand={expand}
          editing={editing}
          drag={drag}
          readOnly={readOnly}
        />
      );

    case 'section':
      return (
        <OutlineSectionRow
          subjectId={row.subjectId}
          section={row.section}
          number={row.number}
          dropEdge={getDropEdge(row.siblingIds, drag.sections, row.section.id)}
          isDragging={drag.sections.draggedId === row.section.id}
          tree={tree}
          sectionMeta={sectionMeta}
          editing={editing}
          drag={drag}
          readOnly={readOnly}
          isDistributed={isDistributed}
        />
      );

    case 'subSection':
      return (
        <OutlineSubSectionRow
          subjectId={row.subjectId}
          sectionId={row.sectionId}
          subSection={row.subSection}
          index={row.index}
          dropEdge={getDropEdge(row.siblingIds, drag.subSections, row.subSection.id)}
          isDragging={drag.subSections.draggedId === row.subSection.id}
          tree={tree}
          editing={editing}
          drag={drag}
          readOnly={readOnly}
        />
      );

    case 'addSection': {
      const subject = tree.subjects.find(({ id }) => id === row.subjectId);
      const handleAddSection = () => {
        tree.addSection(row.subjectId, `סעיף ${(subject?.sections.length ?? 0) + 1}`);
        editing.onNodeAdded('section');
      };

      return (
        <AddNodeLink
          variant="section"
          parentId={row.subjectId}
          drag={drag}
          onClick={handleAddSection}
        />
      );
    }

    case 'addSubSection': {
      const count =
        tree.subjects
          .find(({ id }) => id === row.subjectId)
          ?.sections.find(({ id }) => id === row.sectionId)?.subSections.length ?? 0;

      const handleAddSubSection = () => {
        tree.addSubSection(row.subjectId, row.sectionId, `תת סעיף ${HE_ALPHA[count] ?? count + 1}`);
        editing.onNodeAdded('subSection');
      };

      return (
        <AddNodeLink
          variant="subSection"
          parentId={row.sectionId}
          drag={drag}
          onClick={handleAddSubSection}
        />
      );
    }
  }
};
