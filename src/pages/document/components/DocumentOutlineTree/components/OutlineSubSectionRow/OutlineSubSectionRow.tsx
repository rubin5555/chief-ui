import { GripHorizontal } from 'lucide-react';
import type { FocusEvent, KeyboardEvent, MouseEvent } from 'react';
import type { useDocumentTree } from '@/hooks/useDocumentTree';
import { HE_ALPHA } from '../../../../document.constants';
import type { SubSection } from '../../../../types';
import { useSectionNavigation } from '../../../SectionNavigation';
import { DragHandle, DropZone } from '../../DocumentOutlineTree.shared.styles';
import type { DropEdge, OutlineDragApi, OutlineEditingApi } from '../../DocumentOutlineTree.types';
import { OutlineRowMenu } from '../OutlineRowMenu';
import {
  SubSectionIndex,
  SubSectionRenameInput,
  SubSectionRow,
  SubSectionTitle,
} from './OutlineSubSectionRow.styles';
import { OUTLINE_SUB_SECTION_ROW_IDS } from './OutlineSubSectionRow.testids';

const DROP_RADIUS = 6;
const INDEX_WIDTH = 20;

export interface OutlineSubSectionRowProps {
  subjectId: string;
  sectionId: string;
  subSection: SubSection;
  index: number;
  dropEdge: DropEdge;
  isDragging: boolean;
  tree: ReturnType<typeof useDocumentTree>;
  editing: OutlineEditingApi;
  drag: OutlineDragApi;
  readOnly: boolean;
}

export const OutlineSubSectionRow = ({
  subjectId,
  sectionId,
  subSection,
  index,
  dropEdge,
  isDragging,
  tree,
  editing,
  drag,
  readOnly,
}: OutlineSubSectionRowProps) => {
  const isRenaming = editing.renamingId === subSection.id;
  const nav = useSectionNavigation();

  const handleRowClick = (event: MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('button, input')) return;
    nav?.revealNode(subSection.id);
  };

  const commitRename = (event: FocusEvent<HTMLInputElement>) => {
    tree.updateSubSectionTitle(
      subjectId,
      sectionId,
      subSection.id,
      event.target.value || subSection.title,
    );
    editing.stopRename();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === 'Escape') event.currentTarget.blur();
  };

  const handleStartRename = () => editing.startRename(subSection.id);

  const handleRequestDelete = () =>
    editing.requestDelete({
      level: 'subSection',
      onConfirm: () => tree.removeSubSection(subjectId, sectionId, subSection.id),
    });

  return (
    <DropZone
      $edge={dropEdge}
      $dragging={isDragging}
      $settling={drag.subSections.settledId === subSection.id}
      $radius={DROP_RADIUS}
      {...drag.subSections.getDropTargetProps(subSection.id)}
    >
      <SubSectionRow
        dir="rtl"
        $active={nav?.activeNodeId === subSection.id}
        {...(nav?.activeNodeId === subSection.id ? { 'aria-current': 'location' as const } : {})}
        data-testid={OUTLINE_SUB_SECTION_ROW_IDS.root(subSection.id)}
        onClick={handleRowClick}
        {...(readOnly ? {} : drag.subSections.getDragHandleProps(subSection.id))}
      >
        {!readOnly && (
          <DragHandle>
            <GripHorizontal size={12} aria-hidden="true" />
          </DragHandle>
        )}

        <SubSectionIndex $width={INDEX_WIDTH}>{HE_ALPHA[index] ?? index + 1}.</SubSectionIndex>

        {isRenaming ? (
          <SubSectionRenameInput
            autoFocus
            defaultValue={subSection.title}
            dir="rtl"
            aria-label="שם תת הסעיף"
            data-testid={OUTLINE_SUB_SECTION_ROW_IDS.renameInput(subSection.id)}
            onBlur={commitRename}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <SubSectionTitle>{subSection.title}</SubSectionTitle>
        )}

        {!readOnly && (
          <OutlineRowMenu
            nodeId={subSection.id}
            iconSize={12}
            onRename={handleStartRename}
            onDelete={handleRequestDelete}
          />
        )}
      </SubSectionRow>
    </DropZone>
  );
};
