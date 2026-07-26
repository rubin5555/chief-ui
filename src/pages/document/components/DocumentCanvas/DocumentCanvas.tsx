import { useState } from 'react';
import { ContentEditorProvider, ContentEditorToolbar } from '@/components/ui/ContentEditor';
import { useDocumentTree } from '@/hooks/useDocumentTree';
import type { DocumentDto, NodePermissions, SectionMeta, SectionMetaMap } from '../../types';
import { emptySectionMeta } from '../../types';
import { DocHeaderCard } from '../DocHeaderCard';
import { DocumentOutlineTree } from '../DocumentOutlineTree';
import { EditableSectionBody } from '../EditableSectionBody';
import {
  CanvasColumn,
  PageInner,
  SidebarColumn,
  SubjectHeading,
  SubjectSection,
} from './DocumentCanvas.styles';
import { DOCUMENT_CANVAS_IDS } from './DocumentCanvas.testids';

export interface DocumentCanvasProps {
  data: DocumentDto;
}

const DEFAULT_CLASSIFICATION_LEVEL = 'בלמ"ס';

// Only mounts once `data` is loaded (DocumentPage gates on that), so
// useDocumentTree's initial-state seed is never stuck on an empty/stale
// array from a render that ran before the document had loaded.
export const DocumentCanvas = ({ data }: DocumentCanvasProps) => {
  const tree = useDocumentTree(data.subjects);

  // status/hidden/classification/attachments/footnotes aren't part of
  // useDocumentTree's tree state (see src/pages/document/types.ts), so
  // edits to them are kept as a local override map layered over the
  // query's initial data.sectionMeta, the same pattern as SectionChat's
  // locally-appended comments.
  const [metaOverrides, setMetaOverrides] = useState<SectionMetaMap>({});

  const getMeta = (id: string): SectionMeta => ({
    ...emptySectionMeta(),
    ...data.sectionMeta[id],
    ...metaOverrides[id],
  });

  const patchMeta = (id: string, patch: Partial<SectionMeta>) =>
    setMetaOverrides((prev) => ({ ...prev, [id]: { ...getMeta(id), ...patch } }));

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

  const handleRemoveSection = (subjectId: string, sectionId: string) => () =>
    tree.removeSection(subjectId, sectionId);

  const handleRemoveSubSection =
    (subjectId: string, sectionId: string, subSectionId: string) => () =>
      tree.removeSubSection(subjectId, sectionId, subSectionId);

  // Reflects metaOverrides too (not just the query's initial snapshot) so the
  // outline tree doesn't go stale once status/hidden/classification start
  // being edited locally.
  const mergedSectionMeta: SectionMetaMap = { ...data.sectionMeta };
  for (const id of Object.keys(metaOverrides)) mergedSectionMeta[id] = getMeta(id);

  return (
    <ContentEditorProvider>
      <PageInner>
        <SidebarColumn>
          <DocumentOutlineTree subjects={tree.subjects} sectionMeta={mergedSectionMeta} />
        </SidebarColumn>

        <CanvasColumn data-testid={DOCUMENT_CANVAS_IDS.root}>
          <ContentEditorToolbar />

          <DocHeaderCard header={data.header} status={data.status} />

          {tree.subjects.map((subject, subjectIndex) => (
            <SubjectSection key={subject.id} data-testid={DOCUMENT_CANVAS_IDS.subject(subject.id)}>
              <SubjectHeading>{subject.title || 'נושא ללא שם'}</SubjectHeading>

              {subject.sections.map((section, sectionIndex) => (
                <div key={section.id}>
                  <EditableSectionBody
                    id={section.id}
                    depth="section"
                    index={`${subjectIndex + 1}.${sectionIndex + 1}`}
                    title={section.title}
                    content={section.content}
                    meta={getMeta(section.id)}
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
                    onDelete={handleRemoveSection(subject.id, section.id)}
                  />

                  {section.subSections.map((subSection, subSectionIndex) => (
                    <EditableSectionBody
                      key={subSection.id}
                      id={subSection.id}
                      depth="subSection"
                      index={`${subjectIndex + 1}.${sectionIndex + 1}.${subSectionIndex + 1}`}
                      title={subSection.title}
                      content={subSection.content}
                      meta={getMeta(subSection.id)}
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
    </ContentEditorProvider>
  );
};
