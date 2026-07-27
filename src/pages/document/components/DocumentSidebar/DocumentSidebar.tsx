import { lazy, Suspense, useState } from 'react';
import type { useDocumentTree } from '@/hooks/useDocumentTree';
import type { useDocumentOverrides } from '../../hooks/useDocumentOverrides';
import type { useDocumentTrash } from '../../hooks/useDocumentTrash';
import type { Section } from '../../types';
import { ApprovalWorkflow } from '../ApprovalWorkflow';
import { DocumentOutlineTree } from '../DocumentOutlineTree';
import { ActionBtn, ActionsRow, SidebarRoot, TreeScroll } from './DocumentSidebar.styles';
import { DOCUMENT_SIDEBAR_IDS } from './DocumentSidebar.testids';

const ImportDocModal = lazy(() =>
  import('../ImportDocModal').then((m) => ({ default: m.ImportDocModal })),
);
const RestoreModal = lazy(() =>
  import('../RestoreModal').then((m) => ({ default: m.RestoreModal })),
);

export interface DocumentSidebarProps {
  tree: ReturnType<typeof useDocumentTree>;
  trash: ReturnType<typeof useDocumentTrash>;
  overrides: ReturnType<typeof useDocumentOverrides>;
}

// main's right-hand outline column (Edit.tsx:3793-4099): the document's status
// controls, its outline, and the buttons for importing and restoring sections.
// Owns the two modals its own buttons open, per
// .claude/skills/modal-placement.md — the trigger and the render stay together.
//
// `tree`, `trash` and `overrides` arrive as whole hook objects rather than a dozen
// unpacked callbacks; the outline tree needs most of the tree API once it becomes
// editable, and exploding them here would just move the wall of props.
export const DocumentSidebar = ({ tree, trash, overrides }: DocumentSidebarProps) => {
  const [showImportModal, setShowImportModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);

  const handleOpenImport = () => setShowImportModal(true);
  const handleCloseImport = () => setShowImportModal(false);
  const handleOpenRestore = () => setShowRestoreModal(true);
  const handleCloseRestore = () => setShowRestoreModal(false);

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
    setShowImportModal(false);
  };

  const handleRestoreSections = (entries: typeof trash.entries) => {
    trash.restore(entries);
    setShowRestoreModal(false);
  };

  return (
    <SidebarRoot data-testid={DOCUMENT_SIDEBAR_IDS.root}>
      <ApprovalWorkflow
        docName={overrides.header.name}
        status={overrides.status}
        onStatusChange={overrides.setStatus}
      />

      <TreeScroll>
        <DocumentOutlineTree subjects={tree.subjects} sectionMeta={overrides.mergedSectionMeta} />
      </TreeScroll>

      <ActionsRow>
        <ActionBtn
          type="button"
          data-testid={DOCUMENT_SIDEBAR_IDS.importBtn}
          onClick={handleOpenImport}
        >
          ייבוא סעיפים
        </ActionBtn>
        <ActionBtn
          type="button"
          data-testid={DOCUMENT_SIDEBAR_IDS.restoreBtn}
          onClick={handleOpenRestore}
        >
          שחזור סעיפים ({trash.entries.length})
        </ActionBtn>
      </ActionsRow>

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
