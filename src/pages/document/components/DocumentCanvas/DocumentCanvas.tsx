import { ContentEditorProvider, ContentEditorToolbar } from '@/components/ui/ContentEditor';
import { useDocumentTree } from '@/hooks/useDocumentTree';
import type { DocumentDto } from '../../types';
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

// Only mounts once `data` is loaded (DocumentPage gates on that), so
// useDocumentTree's initial-state seed is never stuck on an empty/stale
// array from a render that ran before the document had loaded.
export const DocumentCanvas = ({ data }: DocumentCanvasProps) => {
  const tree = useDocumentTree(data.subjects);

  // Bound to one subject/section at a time — every EditableSectionBody
  // receives an already-curried callback, never a raw id to re-curry
  // itself with. Mirrors TemplateModal's DocumentPreview.tsx.
  const handleSectionContentChange = (subjectId: string, sectionId: string) => (value: string) =>
    tree.updateSectionContent(subjectId, sectionId, value);

  const handleSubSectionContentChange =
    (subjectId: string, sectionId: string, subSectionId: string) => (value: string) =>
      tree.updateSubSectionContent(subjectId, sectionId, subSectionId, value);

  return (
    <ContentEditorProvider>
      <PageInner>
        <SidebarColumn>
          <DocumentOutlineTree subjects={tree.subjects} sectionMeta={data.sectionMeta} />
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
                    meta={data.sectionMeta[section.id] ?? emptySectionMeta()}
                    onContentChange={handleSectionContentChange(subject.id, section.id)}
                  />

                  {section.subSections.map((subSection, subSectionIndex) => (
                    <EditableSectionBody
                      key={subSection.id}
                      id={subSection.id}
                      depth="subSection"
                      index={`${subjectIndex + 1}.${sectionIndex + 1}.${subSectionIndex + 1}`}
                      title={subSection.title}
                      content={subSection.content}
                      meta={data.sectionMeta[subSection.id] ?? emptySectionMeta()}
                      onContentChange={handleSubSectionContentChange(
                        subject.id,
                        section.id,
                        subSection.id,
                      )}
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
