import { Copy } from 'lucide-react';
import type { ActionTone } from '../../NodeActionRow.shared.styles';
import { ACTION_ICON_SIZE, ActionBtn } from '../../NodeActionRow.shared.styles';
import { COPY_NODE_BUTTON_IDS } from './CopyNodeButton.testids';

export interface CopyNodeButtonProps {
  nodeId: string;
  /** What lands on the clipboard. Plain text — the sheet's markup is not what anyone is copying. */
  text: string;
  tone: ActionTone;
}

// Copies a node's own text (main, Edit.tsx:4276).
//
// `writeText` returns a promise that rejects when the page hasn't been
// interacted with or the permission is refused. Nothing is awaited and nothing is
// shown on success: this is a copy button, and the feedback people rely on is
// pasting. A rejection is swallowed rather than thrown into an unhandled
// rejection — there is no recovery to offer.
export const CopyNodeButton = ({ nodeId, text, tone }: CopyNodeButtonProps) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(text).catch(() => undefined);
  };

  return (
    <ActionBtn
      type="button"
      $tone={tone}
      title="העתק"
      aria-label="העתקת תוכן הסעיף"
      data-testid={COPY_NODE_BUTTON_IDS.root(nodeId)}
      onClick={handleCopy}
    >
      <Copy size={ACTION_ICON_SIZE} aria-hidden="true" />
    </ActionBtn>
  );
};
