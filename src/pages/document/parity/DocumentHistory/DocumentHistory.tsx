import { Redo2, Save, Undo2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { SaveVersionModal } from './components/SaveVersionModal';
import { HistoryRow, PastNotice } from './DocumentHistory.styles';
import { DOCUMENT_HISTORY_IDS } from './DocumentHistory.testids';
import type { useContentHistory } from './useContentHistory';

export interface DocumentHistoryProps {
  nodeId: string;
  history: ReturnType<typeof useContentHistory>;
  onRestore: (content: string) => void;
}

const ICON_SIZE = 14;

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

      {isInPast && (
        <PastNotice data-testid={DOCUMENT_HISTORY_IDS.pastNotice}>מוצגת גרסה קודמת</PastNotice>
      )}

      {isSaveOpen && <SaveVersionModal onConfirm={handleConfirmSave} onClose={handleCloseSave} />}
    </HistoryRow>
  );
};
