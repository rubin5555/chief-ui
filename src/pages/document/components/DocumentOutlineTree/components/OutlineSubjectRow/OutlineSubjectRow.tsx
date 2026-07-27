import { ChevronLeft, GripHorizontal } from 'lucide-react';
import type { FocusEvent, KeyboardEvent } from 'react';
import type { useDocumentTree } from '@/hooks/useDocumentTree';
import type { SectionMetaMap, Subject } from '../../../../types';
import { DragHandle, DropZone } from '../../DocumentOutlineTree.shared.styles';
import type {
  DropEdge,
  OutlineDragApi,
  OutlineEditingApi,
  OutlineExpandApi,
} from '../../DocumentOutlineTree.types';
import { getDropEdge } from '../../documentOutlineTree.utils';
import { AddNodeLink } from '../AddNodeLink';
import { OutlineRowMenu } from '../OutlineRowMenu';
import { OutlineSectionRow } from '../OutlineSectionRow';
import {
  Chevron,
  SectionList,
  SubjectRenameInput,
  SubjectRow,
  SubjectTitle,
} from './OutlineSubjectRow.styles';
import { OUTLINE_SUBJECT_ROW_IDS } from './OutlineSubjectRow.testids';

const DROP_RADIUS = 10;

export interface OutlineSubjectRowProps {
  subject: Subject;
  dropEdge: DropEdge;
  isDragging: boolean;
  tree: ReturnType<typeof useDocumentTree>;
  sectionMeta: SectionMetaMap;
  expand: OutlineExpandApi;
  editing: OutlineEditingApi;
  drag: OutlineDragApi;
  readOnly: boolean;
  isDistributed: boolean;
}

// A topic and, when it's open, everything beneath it.
//
// This is the only level that collapses, and the only one whose row is itself the
// toggle — which is why every interactive thing inside it (the menu, the rename
// input, the add links) stops its own click from bubbling.
export const OutlineSubjectRow = ({
  subject,
  dropEdge,
  isDragging,
  tree,
  sectionMeta,
  expand,
  editing,
  drag,
  readOnly,
  isDistributed,
}: OutlineSubjectRowProps) => {
  const isExpanded = expand.isExpanded(subject.id);
  const isNew = editing.editingNewId === subject.id;
  const isRenaming = editing.renamingId === subject.id;
  const sectionIds = subject.sections.map((section) => section.id);

  // A topic being named for the first time isn't expandable yet — clicking the row
  // it lives in would collapse the input away mid-edit (main's guard, Edit.tsx:3911).
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

  // main names a new section for its position (Edit.tsx:4059) so the row is
  // readable the moment it appears, rather than an empty line you have to fill in.
  const handleAddSection = () => {
    tree.addSection(subject.id, `סעיף ${subject.sections.length + 1}`);
    editing.onNodeAdded('section');
  };

  return (
    <DropZone
      $edge={dropEdge}
      $dragging={isDragging}
      $radius={DROP_RADIUS}
      data-testid={OUTLINE_SUBJECT_ROW_IDS.root(subject.id)}
      {...drag.subjects.getDropTargetProps(subject.id)}
    >
      {/* The whole row toggles, as main's does. It can't be a <button>: it
          contains the rename input and the menu button, and nesting those inside
          one would break both. */}
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

      {isExpanded && (
        <SectionList>
          {subject.sections.map((section, index) => (
            <OutlineSectionRow
              key={section.id}
              subjectId={subject.id}
              section={section}
              index={index}
              dropEdge={getDropEdge(sectionIds, drag.sections, section.id)}
              isDragging={drag.sections.draggedId === section.id}
              tree={tree}
              sectionMeta={sectionMeta}
              editing={editing}
              drag={drag}
              readOnly={readOnly}
              isDistributed={isDistributed}
            />
          ))}

          {!readOnly && (
            <AddNodeLink variant="section" parentId={subject.id} onClick={handleAddSection} />
          )}
        </SectionList>
      )}
    </DropZone>
  );
};
