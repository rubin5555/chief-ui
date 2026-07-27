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

/**
 * Grow a textarea to fit its content.
 *
 * Height is cleared before it is measured, because `scrollHeight` on an element
 * with an explicit height reports that height — without the reset the box can
 * grow but never shrink again when text is deleted.
 */
const fitToContent = (element: HTMLTextAreaElement | null) => {
  if (!element) return;
  element.style.height = 'auto';
  element.style.height = `${element.scrollHeight}px`;
};

// main's "דגשים לכתיבה" card (Edit.tsx:4156): notes about how the document should
// be written, sitting at the top of the sheet above the first topic.
//
// The text is local state. It belongs to the card — nothing else in the document
// reads it — while whether the card is shown at all lives in DocumentCanvas,
// because the switch is in the sidebar's `+` menu and the card is in the paper.
export const EmphasisBlock = ({ readOnly }: EmphasisBlockProps) => {
  const [text, setText] = useState('');
  // The card isn't a tree node, so its attachments have nowhere in SectionMeta to
  // live — they are local state here, exactly as its text is.
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

        {/* No source origin and no stamp: these notes are written here, never
            imported, so main draws the refresh button permanently disabled and
            has nothing to date. No chat either — main's button there has no
            handler, and there is no thread for a card that isn't a section. */}
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
        // The ref callback fires on mount, which is what sizes the box to text
        // that was already there; typing keeps it in step from onChange. Both are
        // direct writes from an event, not an effect syncing to state.
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
