import { FileText } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { ContentEditor, ContentEditorToolbar } from '@/components/ui/ContentEditor';
import type { Appendix, DocumentTreeApi } from '../../TemplateModal.constants';
import { HE_ALPHA } from '../../TemplateModal.constants';
import { TEMPLATE_MODAL_IDS } from '../../TemplateModal.testids';
import {
  AppendixPreviewBlock,
  EmphasisPreviewBox,
  EmphasisPreviewLabel,
  EmphasisTextarea,
  HeadingIndex,
  HeadingInput,
  HeadingRow,
  PreviewEmpty,
  PreviewInner,
  PreviewPane,
  SectionPreviewBlock,
  SubjectHeading,
  SubSectionPreviewBlock,
} from './DocumentPreview.styles';

interface DocumentPreviewProps {
  tree: DocumentTreeApi;
  appendices: Appendix[];
  onAppendixTitleChange: (id: string, title: string) => void;
  onAppendixContentChange: (id: string, content: string) => void;
  hasEmphasis: boolean;
  emphasisText: string;
  onEmphasisTextChange: (value: string) => void;
}

export const DocumentPreview = ({
  tree,
  appendices,
  onAppendixTitleChange,
  onAppendixContentChange,
  hasEmphasis,
  emphasisText,
  onEmphasisTextChange,
}: DocumentPreviewProps) => {
  const isEmpty = tree.subjects.length === 0 && appendices.length === 0 && !hasEmphasis;

  const handleSubjectTitleChange = (subjectId: string) => (e: ChangeEvent<HTMLInputElement>) =>
    tree.updateSubjectTitle(subjectId, e.target.value);

  const handleSectionTitleChange =
    (subjectId: string, sectionId: string) => (e: ChangeEvent<HTMLInputElement>) =>
      tree.updateSectionTitle(subjectId, sectionId, e.target.value);

  const handleSectionContentChange = (subjectId: string, sectionId: string) => (content: string) =>
    tree.updateSectionContent(subjectId, sectionId, content);

  const handleSubSectionTitleChange =
    (subjectId: string, sectionId: string, subSectionId: string) =>
    (e: ChangeEvent<HTMLInputElement>) =>
      tree.updateSubSectionTitle(subjectId, sectionId, subSectionId, e.target.value);

  const handleSubSectionContentChange =
    (subjectId: string, sectionId: string, subSectionId: string) => (content: string) =>
      tree.updateSubSectionContent(subjectId, sectionId, subSectionId, content);

  const handleAppendixTitleChange = (id: string) => (e: ChangeEvent<HTMLInputElement>) =>
    onAppendixTitleChange(id, e.target.value);

  const handleAppendixContentChange = (id: string) => (content: string) =>
    onAppendixContentChange(id, content);

  const handleEmphasisChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
    onEmphasisTextChange(e.target.value);

  return (
    <PreviewPane data-testid={TEMPLATE_MODAL_IDS.preview}>
      <ContentEditorToolbar />

      {isEmpty ? (
        <PreviewEmpty>
          <FileText size={40} />
          הוסף נושאים מהסייד בר לבניית התבנית
        </PreviewEmpty>
      ) : (
        <PreviewInner>
          {tree.subjects.map((subject, subjectIndex) => (
            <div key={subject.id}>
              <SubjectHeading
                value={subject.title}
                onChange={handleSubjectTitleChange(subject.id)}
                placeholder={`נושא ${subjectIndex + 1}`}
                dir="rtl"
              />
              {subject.sections.map((section, sectionIndex) => (
                <SectionPreviewBlock key={section.id}>
                  <HeadingRow>
                    <HeadingIndex>{sectionIndex + 1}.</HeadingIndex>
                    <HeadingInput
                      value={section.title}
                      onChange={handleSectionTitleChange(subject.id, section.id)}
                      placeholder="שם הסעיף"
                      dir="rtl"
                    />
                  </HeadingRow>
                  <ContentEditor
                    id={section.id}
                    value={section.content}
                    onChange={handleSectionContentChange(subject.id, section.id)}
                    placeholder="מלל קבוע לסעיף (אופציונלי)..."
                    minHeight={60}
                  />
                  {section.subSections.map((subSection, subIndex) => (
                    <SubSectionPreviewBlock key={subSection.id}>
                      <HeadingRow>
                        <HeadingIndex $muted>{HE_ALPHA[subIndex]}.</HeadingIndex>
                        <HeadingInput
                          $muted
                          value={subSection.title}
                          onChange={handleSubSectionTitleChange(
                            subject.id,
                            section.id,
                            subSection.id,
                          )}
                          placeholder="שם תת הסעיף"
                          dir="rtl"
                        />
                      </HeadingRow>
                      <ContentEditor
                        id={subSection.id}
                        value={subSection.content}
                        onChange={handleSubSectionContentChange(
                          subject.id,
                          section.id,
                          subSection.id,
                        )}
                        placeholder="מלל קבוע (אופציונלי)..."
                        minHeight={50}
                      />
                    </SubSectionPreviewBlock>
                  ))}
                </SectionPreviewBlock>
              ))}
            </div>
          ))}

          {appendices.map((appendix, index) => (
            <AppendixPreviewBlock key={appendix.id}>
              <HeadingRow>
                <HeadingIndex $muted>נספח {HE_ALPHA[index]}.</HeadingIndex>
                <HeadingInput
                  value={appendix.title}
                  onChange={handleAppendixTitleChange(appendix.id)}
                  placeholder="שם הנספח"
                  dir="rtl"
                />
              </HeadingRow>
              <ContentEditor
                id={appendix.id}
                value={appendix.content}
                onChange={handleAppendixContentChange(appendix.id)}
                placeholder="תוכן הנספח..."
                minHeight={70}
              />
            </AppendixPreviewBlock>
          ))}

          {hasEmphasis && (
            <EmphasisPreviewBox>
              <EmphasisPreviewLabel>דגשים לכתיבה:</EmphasisPreviewLabel>
              <EmphasisTextarea
                value={emphasisText}
                onChange={handleEmphasisChange}
                placeholder="הזן דגשים לכתיבת המסמך..."
                dir="rtl"
              />
            </EmphasisPreviewBox>
          )}
        </PreviewInner>
      )}
    </PreviewPane>
  );
};
