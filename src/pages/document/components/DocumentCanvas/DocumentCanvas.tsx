import { getRouteApi } from '@tanstack/react-router';
import { lazy, Suspense, useState } from 'react';
import { PROFILE_FALLBACK, useProfile } from '@/api/profile';
import { ContentEditorProvider, ContentEditorToolbar } from '@/components/ui/ContentEditor';
import { CollabProvider } from '@/context/CollabContext';
import { useDocumentTree } from '@/hooks/useDocumentTree';
import type { DocumentDto, NodePermissions, Section, SectionStatus } from '../../types';
import { DEFAULT_CLASSIFICATION_LEVEL } from '../../types';
import { ApprovalWorkflow } from '../ApprovalWorkflow';
import { ComparisonBar } from '../ComparisonBar';
import { DocHeaderCard } from '../DocHeaderCard';
import { DocumentOutlineTree } from '../DocumentOutlineTree';
import { EditableSectionBody } from '../EditableSectionBody';
import { FilterPanel } from '../FilterPanel';
import type { DeletedSectionEntry } from '../RestoreModal';
import {
  CanvasColumn,
  PageInner,
  SidebarActionBtn,
  SidebarActionsRow,
  SidebarColumn,
  SubjectHeading,
  SubjectSection,
  ToolbarRow,
} from './DocumentCanvas.styles';
import { DOCUMENT_CANVAS_IDS } from './DocumentCanvas.testids';
import { useDocumentOverrides } from './useDocumentOverrides';

const ImportDocModal = lazy(() =>
  import('../ImportDocModal').then((m) => ({ default: m.ImportDocModal })),
);
const RestoreModal = lazy(() =>
  import('../RestoreModal').then((m) => ({ default: m.RestoreModal })),
);

const routeApi = getRouteApi('/document/$id');

export interface DocumentCanvasProps {
  data: DocumentDto;
}

// Only mounts once `data` is loaded (DocumentPage gates on that), so
// useDocumentTree's initial-state seed is never stuck on an empty/stale
// array from a render that ran before the document had loaded.
export const DocumentCanvas = ({ data }: DocumentCanvasProps) => {
  const tree = useDocumentTree(data.subjects);
  const { status, setStatus, header, onHeaderChange, getMeta, patchMeta, mergedSectionMeta } =
    useDocumentOverrides(data);
  const { statuses } = routeApi.useSearch();

  // Phase 8: real-time collab needs a real signed-in user id, which dev has
  // no auth/session concept for yet — reuses the same useProfile()/
  // PROFILE_FALLBACK identity ProfilePage already passes as
  // TemplatesPanel's currentUserId, rather than inventing a separate
  // placeholder. ContentEditorProvider (below) degrades to local-only
  // activation with no lock gating/remote cursors if this were ever absent.
  const { data: profileData } = useProfile();
  const profile = profileData ?? PROFILE_FALLBACK;
  const activeStatusFilter = statuses ? statuses.split(',') : [];

  const [trash, setTrash] = useState<DeletedSectionEntry[]>([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);

  // Bound to one subject/section at a time — every EditableSectionBody
  // receives an already-curried callback, never a raw id to re-curry
  // itself with. Mirrors TemplateModal's DocumentPreview.tsx.
  const handleSectionContentChange = (subjectId: string, sectionId: string) => (value: string) =>
    tree.updateSectionContent(subjectId, sectionId, value);

  const handleSubSectionContentChange =
    (subjectId: string, sectionId: string, subSectionId: string) => (value: string) =>
      tree.updateSubSectionContent(subjectId, sectionId, subSectionId, value);

  const handleSectionPermissionsChange =
    (subjectId: string, sectionId: string, permissions: NodePermissions) =>
    (role: 'approvers' | 'editors', value: string[]) =>
      tree.updateSectionPermissions(subjectId, sectionId, { ...permissions, [role]: value });

  const handleSubSectionPermissionsChange =
    (subjectId: string, sectionId: string, subSectionId: string, permissions: NodePermissions) =>
    (role: 'approvers' | 'editors', value: string[]) =>
      tree.updateSubSectionPermissions(subjectId, sectionId, subSectionId, {
        ...permissions,
        [role]: value,
      });

  const handleToggleHidden = (id: string) => () => patchMeta(id, { hidden: !getMeta(id).hidden });

  const handleToggleClassified = (id: string) => () => {
    const current = getMeta(id).classification;
    patchMeta(id, {
      classification: current.level
        ? { level: null, viewerIds: [] }
        : { level: DEFAULT_CLASSIFICATION_LEVEL, viewerIds: [] },
    });
  };

  const handleChangeClassificationViewers = (id: string) => (viewerIds: string[]) =>
    patchMeta(id, { classification: { ...getMeta(id).classification, viewerIds } });

  // Unlike other deletes, this one snapshots the section into `trash` first —
  // real (not mock-disconnected) data for RestoreModal. Sub-section deletes
  // stay a plain removal (see RestoreModal's doc comment for the scope call).
  const handleRemoveSection = (subjectId: string, section: Section) => () => {
    setTrash((prev) => [...prev, { subjectId, section }]);
    tree.removeSection(subjectId, section.id);
  };

  const handleRemoveSubSection =
    (subjectId: string, sectionId: string, subSectionId: string) => () =>
      tree.removeSubSection(subjectId, sectionId, subSectionId);

  const handleOpenImport = () => setShowImportModal(true);
  const handleCloseImport = () => setShowImportModal(false);
  const handleOpenRestore = () => setShowRestoreModal(true);
  const handleCloseRestore = () => setShowRestoreModal(false);

  // Imported sections land under the tree's first subject — there's no
  // "pick a target subject" step yet (see ImportDocModal's doc comment).
  // Built directly via `tree.reset` rather than addSection+rename, so each
  // new section carries its real imported title from the moment it exists.
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
      const nextSubjects = tree.subjects.map((subject) =>
        subject.id === firstSubject.id
          ? { ...subject, sections: [...subject.sections, ...newSections] }
          : subject,
      );
      tree.reset(nextSubjects);
    }
    setShowImportModal(false);
  };

  const handleRestoreSections = (entries: DeletedSectionEntry[]) => {
    const nextSubjects = tree.subjects.map((subject) => {
      const toRestore = entries
        .filter((entry) => entry.subjectId === subject.id)
        .map((entry) => entry.section);
      return toRestore.length > 0
        ? { ...subject, sections: [...subject.sections, ...toRestore] }
        : subject;
    });
    tree.reset(nextSubjects);
    const restoredIds = new Set(entries.map((entry) => entry.section.id));
    setTrash((prev) => prev.filter((entry) => !restoredIds.has(entry.section.id)));
    setShowRestoreModal(false);
  };

  const matchesStatusFilter = (status: SectionStatus) =>
    activeStatusFilter.length === 0 || activeStatusFilter.includes(status);

  const canvasBody = (
    <ContentEditorProvider>
      <PageInner>
        <SidebarColumn>
          <DocumentOutlineTree subjects={tree.subjects} sectionMeta={mergedSectionMeta} />
          <SidebarActionsRow>
            <SidebarActionBtn type="button" onClick={handleOpenImport}>
              ייבוא סעיפים
            </SidebarActionBtn>
            <SidebarActionBtn type="button" onClick={handleOpenRestore}>
              שחזור סעיפים ({trash.length})
            </SidebarActionBtn>
          </SidebarActionsRow>
        </SidebarColumn>

        <CanvasColumn data-testid={DOCUMENT_CANVAS_IDS.root}>
          <ToolbarRow>
            <ContentEditorToolbar />
            <FilterPanel />
          </ToolbarRow>

          <ComparisonBar />

          <DocHeaderCard header={header} status={status} onHeaderChange={onHeaderChange} />

          <ApprovalWorkflow docName={header.name} status={status} onStatusChange={setStatus} />

          {tree.subjects.map((subject, subjectIndex) => (
            <SubjectSection key={subject.id} data-testid={DOCUMENT_CANVAS_IDS.subject(subject.id)}>
              <SubjectHeading>{subject.title || 'נושא ללא שם'}</SubjectHeading>

              {subject.sections
                .map((section, sectionIndex) => ({
                  section,
                  sectionIndex,
                  meta: getMeta(section.id),
                }))
                .filter(({ meta }) => matchesStatusFilter(meta.status))
                .map(({ section, sectionIndex, meta }) => (
                  <div key={section.id}>
                    <EditableSectionBody
                      id={section.id}
                      depth="section"
                      index={`${subjectIndex + 1}.${sectionIndex + 1}`}
                      title={section.title}
                      content={section.content}
                      meta={meta}
                      permissions={section.permissions}
                      onContentChange={handleSectionContentChange(subject.id, section.id)}
                      onChangePermissions={handleSectionPermissionsChange(
                        subject.id,
                        section.id,
                        section.permissions,
                      )}
                      onToggleHidden={handleToggleHidden(section.id)}
                      onToggleClassified={handleToggleClassified(section.id)}
                      onChangeClassificationViewers={handleChangeClassificationViewers(section.id)}
                      onDelete={handleRemoveSection(subject.id, section)}
                    />

                    {section.subSections
                      .map((subSection, subSectionIndex) => ({
                        subSection,
                        subSectionIndex,
                        meta: getMeta(subSection.id),
                      }))
                      .filter(({ meta: subMeta }) => matchesStatusFilter(subMeta.status))
                      .map(({ subSection, subSectionIndex, meta: subMeta }) => (
                        <EditableSectionBody
                          key={subSection.id}
                          id={subSection.id}
                          depth="subSection"
                          index={`${subjectIndex + 1}.${sectionIndex + 1}.${subSectionIndex + 1}`}
                          title={subSection.title}
                          content={subSection.content}
                          meta={subMeta}
                          permissions={subSection.permissions}
                          onContentChange={handleSubSectionContentChange(
                            subject.id,
                            section.id,
                            subSection.id,
                          )}
                          onChangePermissions={handleSubSectionPermissionsChange(
                            subject.id,
                            section.id,
                            subSection.id,
                            subSection.permissions,
                          )}
                          onToggleHidden={handleToggleHidden(subSection.id)}
                          onToggleClassified={handleToggleClassified(subSection.id)}
                          onChangeClassificationViewers={handleChangeClassificationViewers(
                            subSection.id,
                          )}
                          onDelete={handleRemoveSubSection(subject.id, section.id, subSection.id)}
                        />
                      ))}
                  </div>
                ))}
            </SubjectSection>
          ))}
        </CanvasColumn>
      </PageInner>

      <Suspense fallback={null}>
        {showImportModal && (
          <ImportDocModal onClose={handleCloseImport} onImport={handleImportSections} />
        )}

        {showRestoreModal && (
          <RestoreModal
            deletedSections={trash}
            onClose={handleCloseRestore}
            onRestore={handleRestoreSections}
          />
        )}
      </Suspense>
    </ContentEditorProvider>
  );

  return profile.id ? (
    <CollabProvider userId={profile.id}>{canvasBody}</CollabProvider>
  ) : (
    canvasBody
  );
};
