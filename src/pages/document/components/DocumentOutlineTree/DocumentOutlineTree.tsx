import { defaultRangeExtractor, useVirtualizer } from '@tanstack/react-virtual';
import { lazy, Suspense, useRef, useState } from 'react';
import type { useDocumentTree } from '@/hooks/useDocumentTree';
import { useDragReorder } from '@/hooks/useDragReorder';
import type { SectionMetaMap, Subject } from '../../types';
import { OutlineRow } from './components/OutlineRow';
import { useDocumentOutlineTreeAnalytics } from './DocumentOutlineTree.analytics';
import { ESTIMATED_ROW_HEIGHT, ROW_OVERSCAN } from './DocumentOutlineTree.constants';
import { TreeRoot, VirtualList, VirtualRow } from './DocumentOutlineTree.styles';
import { DOCUMENT_OUTLINE_TREE_IDS } from './DocumentOutlineTree.testids';
import type {
  OutlineDeleteTarget,
  OutlineDragApi,
  OutlineEditingApi,
  OutlineExpandApi,
} from './DocumentOutlineTree.types';
import { flattenOutline } from './documentOutlineTree.utils';

const ConfirmDeleteModal = lazy(() =>
  import('./components/ConfirmDeleteModal').then((m) => ({ default: m.ConfirmDeleteModal })),
);

export interface DocumentOutlineTreeProps {
  tree: ReturnType<typeof useDocumentTree>;
  sectionMeta: SectionMetaMap;
  readOnly: boolean;
  isDistributed: boolean;
  newSubjectId: string | null;
  onSaveNewSubject: (title: string) => void;
}

const collectSubjectIds = (subjects: Subject[]) => subjects.map((subject) => subject.id);

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
  const scrollRef = useRef<HTMLElement>(null);
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

  const rows = flattenOutline(tree.subjects, expand.isExpanded, readOnly);

  const editingId = newSubjectId ?? renamingId;
  const editingIndex = editingId ? rows.findIndex((row) => row.key === editingId) : -1;

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    getItemKey: (index) => rows[index].key,
    estimateSize: () => ESTIMATED_ROW_HEIGHT,
    overscan: ROW_OVERSCAN,
    rangeExtractor: (range) => {
      const visible = defaultRangeExtractor(range);
      if (editingIndex < 0 || visible.includes(editingIndex)) return visible;
      return [...visible, editingIndex].sort((a, b) => a - b);
    },
  });

  return (
    <TreeRoot ref={scrollRef} data-testid={DOCUMENT_OUTLINE_TREE_IDS.root}>
      <VirtualList $height={virtualizer.getTotalSize()}>
        {virtualizer.getVirtualItems().map((item) => (
          <VirtualRow
            key={item.key}
            data-index={item.index}
            ref={virtualizer.measureElement}
            $top={item.start}
            $indented={rows[item.index].kind !== 'subject'}
          >
            <OutlineRow
              row={rows[item.index]}
              tree={tree}
              sectionMeta={sectionMeta}
              expand={expand}
              editing={editing}
              drag={drag}
              readOnly={readOnly}
              isDistributed={isDistributed}
            />
          </VirtualRow>
        ))}
      </VirtualList>

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
