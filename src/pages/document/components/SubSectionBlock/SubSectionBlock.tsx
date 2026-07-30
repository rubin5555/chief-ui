import { useState } from 'react';
import type { useDocumentTree } from '@/hooks/useDocumentTree';
import { HE_ALPHA, OUTLINE_NODE_ATTR } from '../../document.constants';
import type { useDocumentOverrides } from '../../hooks/useDocumentOverrides';
import {
  type AttachmentFile,
  DEFAULT_CLASSIFICATION_LEVEL,
  type Footnote,
  type SubSection,
} from '../../types';
import { AttachmentPicker } from '../AttachmentPicker';
import { EditableSectionBody } from '../EditableSectionBody';
import { NodeActionRow } from '../NodeActionRow';
import { NodeTitleField } from '../NodeTitleField';
import { SectionChat } from '../SectionChat';
import { SectionMenu } from '../SectionMenu';
import { useSectionNavigation } from '../SectionNavigation';
import { SubSectionHeaderRow, SubSectionMarker, SubSectionRoot } from './SubSectionBlock.styles';
import { SUB_SECTION_BLOCK_IDS } from './SubSectionBlock.testids';

export interface SubSectionBlockProps {
  subjectId: string;
  sectionId: string;
  subSection: SubSection;
  index: number;
  tree: ReturnType<typeof useDocumentTree>;
  overrides: ReturnType<typeof useDocumentOverrides>;
  readOnly: boolean;
}

export const SubSectionBlock = ({
  subjectId,
  sectionId,
  subSection,
  index,
  tree,
  overrides,
  readOnly,
}: SubSectionBlockProps) => {
  const meta = overrides.getMeta(subSection.id);
  const nav = useSectionNavigation();

  const [attachmentsOpen, setAttachmentsOpen] = useState(false);

  const handleTitleChange = (title: string) =>
    tree.updateSubSectionTitle(subjectId, sectionId, subSection.id, title);

  const handleContentChange = (content: string) =>
    tree.updateSubSectionContent(subjectId, sectionId, subSection.id, content);

  const handleToggleHidden = () => overrides.patchMeta(subSection.id, { hidden: !meta.hidden });

  const handleToggleClassified = () =>
    overrides.patchMeta(subSection.id, {
      classification: meta.classification.level
        ? { level: null, viewerIds: [] }
        : { level: DEFAULT_CLASSIFICATION_LEVEL, viewerIds: [] },
    });

  const handleChangeClassificationViewers = (viewerIds: string[]) =>
    overrides.patchMeta(subSection.id, {
      classification: { ...meta.classification, viewerIds },
    });

  const handleDelete = () => tree.removeSubSection(subjectId, sectionId, subSection.id);

  const handleAttachmentsChange = (attachments: AttachmentFile[]) =>
    overrides.patchMeta(subSection.id, { attachments });

  const handleOpenAttachments = () => setAttachmentsOpen(true);

  const handleFootnotesChange = (footnotes: Footnote[]) =>
    overrides.patchMeta(subSection.id, { footnotes });

  const handleAddFootnote = () =>
    overrides.patchMeta(subSection.id, {
      footnotes: [...meta.footnotes, { id: `footnote-${self.crypto.randomUUID()}`, text: '' }],
    });

  const handleInstructionsChange = (instructions: string) =>
    overrides.patchMeta(subSection.id, { instructions });

  const marker = HE_ALPHA[index] ?? String(index + 1);

  return (
    <SubSectionRoot
      $revealed={nav?.revealedNodeId === subSection.id}
      {...{ [OUTLINE_NODE_ATTR]: subSection.id }}
      data-testid={SUB_SECTION_BLOCK_IDS.root(subSection.id)}
    >
      <SubSectionHeaderRow>
        <SubSectionMarker>{marker}.</SubSectionMarker>
        <NodeTitleField
          nodeId={subSection.id}
          variant="subSection"
          value={subSection.title}
          onChange={handleTitleChange}
        />
        <NodeActionRow
          nodeId={subSection.id}
          lastModified={meta.lastModified}
          sourceOrigin={meta.sourceOrigin}
          copyText={subSection.content}
          readOnly={readOnly}
          attach={
            !readOnly && (
              <AttachmentPicker
                nodeId={subSection.id}
                attachments={meta.attachments}
                isOpen={attachmentsOpen}
                onOpenChange={setAttachmentsOpen}
                onChange={handleAttachmentsChange}
              />
            )
          }
          chat={
            <SectionChat
              sectionId={subSection.id}
              title={`${marker}. ${subSection.title || 'תת סעיף ללא שם'}`}
            />
          }
          options={
            <SectionMenu
              sectionId={subSection.id}
              permissionSectionId={sectionId}
              sectionTitle={subSection.title}
              instructions={meta.instructions ?? ''}
              isHidden={meta.hidden}
              classificationLevel={meta.classification.level}
              classificationViewerIds={meta.classification.viewerIds}
              onToggleHidden={handleToggleHidden}
              onToggleClassified={handleToggleClassified}
              onChangeClassificationViewers={handleChangeClassificationViewers}
              onChangeInstructions={handleInstructionsChange}
              onAddFootnote={handleAddFootnote}
              onDelete={handleDelete}
            />
          }
        />
      </SubSectionHeaderRow>

      <EditableSectionBody
        id={subSection.id}
        depth="subSection"
        content={subSection.content}
        meta={meta}
        onContentChange={handleContentChange}
        onOpenAttachments={handleOpenAttachments}
        readOnly={readOnly}
        onFootnotesChange={handleFootnotesChange}
      />
    </SubSectionRoot>
  );
};
