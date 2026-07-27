import { useState } from 'react';
import type { useDocumentTree } from '@/hooks/useDocumentTree';
import { HE_ALPHA } from '../../document.constants';
import type { useDocumentOverrides } from '../../hooks/useDocumentOverrides';
import {
  type AttachmentFile,
  DEFAULT_CLASSIFICATION_LEVEL,
  type Footnote,
  type NodePermissions,
  type SubSection,
} from '../../types';
import { AttachmentPicker } from '../AttachmentPicker';
import { EditableSectionBody } from '../EditableSectionBody';
import { NodeActionRow } from '../NodeActionRow';
import { NodeTitleField } from '../NodeTitleField';
import { SectionChat } from '../SectionChat';
import { SectionMenu } from '../SectionMenu';
import { SubSectionHeaderRow, SubSectionMarker, SubSectionRoot } from './SubSectionBlock.styles';
import { SUB_SECTION_BLOCK_IDS } from './SubSectionBlock.testids';

export interface SubSectionBlockProps {
  subjectId: string;
  sectionId: string;
  subSection: SubSection;
  /** Position within the parent section, which picks the Hebrew letter marker. */
  index: number;
  tree: ReturnType<typeof useDocumentTree>;
  overrides: ReturnType<typeof useDocumentOverrides>;
  readOnly: boolean;
}

// The third tree level. Unlike a section it has no delete-to-trash path — a
// sub-section delete is a plain removal, so RestoreModal only ever offers whole
// sections (see RestoreModal's doc comment for that scope call).
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

  // Whether the attachments dialog is open lives here rather than inside
  // AttachmentPicker, because the chips under the body open it too and they are
  // rendered by a different child.
  const [attachmentsOpen, setAttachmentsOpen] = useState(false);

  const handleTitleChange = (title: string) =>
    tree.updateSubSectionTitle(subjectId, sectionId, subSection.id, title);

  const handleContentChange = (content: string) =>
    tree.updateSubSectionContent(subjectId, sectionId, subSection.id, content);

  const handlePermissionsChange = (role: keyof NodePermissions, value: string[]) =>
    tree.updateSubSectionPermissions(subjectId, sectionId, subSection.id, {
      ...subSection.permissions,
      [role]: value,
    });

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
    <SubSectionRoot data-testid={SUB_SECTION_BLOCK_IDS.root(subSection.id)}>
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
            // main labels a sub-section chat with its marker, so a reader can
            // tell two similarly-titled sub-sections apart in the chat header.
            <SectionChat
              sectionId={subSection.id}
              title={`${marker}. ${subSection.title || 'תת סעיף ללא שם'}`}
            />
          }
          options={
            <SectionMenu
              sectionId={subSection.id}
              sectionTitle={subSection.title}
              instructions={meta.instructions ?? ''}
              permissions={subSection.permissions}
              isHidden={meta.hidden}
              classificationLevel={meta.classification.level}
              classificationViewerIds={meta.classification.viewerIds}
              onChangePermissions={handlePermissionsChange}
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
