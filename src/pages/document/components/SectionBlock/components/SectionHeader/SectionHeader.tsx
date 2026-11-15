import type { AttachmentFile, SectionMeta } from '../../../../types';
import { AttachmentPicker } from '../../../AttachmentPicker';
import { NodeActionRow } from '../../../NodeActionRow';
import { NodeTitleField } from '../../../NodeTitleField';
import { SectionChat } from '../../../SectionChat';
import { SectionMenu } from '../../../SectionMenu';
import { SectionStatusLabel } from '../../../SectionStatusLabel';
import { SectionInstructionsTip } from '../SectionInstructionsTip';
import { SectionHeaderRow, SectionNumber, TitleSlot } from './SectionHeader.styles';

export interface SectionHeaderProps {
  sectionId: string;
  title: string;
  content: string;
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
