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
  /** Position within its section, which is what turns into a Hebrew letter. */
  index: number;
  dropEdge: DropEdge;
  isDragging: boolean;
  tree: ReturnType<typeof useDocumentTree>;
  editing: OutlineEditingApi;
  drag: OutlineDragApi;
  readOnly: boolean;
}

// The tree's deepest row: `א.`, a title, and a menu.
//
// It writes its own title change, because it is the only component holding all
// three ids `updateSubSectionTitle` needs — see OutlineEditingApi.stopRename.
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

  // Same rule as the section row above it: the row navigates, its own controls
  // don't. See OutlineSectionRow.
  const handleRowClick = (event: MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('button, input')) return;
    nav?.revealNode(subSection.id);
  };

  const commitRename = (event: FocusEvent<HTMLInputElement>) => {
    // An emptied field keeps the old title rather than leaving an unnamed row —
    // main's `e.target.value || sb.title` (Edit.tsx:4026).
    tree.updateSubSectionTitle(
      subjectId,
      sectionId,
      subSection.id,
      event.target.value || subSection.title,
    );
    editing.stopRename();
  };

  // Enter and Escape both blur, so both commit. That is main's behaviour, not an
  // oversight: this input has no cancel, and clearing the field is how you back out.
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

        <SubSectionIndex $width={INDEX_WIDTH}>{HE_ALPHA[index]}.</SubSectionIndex>

        {isRenaming ? (
          <SubSectionRenameInput
            // The row becomes this input on demand, so focus follows the request:
            // asking to rename and then having to click the field you just
            // summoned would be the odd behaviour.
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
