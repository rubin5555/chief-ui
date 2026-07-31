import { RefreshCw } from 'lucide-react';
import { lazy, Suspense, useState } from 'react';
import { chunkGuard } from '../../../../../../utils/chunkRecovery';
import type { SourceOrigin } from '../../../../types';
import type { ActionTone } from '../../NodeActionRow.shared.styles';
import { ACTION_ICON_SIZE, ActionBtn } from '../../NodeActionRow.shared.styles';
import { SOURCE_REFRESH_BUTTON_IDS } from './SourceRefreshButton.testids';

const SourceSystemsModal = lazy(
  chunkGuard(() =>
    import('../../../SourceSystemsModal').then((m) => ({ default: m.SourceSystemsModal })),
  ),
);

export interface SourceRefreshButtonProps {
  nodeId: string;
  sourceOrigin?: SourceOrigin[];
  tone: ActionTone;
}

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
