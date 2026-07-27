import { Copy, RefreshCw } from 'lucide-react';
import type { ReactNode } from 'react';
import type { NodeStamp, SourceOrigin } from '../../types';
import type { ActionTone } from './NodeActionRow.styles';
import { ActionBtn, ActionRow, Stamp } from './NodeActionRow.styles';
import { NODE_ACTION_ROW_IDS } from './NodeActionRow.testids';

const ICON_SIZE = 12;

export interface NodeActionRowProps {
  nodeId: string;
  lastModified?: NodeStamp;
  /** Absent or empty means there is no external system to refresh from. */
  sourceOrigin?: SourceOrigin[];
  tone?: ActionTone;
  readOnly: boolean;
  onCopy: () => void;
  onSourceClick?: () => void;
  /**
   * The node's 3-dots menu. A slot rather than a callback because the menu is a
   * popover anchored to its own trigger, and what it offers differs by node —
   * the component that owns those actions owns the button too.
   */
  options?: ReactNode;
}

// The row of small controls that trails every node's heading (main repeats it
// four times, Edit.tsx:4166, 4262, 4457, 4655).
//
// Phase 5 builds the three controls with real behaviour behind them: the
// last-modified stamp, the source-refresh button, and copy. The attach and chat
// buttons main also draws here arrive with AttachmentPicker — rendering them
// before then would put two dead icons on the row, which is worse than two
// missing ones.
export const NodeActionRow = ({
  nodeId,
  lastModified,
  sourceOrigin,
  tone = 'default',
  readOnly,
  onCopy,
  onSourceClick,
  options,
}: NodeActionRowProps) => {
  const hasSource = Boolean(sourceOrigin?.length);

  return (
    <ActionRow data-testid={NODE_ACTION_ROW_IDS.root(nodeId)}>
      {/* A read-only document is a finished one — when it was last touched while
          it was being written stops being useful, and main drops the stamp with
          the rest of the editing affordances. */}
      {!readOnly && lastModified && (
        <Stamp data-testid={NODE_ACTION_ROW_IDS.stamp(nodeId)}>
          עודכן ב‏{lastModified.at} ע״י {lastModified.by}
        </Stamp>
      )}

      {!readOnly && (
        <ActionBtn
          type="button"
          $tone={tone}
          disabled={!hasSource}
          title={hasSource ? 'רענון מהמערכת המקורית' : 'אין מקור חיצוני מחובר'}
          aria-label={hasSource ? 'רענון מהמערכת המקורית' : 'אין מקור חיצוני מחובר'}
          data-testid={NODE_ACTION_ROW_IDS.sourceBtn(nodeId)}
          onClick={onSourceClick}
        >
          <RefreshCw size={ICON_SIZE} aria-hidden="true" />
        </ActionBtn>
      )}

      <ActionBtn
        type="button"
        $tone={tone}
        title="העתק"
        aria-label="העתקת תוכן הסעיף"
        data-testid={NODE_ACTION_ROW_IDS.copyBtn(nodeId)}
        onClick={onCopy}
      >
        <Copy size={ICON_SIZE} aria-hidden="true" />
      </ActionBtn>

      {options}
    </ActionRow>
  );
};
