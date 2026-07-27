import { RefreshCw } from 'lucide-react';
import { lazy, Suspense, useState } from 'react';
import type { SourceOrigin } from '../../../../types';
import type { ActionTone } from '../../NodeActionRow.shared.styles';
import { ACTION_ICON_SIZE, ActionBtn } from '../../NodeActionRow.shared.styles';
import { SOURCE_REFRESH_BUTTON_IDS } from './SourceRefreshButton.testids';

const SourceSystemsModal = lazy(() =>
  import('../../../SourceSystemsModal').then((m) => ({ default: m.SourceSystemsModal })),
);

export interface SourceRefreshButtonProps {
  nodeId: string;
  /** Absent or empty means there is no external system behind this node. */
  sourceOrigin?: SourceOrigin[];
  tone: ActionTone;
}

// main's per-node refresh button (Edit.tsx:4268): enabled on a node whose content
// came from an external system, pale and disabled on one that has none.
//
// **Divergence.** main's enabled version has no `onClick` — there is no refresh to
// perform, in main or here, because nothing is connected to refresh from. Rather
// than render a live-looking button that does nothing, this one opens the source
// modal for its own node, which is the honest answer to "where would this come
// from". The disabled case, its wording, and the look are main's exactly.
export const SourceRefreshButton = ({ nodeId, sourceOrigin, tone }: SourceRefreshButtonProps) => {
  const [showModal, setShowModal] = useState(false);
  const systems = sourceOrigin ?? [];
  const hasSource = systems.length > 0;

  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const label = hasSource ? 'רענן נתונים ממערכת מקור' : 'אין מקור חיצוני מחובר';

  return (
    <>
      <ActionBtn
        type="button"
        $tone={tone}
        disabled={!hasSource}
        title={label}
        aria-label={label}
        data-testid={SOURCE_REFRESH_BUTTON_IDS.root(nodeId)}
        onClick={handleOpen}
      >
        <RefreshCw size={ACTION_ICON_SIZE} aria-hidden="true" />
      </ActionBtn>

      <Suspense fallback={null}>
        {showModal && <SourceSystemsModal systems={systems} scope="node" onClose={handleClose} />}
      </Suspense>
    </>
  );
};
