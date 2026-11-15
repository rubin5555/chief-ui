import { ChevronLeft, GripHorizontal } from 'lucide-react';
import type { FocusEvent, KeyboardEvent } from 'react';
import type { useDocumentTree } from '@/hooks/useDocumentTree';
import type { Subject } from '../../../../types';
import { AdoptZone, DragHandle, DropZone } from '../../DocumentOutlineTree.shared.styles';
import type {
  DropEdge,
  OutlineDragApi,
  OutlineEditingApi,
  OutlineExpandApi,
} from '../../DocumentOutlineTree.types';
import { OutlineRowMenu } from '../OutlineRowMenu';
import { Chevron, SubjectRenameInput, SubjectRow, SubjectTitle } from './OutlineSubjectRow.styles';
import { OUTLINE_SUBJECT_ROW_IDS } from './OutlineSubjectRow.testids';

const DROP_RADIUS = 10;

export interface OutlineSubjectRowProps {
  subject: Subject;
  dropEdge: DropEdge;
  isDragging: boolean;
  tree: ReturnType<typeof useDocumentTree>;
  expand: OutlineExpandApi;
  editing: OutlineEditingApi;
  drag: OutlineDragApi;
  readOnly: boolean;
}

export const OutlineSubjectRow = ({
  subject,
  dropEdge,
  isDragging,
  tree,
  expand,
  editing,
  drag,
  readOnly,
}: OutlineSubjectRowProps) => {
  const isExpanded = expand.isExpanded(subject.id);
  const isNew = editing.editingNewId === subject.id;
  const isRenaming = editing.renamingId === subject.id;

  const handleToggle = () => {
    if (!isNew) expand.toggle(subject.id);
  };

  const commitRename = (event: FocusEvent<HTMLInputElement>) => {
    tree.updateSubjectTitle(subject.id, event.target.value || subject.title);
    editing.stopRename();
  };

  const commitNew = (event: FocusEvent<HTMLInputElement>) =>
    editing.saveNew(event.target.value.trim());

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === 'Escape') event.currentTarget.blur();
  };

  const handleStartRename = () => editing.startRename(subject.id);

  const handleRequestDelete = () =>
    editing.requestDelete({
      level: 'subject',
      onConfirm: () => tree.removeSubject(subject.id),
    });

  return (
    <DropZone
      $edge={dropEdge}
      $dragging={isDragging}
      $settling={drag.subjects.settledId === subject.id}
      $radius={DROP_RADIUS}
      data-testid={OUTLINE_SUBJECT_ROW_IDS.root(subject.id)}
      {...drag.subjects.getDropTargetProps(subject.id)}
    >
      <AdoptZone
        $active={drag.sections.dragOverId === subject.id}
        $radius={DROP_RADIUS}
        {...drag.sections.getDropTargetProps(subject.id)}
      >
        <SubjectRow
          dir="rtl"
          data-testid={OUTLINE_SUBJECT_ROW_IDS.toggle(subject.id)}
          onClick={handleToggle}
          {...(readOnly ? {} : drag.subjects.getDragHandleProps(subject.id))}
        >
          {!readOnly && (
            <DragHandle>
              <GripHorizontal size={14} aria-hidden="true" />
            </DragHandle>
          )}

          <Chevron $expanded={isExpanded}>
            <ChevronLeft size={14} aria-hidden="true" />
          </Chevron>

          {isNew || isRenaming ? (
            <SubjectRenameInput
              autoFocus
              defaultValue={subject.title}
              dir="rtl"
              placeholder={isNew ? 'שם הנושא...' : undefined}
              aria-label="שם הנושא"
              data-testid={OUTLINE_SUBJECT_ROW_IDS.renameInput(subject.id)}
              onBlur={isNew ? commitNew : commitRename}
              onKeyDown={handleKeyDown}
            />
          ) : (
            <SubjectTitle>{subject.title}</SubjectTitle>
          )}

          {!readOnly && (
            <OutlineRowMenu
              nodeId={subject.id}
              onRename={handleStartRename}
              onDelete={handleRequestDelete}
            />
          )}
        </SubjectRow>
      </AdoptZone>
    </DropZone>
  );
};
