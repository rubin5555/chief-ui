import { GripHorizontal } from 'lucide-react';
import type { FocusEvent, KeyboardEvent, MouseEvent } from 'react';
import type { useDocumentTree } from '@/hooks/useDocumentTree';
import { SECTION_STATUS_COLOR } from '../../../../document.constants';
import type { Section, SectionMetaMap } from '../../../../types';
import { useSectionNavigation } from '../../../SectionNavigation';
import {
  AdoptZone,
  DragHandle,
  DropZone,
  StatusDot,
} from '../../DocumentOutlineTree.shared.styles';
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

const INDEX_WIDTH = 22;

export interface OutlineSectionRowProps {
  subjectId: string;
  section: Section;
  number: number;
  dropEdge: DropEdge;
  isDragging: boolean;
  tree: ReturnType<typeof useDocumentTree>;
  sectionMeta: SectionMetaMap;
  editing: OutlineEditingApi;
  drag: OutlineDragApi;
  readOnly: boolean;
  isDistributed: boolean;
}

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
      $settling={drag.sections.settledId === section.id}
      $radius={DROP_RADIUS}
      {...drag.sections.getDropTargetProps(section.id)}
    >
      <AdoptZone
        $active={drag.subSections.dragOverId === section.id}
        $radius={DROP_RADIUS}
        {...drag.subSections.getDropTargetProps(section.id)}
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

          <SectionIndex
            $width={INDEX_WIDTH}
            data-testid={OUTLINE_SECTION_ROW_IDS.index(section.id)}
          >
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
      </AdoptZone>
    </DropZone>
  );
};
