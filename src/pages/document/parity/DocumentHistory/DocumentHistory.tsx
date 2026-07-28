import { Redo2, Save, Undo2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { SaveVersionModal } from './components/SaveVersionModal';
import { HistoryRow, PastNotice } from './DocumentHistory.styles';
import { DOCUMENT_HISTORY_IDS } from './DocumentHistory.testids';
import type { useContentHistory } from './useContentHistory';

export interface DocumentHistoryProps {
  nodeId: string;
  /** Passed whole rather than as five callbacks — the hook is one object. */
  history: ReturnType<typeof useContentHistory>;
  onRestore: (content: string) => void;
}

const ICON_SIZE = 14;

// The controls main's history stacks never had: nothing in Edit.tsx renders
// `handleUndo`, `handleRedo` or `confirmSaveVersion`, so there is no design of
// main's to match here — this is the smallest honest surface for what the hook
// can do, and the README says as much.
export const DocumentHistory = ({ nodeId, history, onRestore }: DocumentHistoryProps) => {
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const { canUndo, canRedo, isInPast } = history.getState(nodeId);

  const handleUndo = () => {
    const content = history.undo(nodeId);
    if (content !== null) onRestore(content);
  };

  const handleRedo = () => {
    const content = history.redo(nodeId);
    if (content !== null) onRestore(content);
  };

  const handleOpenSave = () => setIsSaveOpen(true);
  const handleCloseSave = () => setIsSaveOpen(false);
  const handleConfirmSave = () => history.saveVersion(nodeId);

  return (
    <HistoryRow data-testid={DOCUMENT_HISTORY_IDS.root}>
      <Button
        type="button"
        variant="outline"
        size="xs"
        disabled={!canUndo}
        aria-label="בטל שינוי"
        onClick={handleUndo}
        data-testid={DOCUMENT_HISTORY_IDS.undo}
      >
        <Undo2 size={ICON_SIZE} aria-hidden="true" />
        ביטול
      </Button>

      <Button
        type="button"
        variant="outline"
        size="xs"
        disabled={!canRedo}
        aria-label="בצע מחדש"
        onClick={handleRedo}
        data-testid={DOCUMENT_HISTORY_IDS.redo}
      >
        <Redo2 size={ICON_SIZE} aria-hidden="true" />
        בצע מחדש
      </Button>

      <Button
        type="button"
        size="xs"
        aria-label="שמור גרסה"
        onClick={handleOpenSave}
        data-testid={DOCUMENT_HISTORY_IDS.saveVersion}
      >
        <Save size={ICON_SIZE} aria-hidden="true" />
        שמור גרסה
      </Button>

      {/* The one thing worth saying out loud: what is on screen is not the newest
          version, so saving now throws the rest away. */}
      {isInPast && (
        <PastNotice data-testid={DOCUMENT_HISTORY_IDS.pastNotice}>מוצגת גרסה קודמת</PastNotice>
      )}

      {isSaveOpen && <SaveVersionModal onConfirm={handleConfirmSave} onClose={handleCloseSave} />}
    </HistoryRow>
  );
};
