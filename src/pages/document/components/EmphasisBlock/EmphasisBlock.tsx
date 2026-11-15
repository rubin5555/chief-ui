import { Lightbulb } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { useState } from 'react';
import type { AttachmentFile } from '../../types';
import { AttachmentPicker } from '../AttachmentPicker';
import { NodeActionRow } from '../NodeActionRow';
import {
  EmphasisRoot,
  EmphasisTextarea,
  HeaderIcon,
  HeaderRow,
  HeaderTitle,
} from './EmphasisBlock.styles';
import { EMPHASIS_BLOCK_IDS } from './EmphasisBlock.testids';

const NODE_ID = 'emphasis';
const INITIAL_ROWS = 3;

export interface EmphasisBlockProps {
  readOnly: boolean;
}

const fitToContent = (element: HTMLTextAreaElement | null) => {
  if (!element) return;
  element.style.height = 'auto';
  element.style.height = `${element.scrollHeight}px`;
};

export const EmphasisBlock = ({ readOnly }: EmphasisBlockProps) => {
  const [text, setText] = useState('');

  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const [attachmentsOpen, setAttachmentsOpen] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
    fitToContent(event.currentTarget);
  };

  return (
    <EmphasisRoot dir="rtl" data-testid={EMPHASIS_BLOCK_IDS.root}>
      <HeaderRow>
        <HeaderIcon>
          <Lightbulb size={14} aria-hidden="true" />
        </HeaderIcon>
        <HeaderTitle>דגשים לכתיבה</HeaderTitle>

        <NodeActionRow
          nodeId={NODE_ID}
          copyText={text}
          tone="amber"
          readOnly={readOnly}
          attach={
            !readOnly && (
              <AttachmentPicker
                nodeId={NODE_ID}
                attachments={attachments}
                isOpen={attachmentsOpen}
                onOpenChange={setAttachmentsOpen}
                onChange={setAttachments}
                tone="amber"
              />
            )
          }
        />
      </HeaderRow>

      <EmphasisTextarea
        ref={fitToContent}
        value={text}
        rows={INITIAL_ROWS}
        dir="rtl"
        readOnly={readOnly}
        placeholder="הזן דגשים לכתיבת המסמך..."
        aria-label="דגשים לכתיבת המסמך"
        data-testid={EMPHASIS_BLOCK_IDS.textarea}
        onChange={handleChange}
      />
    </EmphasisRoot>
  );
};
