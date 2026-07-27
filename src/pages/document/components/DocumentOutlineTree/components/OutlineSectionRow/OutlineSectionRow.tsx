import { GripHorizontal } from 'lucide-react';
import type { FocusEvent, KeyboardEvent } from 'react';
import type { useDocumentTree } from '@/hooks/useDocumentTree';
import { HE_ALPHA, SECTION_STATUS_COLOR } from '../../../../document.constants';
import type { Section, SectionMetaMap } from '../../../../types';
import { DragHandle, DropZone, StatusDot } from '../../DocumentOutlineTree.shared.styles';
import type { DropEdge, OutlineDragApi, OutlineEditingApi } from '../../DocumentOutlineTree.types';
import { getDropEdge } from '../../documentOutlineTree.utils';
import { AddNodeLink } from '../AddNodeLink';
import { OutlineRowMenu } from '../OutlineRowMenu';
import { OutlineSubSectionRow } from '../OutlineSubSectionRow';
import {
  SectionIndex,
  SectionRenameInput,
  SectionRow,
  SectionTitle,
  SubSectionList,
} from './OutlineSectionRow.styles';
import { OUTLINE_SECTION_ROW_IDS } from './OutlineSectionRow.testids';

const DROP_RADIUS = 8;
const INDEX_WIDTH = 16;

export interface OutlineSectionRowProps {
  subjectId: string;
  section: Section;
  index: number;
  dropEdge: DropEdge;
  isDragging: boolean;
  tree: ReturnType<typeof useDocumentTree>;
  sectionMeta: SectionMetaMap;
  editing: OutlineEditingApi;
  drag: OutlineDragApi;
  readOnly: boolean;
  /** A distributed document shows no per-section status — there is nothing left to track. */
  isDistributed: boolean;
}

// A section in the outline, plus everything under it: its sub-sections and the
// link that adds another one.
//
// Sub-sections are always listed when the topic is open. main renders them the
// same way — there is no second collapse level, only the topic's.
export const OutlineSectionRow = ({
  subjectId,
  section,
  index,
  dropEdge,
  isDragging,
  tree,
  sectionMeta,
  editing,
  drag,
  readOnly,
  isDistributed,
}: OutlineSectionRowProps) => {
  const isRenaming = editing.renamingId === section.id;
  const subSectionIds = section.subSections.map((subSection) => subSection.id);

  const commitRename = (event: FocusEvent<HTMLInputElement>) => {
    tree.updateSectionTitle(subjectId, section.id, event.target.value || section.title);
    editing.stopRename();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === 'Escape') event.currentTarget.blur();
  };

  const handleStartRename = () => editing.startRename(section.id);

  const handleRequestDelete = () =>
    editing.requestDelete({
      level: 'section',
      onConfirm: () => tree.removeSection(subjectId, section.id),
    });

  // main names a new sub-section for the letter it will render under
  // (Edit.tsx:4048), so it reads as `תת סעיף ג׳` from the moment it exists rather
  // than as an empty row waiting to be filled in.
  const handleAddSubSection = () => {
    tree.addSubSection(
      subjectId,
      section.id,
      `תת סעיף ${HE_ALPHA[section.subSections.length] ?? section.subSections.length + 1}`,
    );
    editing.onNodeAdded('subSection');
  };

  const status = sectionMeta[section.id]?.status ?? 'idle';

  return (
    <DropZone
      $edge={dropEdge}
      $dragging={isDragging}
      $radius={DROP_RADIUS}
      {...drag.sections.getDropTargetProps(section.id)}
    >
      <SectionRow
        dir="rtl"
        data-testid={OUTLINE_SECTION_ROW_IDS.root(section.id)}
        {...(readOnly ? {} : drag.sections.getDragHandleProps(section.id))}
      >
        {!readOnly && (
          <DragHandle>
            <GripHorizontal size={12} aria-hidden="true" />
          </DragHandle>
        )}

        <SectionIndex $width={INDEX_WIDTH}>{index + 1}.</SectionIndex>

        {isRenaming ? (
          <SectionRenameInput
            autoFocus
            defaultValue={section.title}
            dir="rtl"
            aria-label="שם הסעיף"
            data-testid={OUTLINE_SECTION_ROW_IDS.renameInput(section.id)}
            onBlur={commitRename}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <SectionTitle>{section.title}</SectionTitle>
        )}

        {!isDistributed && (
          <StatusDot
            $color={SECTION_STATUS_COLOR[status]}
            data-testid={OUTLINE_SECTION_ROW_IDS.statusDot(section.id)}
          />
        )}

        {!readOnly && (
          <OutlineRowMenu
            nodeId={section.id}
            iconSize={12}
            onRename={handleStartRename}
            onDelete={handleRequestDelete}
          />
        )}
      </SectionRow>

      <SubSectionList>
        {section.subSections.map((subSection, subIndex) => (
          <OutlineSubSectionRow
            key={subSection.id}
            subjectId={subjectId}
            sectionId={section.id}
            subSection={subSection}
            index={subIndex}
            dropEdge={getDropEdge(subSectionIds, drag.subSections, subSection.id)}
            isDragging={drag.subSections.draggedId === subSection.id}
            tree={tree}
            editing={editing}
            drag={drag}
            readOnly={readOnly}
          />
        ))}
      </SubSectionList>

      {!readOnly && (
        <AddNodeLink variant="subSection" parentId={section.id} onClick={handleAddSubSection} />
      )}
    </DropZone>
  );
};
