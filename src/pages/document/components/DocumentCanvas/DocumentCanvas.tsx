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

  return (
    <PageInner>
      <SidebarColumn>
        <DocumentOutlineTree subjects={tree.subjects} sectionMeta={data.sectionMeta} />
      </SidebarColumn>

      <CanvasColumn data-testid={DOCUMENT_CANVAS_IDS.root}>
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
                  />
                ))}
              </div>
            ))}
          </SubjectSection>
        ))}
      </CanvasColumn>
    </PageInner>
  );
};
