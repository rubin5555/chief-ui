import { GripHorizontal } from 'lucide-react';
import type { FocusEvent, KeyboardEvent, MouseEvent } from 'react';
import type { useDocumentTree } from '@/hooks/useDocumentTree';
import { SECTION_STATUS_COLOR } from '../../../../document.constants';
import type { Section, SectionMetaMap } from '../../../../types';
import { useSectionNavigation } from '../../../SectionNavigation';
import { DragHandle, DropZone, StatusDot } from '../../DocumentOutlineTree.shared.styles';
import type { DropEdge, OutlineDragApi, OutlineEditingApi } from '../../DocumentOutlineTree.types';
import { OutlineRowMenu } from '../OutlineRowMenu';
import {
  SectionIndex,
  SectionRenameInput,
  SectionRow,
  SectionTitle,
} from './OutlineSectionRow.styles';
import { OUTLINE_SECTION_ROW_IDS } from './OutlineSectionRow.testids';

const DROP_RADIUS = 8;

// Wide enough for `12.`, because the numbers run on across topics rather than
// restarting at each one — a document of any size reaches two digits, and a
// number wider than its box would sit under the title beside it.
const INDEX_WIDTH = 22;

export interface OutlineSectionRowProps {
  subjectId: string;
  section: Section;
  /** Continuous position in the document, not within the parent topic — as on the sheet. */
  number: number;
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

// A section's own row. Its sub-sections follow it as rows of their own — the
// outline is flattened so it can be virtualized — and there is no second
// collapse level to hide them behind, only the topic's, which is main's design
// too.
export const OutlineSectionRow = ({
  subjectId,
  section,
  number,
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
  const nav = useSectionNavigation();

  // The row already draws itself as a click target — pointer cursor, hover fill —
  // so the whole row navigates rather than just the title. Controls inside it opt
  // out in one line: the menu opens a panel, the rename input takes a caret, and
  // neither is a request to go anywhere.
  const handleRowClick = (event: MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('button, input')) return;
    nav?.revealNode(section.id);
  };

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
        $active={nav?.activeNodeId === section.id}
        {...(nav?.activeNodeId === section.id ? { 'aria-current': 'location' as const } : {})}
        data-testid={OUTLINE_SECTION_ROW_IDS.root(section.id)}
        onClick={handleRowClick}
        {...(readOnly ? {} : drag.sections.getDragHandleProps(section.id))}
      >
        {!readOnly && (
          <DragHandle>
            <GripHorizontal size={12} aria-hidden="true" />
          </DragHandle>
        )}

        <SectionIndex $width={INDEX_WIDTH} data-testid={OUTLINE_SECTION_ROW_IDS.index(section.id)}>
          {number}.
        </SectionIndex>

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
    </DropZone>
  );
};
