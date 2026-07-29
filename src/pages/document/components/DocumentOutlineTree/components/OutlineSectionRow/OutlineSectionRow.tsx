import { GripHorizontal } from 'lucide-react';
import type { FocusEvent, KeyboardEvent } from 'react';
import type { useDocumentTree } from '@/hooks/useDocumentTree';
import { SECTION_STATUS_COLOR } from '../../../../document.constants';
import type { Section, SectionMetaMap } from '../../../../types';
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

// A section's own row. Its sub-sections follow it as rows of their own — the
// outline is flattened so it can be virtualized — and there is no second
// collapse level to hide them behind, only the topic's, which is main's design
// too.
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
    </DropZone>
  );
};
