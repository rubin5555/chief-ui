import { Paperclip } from 'lucide-react';
import type { AttachmentFile } from '../../../../types';
import { Chip, ChipList } from './AttachmentChipList.styles';
import { ATTACHMENT_CHIP_LIST_IDS } from './AttachmentChipList.testids';

export interface AttachmentChipListProps {
  nodeId: string;
  attachments: AttachmentFile[];
  onOpen: () => void;
}

// What is attached to a node, listed under its content box (main, Edit.tsx:4586).
//
// Every chip opens the same dialog rather than acting on its own file: at 10px
// there is no room for per-file controls, and main does the same — the list is a
// summary, and the modal is where you do anything about it.
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
