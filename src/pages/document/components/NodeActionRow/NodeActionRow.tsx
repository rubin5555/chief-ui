import type { ReactNode } from 'react';
import type { NodeStamp, SourceOrigin } from '../../types';
import { CopyNodeButton } from './components/CopyNodeButton';
import { LastModifiedStamp } from './components/LastModifiedStamp';
import { SourceRefreshButton } from './components/SourceRefreshButton';
import type { ActionTone } from './NodeActionRow.shared.styles';
import { ActionRow } from './NodeActionRow.styles';
import { NODE_ACTION_ROW_IDS } from './NodeActionRow.testids';

export interface NodeActionRowProps {
  nodeId: string;
  lastModified?: NodeStamp;
  sourceOrigin?: SourceOrigin[];
  /** What gets copied. Empty for a node with no body of its own, like the emphasis card's title. */
  copyText: string;
  tone?: ActionTone;
  readOnly: boolean;
  /**
   * Attach, chat and options arrive as slots rather than callbacks: each is a
   * trigger for something anchored to itself — a modal, a popover, a menu — and
   * .claude/skills/modal-placement.md keeps that state in the component that
   * renders the trigger. All three use the same ActionBtn from
   * NodeActionRow.shared.styles, so the row stays visually one piece.
   */
  attach?: ReactNode;
  chat?: ReactNode;
  options?: ReactNode;
}

// The row of small controls trailing every node's heading. main copy-pastes it
// four times over (Edit.tsx:4166, 4262, 4457, 4655); this is the one of it.
//
// Everything editing-related disappears on a read-only document: the stamp, the
// refresh, and whichever of the slots the caller withholds. Copy stays — reading
// a locked document is exactly when you want to take a piece of it with you.
export const NodeActionRow = ({
  nodeId,
  lastModified,
  sourceOrigin,
  copyText,
  tone = 'default',
  readOnly,
  attach,
  chat,
  options,
}: NodeActionRowProps) => (
  <ActionRow data-testid={NODE_ACTION_ROW_IDS.root(nodeId)}>
    {/* When a node was last touched while it was being written stops being
        useful once it can no longer be written to, so main drops the stamp with
        the rest of the editing affordances. */}
    {!readOnly && lastModified && <LastModifiedStamp nodeId={nodeId} stamp={lastModified} />}

    {!readOnly && <SourceRefreshButton nodeId={nodeId} sourceOrigin={sourceOrigin} tone={tone} />}

    <CopyNodeButton nodeId={nodeId} text={copyText} tone={tone} />

    {attach}
    {chat}
    {options}
  </ActionRow>
);
