import { lazy, Suspense, useState } from 'react';
import type { useDocumentTree } from '@/hooks/useDocumentTree';
import { useDragReorder } from '@/hooks/useDragReorder';
import type { SectionMetaMap, Subject } from '../../types';
import { OutlineSubjectRow } from './components/OutlineSubjectRow';
import { useDocumentOutlineTreeAnalytics } from './DocumentOutlineTree.analytics';
import { SubjectList, TreeRoot } from './DocumentOutlineTree.styles';
import { DOCUMENT_OUTLINE_TREE_IDS } from './DocumentOutlineTree.testids';
import type {
  OutlineDeleteTarget,
  OutlineDragApi,
  OutlineEditingApi,
  OutlineExpandApi,
} from './DocumentOutlineTree.types';
import { getDropEdge } from './documentOutlineTree.utils';

const ConfirmDeleteModal = lazy(() =>
  import('./components/ConfirmDeleteModal').then((m) => ({ default: m.ConfirmDeleteModal })),
);

export interface DocumentOutlineTreeProps {
  tree: ReturnType<typeof useDocumentTree>;
  sectionMeta: SectionMetaMap;
  readOnly: boolean;
  isDistributed: boolean;
  /**
   * A topic just created from the sidebar's `+`, which opens here in a rename
   * input. Owned by DocumentSidebar rather than by this component because that is
   * where the button creating it lives — the tree only renders the consequence.
   */
  newSubjectId: string | null;
  /** Empty title means the topic was abandoned; DocumentSidebar drops it again. */
  onSaveNewSubject: (title: string) => void;
}

const collectSubjectIds = (subjects: Subject[]) => subjects.map((subject) => subject.id);

// main's editable outline (Edit.tsx:3885): three levels, each row draggable,
// renameable and deletable.
//
// Every piece of editing state lives here rather than in the rows, because every
// piece of it is single-valued — one row renames at a time, one delete is pending
// at a time — and a row can't know whether some other row is mid-edit. The rows
// receive it as two objects, not a dozen callbacks
// (.claude/skills/react-engineering.md, "Shrink Prop Lists").
//
// The three useDragReorder instances are per *level*, not per parent: each
// reorder* is already membership-scoped to the parent holding both ids, so one
// instance covers every topic's sections at once. That is what replaces main's six
// useState pairs and ~65 lines of drag bookkeeping (3249-3315).
export const DocumentOutlineTree = ({
  tree,
  sectionMeta,
  readOnly,
  isDistributed,
  newSubjectId,
  onSaveNewSubject,
}: DocumentOutlineTreeProps) => {
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(
    () => new Set(collectSubjectIds(tree.subjects)),
  );
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<OutlineDeleteTarget | null>(null);
  const { trackNodeAdded, trackNodeDeleted, trackNodesReordered, trackRenameStarted } =
    useDocumentOutlineTreeAnalytics();

  const drag: OutlineDragApi = {
    subjects: useDragReorder((draggedId, targetId) => {
      tree.reorderSubjects(draggedId, targetId);
      trackNodesReordered('subject');
    }),
    sections: useDragReorder((draggedId, targetId) => {
      tree.reorderSections(draggedId, targetId);
      trackNodesReordered('section');
    }),
    subSections: useDragReorder((draggedId, targetId) => {
      tree.reorderSubSections(draggedId, targetId);
      trackNodesReordered('subSection');
    }),
  };

  const expand: OutlineExpandApi = {
    isExpanded: (subjectId) => expandedSubjects.has(subjectId),
    toggle: (subjectId) =>
      setExpandedSubjects((prev) => {
        const next = new Set(prev);
        if (!next.delete(subjectId)) next.add(subjectId);
        return next;
      }),
  };

  const startRename = (id: string) => {
    trackRenameStarted();
    setRenamingId(id);
  };

  const editing: OutlineEditingApi = {
    renamingId,
    editingNewId: newSubjectId,
    startRename,
    stopRename: () => setRenamingId(null),
    saveNew: onSaveNewSubject,
    requestDelete: setPendingDelete,
    onNodeAdded: trackNodeAdded,
  };

  const handleConfirmDelete = () => {
    if (!pendingDelete) return;
    pendingDelete.onConfirm();
    trackNodeDeleted(pendingDelete.level);
  };

  const handleCloseDelete = () => setPendingDelete(null);

  const subjectIds = collectSubjectIds(tree.subjects);

  return (
    <TreeRoot data-testid={DOCUMENT_OUTLINE_TREE_IDS.root}>
      <SubjectList>
        {tree.subjects.map((subject) => (
          <OutlineSubjectRow
            key={subject.id}
            subject={subject}
            dropEdge={getDropEdge(subjectIds, drag.subjects, subject.id)}
            isDragging={drag.subjects.draggedId === subject.id}
            tree={tree}
            sectionMeta={sectionMeta}
            expand={expand}
            editing={editing}
            drag={drag}
            readOnly={readOnly}
            isDistributed={isDistributed}
          />
        ))}
      </SubjectList>

      <Suspense fallback={null}>
        {pendingDelete && (
          <ConfirmDeleteModal
            target={pendingDelete}
            onConfirm={handleConfirmDelete}
            onClose={handleCloseDelete}
          />
        )}
      </Suspense>
    </TreeRoot>
  );
};
