import { lazy, Suspense, useState } from 'react';
import type { useDocumentTree } from '@/hooks/useDocumentTree';
import type { useDocumentOverrides } from '../../hooks/useDocumentOverrides';
import type { useDocumentTrash } from '../../hooks/useDocumentTrash';
import type { Section } from '../../types';
import { ApprovalWorkflow } from '../ApprovalWorkflow';
import { DocumentOutlineTree } from '../DocumentOutlineTree';
import { DocProgressBars } from './components/DocProgressBars';
import { DocStatusHeader } from './components/DocStatusHeader';
import type { AddActionId } from './components/SidebarFabRow';
import { SidebarFabRow } from './components/SidebarFabRow';
import { useDocumentSidebarAnalytics } from './DocumentSidebar.analytics';
import { SidebarDivider, SidebarRoot, StatusBlock } from './DocumentSidebar.styles';
import { DOCUMENT_SIDEBAR_IDS } from './DocumentSidebar.testids';
import { nextAppendixTitle } from './documentSidebar.utils';

const ImportDocModal = lazy(() =>
  import('../ImportDocModal').then((m) => ({ default: m.ImportDocModal })),
);
const RestoreModal = lazy(() =>
  import('../RestoreModal').then((m) => ({ default: m.RestoreModal })),
);

/** Statuses whose progress main reports, which are exactly the two draft ones (Edit.tsx:3826). */
const PROGRESS_STATUSES = new Set(['טיוטה פנימית', 'בהכנה']);

export interface DocumentSidebarProps {
  tree: ReturnType<typeof useDocumentTree>;
  trash: ReturnType<typeof useDocumentTrash>;
  overrides: ReturnType<typeof useDocumentOverrides>;
  /**
   * Both derived from the document's status by DocumentCanvas, which is above
   * this column and the paper — deriving them again here would be a second answer
   * to the same question.
   */
  readOnly: boolean;
  isDistributed: boolean;
  onAddEmphasis: () => void;
}

// main's right-hand outline column (Edit.tsx:3793): the document's status, its
// progress, the buttons that move it along, its outline, and the two round
// actions at the foot.
//
// Owns the two modals its own buttons open, per
// .claude/skills/modal-placement.md — the trigger and the render stay together.
//
// `tree`, `trash` and `overrides` arrive as whole hook objects rather than a dozen
// unpacked callbacks; the outline tree uses most of the tree API, and exploding
// them here would just move the wall of props.
export const DocumentSidebar = ({
  tree,
  trash,
  overrides,
  readOnly,
  isDistributed,
  onAddEmphasis,
}: DocumentSidebarProps) => {
  const [showImportModal, setShowImportModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [newSubjectId, setNewSubjectId] = useState<string | null>(null);
  const { trackAddActionChosen, trackImportCompleted, trackRestoreCompleted } =
    useDocumentSidebarAnalytics();

  const handleCloseImport = () => setShowImportModal(false);
  const handleOpenRestore = () => setShowRestoreModal(true);
  const handleCloseRestore = () => setShowRestoreModal(false);

  const handleAddAction = (action: AddActionId) => {
    trackAddActionChosen(action);

    if (action === 'subject') {
      // Created empty and immediately handed to the outline's rename input, so a
      // new topic is named where it will live rather than in a dialog.
      setNewSubjectId(tree.addSubject());
    } else if (action === 'appendix') {
      tree.addSubject(nextAppendixTitle(tree.subjects));
    } else if (action === 'import') {
      setShowImportModal(true);
    } else {
      onAddEmphasis();
    }
  };

  // Empty means the topic was never named, so it goes away again — see
  // DocumentOutlineTree's saveNew comment.
  const handleSaveNewSubject = (title: string) => {
    if (!newSubjectId) return;
    if (title) tree.updateSubjectTitle(newSubjectId, title);
    else tree.removeSubject(newSubjectId);
    setNewSubjectId(null);
  };

  // Imported sections land under the tree's first subject — there's no "pick a
  // target subject" step yet (see ImportDocModal's doc comment). Built via
  // `tree.reset` rather than addSection+rename so each new section carries its
  // real imported title from the moment it exists.
  const handleImportSections = (sectionTitles: string[]) => {
    const firstSubject = tree.subjects[0];
    if (firstSubject) {
      const newSections: Section[] = sectionTitles.map((title) => ({
        id: `section-${self.crypto.randomUUID()}`,
        title,
        content: '',
        permissions: { approvers: [], editors: [] },
        subSections: [],
      }));
      tree.reset(
        tree.subjects.map((subject) =>
          subject.id === firstSubject.id
            ? { ...subject, sections: [...subject.sections, ...newSections] }
            : subject,
        ),
      );
    }
    trackImportCompleted(sectionTitles.length);
    setShowImportModal(false);
  };

  const handleRestoreSections = (entries: typeof trash.entries) => {
    trash.restore(entries);
    trackRestoreCompleted(entries.length);
    setShowRestoreModal(false);
  };

  return (
    <SidebarRoot dir="rtl" data-testid={DOCUMENT_SIDEBAR_IDS.root}>
      <StatusBlock>
        <DocStatusHeader status={overrides.status} />
        {PROGRESS_STATUSES.has(overrides.status) && (
          <DocProgressBars subjects={tree.subjects} sectionMeta={overrides.mergedSectionMeta} />
        )}
      </StatusBlock>

      <ApprovalWorkflow
        docName={overrides.header.name}
        status={overrides.status}
        onStatusChange={overrides.setStatus}
      />

      <SidebarDivider />

      <DocumentOutlineTree
        tree={tree}
        sectionMeta={overrides.mergedSectionMeta}
        readOnly={readOnly}
        isDistributed={isDistributed}
        newSubjectId={newSubjectId}
        onSaveNewSubject={handleSaveNewSubject}
      />

      {!readOnly && (
        <SidebarFabRow onRestoreClick={handleOpenRestore} onAddAction={handleAddAction} />
      )}

      <Suspense fallback={null}>
        {showImportModal && (
          <ImportDocModal onClose={handleCloseImport} onImport={handleImportSections} />
        )}

        {showRestoreModal && (
          <RestoreModal
            deletedSections={trash.entries}
            onClose={handleCloseRestore}
            onRestore={handleRestoreSections}
          />
        )}
      </Suspense>
    </SidebarRoot>
  );
};
