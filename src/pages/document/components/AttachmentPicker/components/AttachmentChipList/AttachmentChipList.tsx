import { Paperclip } from 'lucide-react';
import type { AttachmentFile } from '../../../../types';
import { Chip, ChipList } from './AttachmentChipList.styles';
import { ATTACHMENT_CHIP_LIST_IDS } from './AttachmentChipList.testids';

export interface AttachmentChipListProps {
  nodeId: string;
  attachments: AttachmentFile[];
  onOpen: () => void;
}

export const AttachmentChipList = ({ nodeId, attachments, onOpen }: AttachmentChipListProps) => {
  if (attachments.length === 0) return null;

  return (
    <ChipList data-testid={ATTACHMENT_CHIP_LIST_IDS.root(nodeId)}>
      {attachments.map((attachment) => (
        <Chip
          key={attachment.id}
          type="button"
          data-testid={ATTACHMENT_CHIP_LIST_IDS.chip(attachment.id)}
          onClick={onOpen}
        >
          <Paperclip size={11} aria-hidden="true" />
          {attachment.name}
        </Chip>
      ))}
    </ChipList>
  );
};
