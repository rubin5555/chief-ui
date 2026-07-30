import { Copy } from 'lucide-react';
import type { ActionTone } from '../../NodeActionRow.shared.styles';
import { ACTION_ICON_SIZE, ActionBtn } from '../../NodeActionRow.shared.styles';
import { COPY_NODE_BUTTON_IDS } from './CopyNodeButton.testids';

export interface CopyNodeButtonProps {
  nodeId: string;
  text: string;
  tone: ActionTone;
}

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
