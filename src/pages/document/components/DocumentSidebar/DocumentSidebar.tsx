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

const PROGRESS_STATUSES = new Set(['טיוטה פנימית', 'בהכנה']);

export interface DocumentSidebarProps {
  tree: ReturnType<typeof useDocumentTree>;
  trash: ReturnType<typeof useDocumentTrash>;
  overrides: ReturnType<typeof useDocumentOverrides>;
  readOnly: boolean;
  isDistributed: boolean;
  onAddEmphasis: () => void;
}

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
      setNewSubjectId(tree.addSubject());
    } else if (action === 'appendix') {
      tree.addSubject(nextAppendixTitle(tree.subjects));
    } else if (action === 'import') {
      setShowImportModal(true);
    } else {
      onAddEmphasis();
    }
  };

  const handleSaveNewSubject = (title: string) => {
    if (!newSubjectId) return;
    if (title) tree.updateSubjectTitle(newSubjectId, title);
    else tree.removeSubject(newSubjectId);
    setNewSubjectId(null);
  };

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
        header={overrides.header}
        status={overrides.status}
        onStatusChange={overrides.setStatus}
        onHeaderChange={overrides.onHeaderChange}
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
