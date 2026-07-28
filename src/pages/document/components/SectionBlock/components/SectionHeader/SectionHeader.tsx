import type { AttachmentFile, SectionMeta } from '../../../../types';
import { AttachmentPicker } from '../../../AttachmentPicker';
import { NodeActionRow } from '../../../NodeActionRow';
import { NodeTitleField } from '../../../NodeTitleField';
import { SectionChat } from '../../../SectionChat';
import { SectionMenu } from '../../../SectionMenu';
import { SectionStatusLabel } from '../../../SectionStatusLabel';
import { SectionHeaderRow, SectionNumber, TitleSlot } from '../../SectionBlock.styles';
import { SectionInstructionsTip } from '../SectionInstructionsTip';

export interface SectionHeaderProps {
  sectionId: string;
  title: string;
  content: string;
  /** Continuous position in the document, not within the parent subject. */
  number: number;
  meta: SectionMeta;
  readOnly: boolean;
  isDistributed: boolean;
  attachmentsOpen: boolean;
  onAttachmentsOpenChange: (isOpen: boolean) => void;
  onTitleChange: (title: string) => void;
  onAttachmentsChange: (attachments: AttachmentFile[]) => void;
  onMessageSent: () => void;
  onToggleHidden: () => void;
  onToggleClassified: () => void;
  onChangeClassificationViewers: (ids: string[]) => void;
  onChangeInstructions: (instructions: string) => void;
  onAddFootnote: () => void;
  onDelete: () => void;
}

// A section's heading row: its number, its editable title, whatever the section
// has to say about itself, and the action row (main, Edit.tsx:4397).
//
// Split out of SectionBlock because the row is the half of that component that is
// pure assembly — every handler here is passed straight through, and the state
// they touch belongs to the block.
export const SectionHeader = ({
  sectionId,
  title,
  content,
  number,
  meta,
  readOnly,
  isDistributed,
  attachmentsOpen,
  onAttachmentsOpenChange,
  onTitleChange,
  onAttachmentsChange,
  onMessageSent,
  onToggleHidden,
  onToggleClassified,
  onChangeClassificationViewers,
  onChangeInstructions,
  onAddFootnote,
  onDelete,
}: SectionHeaderProps) => (
  <SectionHeaderRow>
    <SectionNumber>{number}.</SectionNumber>
    <TitleSlot>
      <NodeTitleField nodeId={sectionId} variant="section" value={title} onChange={onTitleChange} />
    </TitleSlot>

    {meta.instructions && (
      <SectionInstructionsTip sectionId={sectionId} instructions={meta.instructions} />
    )}

    <SectionStatusLabel
      sectionId={sectionId}
      status={meta.status}
      isHidden={meta.hidden}
      isDistributedDoc={isDistributed}
    />

    <NodeActionRow
      nodeId={sectionId}
      lastModified={meta.lastModified}
      sourceOrigin={meta.sourceOrigin}
      copyText={content}
      readOnly={readOnly}
      attach={
        !readOnly && (
          <AttachmentPicker
            nodeId={sectionId}
            attachments={meta.attachments}
            isOpen={attachmentsOpen}
            onOpenChange={onAttachmentsOpenChange}
            onChange={onAttachmentsChange}
          />
        )
      }
      chat={
        <SectionChat
          sectionId={sectionId}
          title={title || 'סעיף ללא שם'}
          onMessageSent={onMessageSent}
        />
      }
      options={
        <SectionMenu
          sectionId={sectionId}
          sectionTitle={title}
          instructions={meta.instructions ?? ''}
          isHidden={meta.hidden}
          classificationLevel={meta.classification.level}
          classificationViewerIds={meta.classification.viewerIds}
          onToggleHidden={onToggleHidden}
          onToggleClassified={onToggleClassified}
          onChangeClassificationViewers={onChangeClassificationViewers}
          onChangeInstructions={onChangeInstructions}
          onAddFootnote={onAddFootnote}
          onDelete={onDelete}
        />
      }
    />
  </SectionHeaderRow>
);
