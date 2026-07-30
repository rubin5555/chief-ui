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
  copyText: string;
  tone?: ActionTone;
  readOnly: boolean;
  attach?: ReactNode;
  chat?: ReactNode;
  options?: ReactNode;
}

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
    {!readOnly && lastModified && <LastModifiedStamp nodeId={nodeId} stamp={lastModified} />}

    {!readOnly && <SourceRefreshButton nodeId={nodeId} sourceOrigin={sourceOrigin} tone={tone} />}

    <CopyNodeButton nodeId={nodeId} text={copyText} tone={tone} />

    {attach}
    {chat}
    {options}
  </ActionRow>
);
