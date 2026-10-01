import { RotateCcw } from 'lucide-react';
import type { AddActionId } from './components/AddMenu';
import { AddMenu } from './components/AddMenu';
import { FabButton } from './SidebarFabRow.shared.styles';
import { FabRow } from './SidebarFabRow.styles';
import { SIDEBAR_FAB_ROW_IDS } from './SidebarFabRow.testids';

export interface SidebarFabRowProps {
  onRestoreClick: () => void;
  onAddAction: (action: AddActionId) => void;
}

export const SidebarFabRow = ({ onRestoreClick, onAddAction }: SidebarFabRowProps) => (
  <FabRow data-testid={SIDEBAR_FAB_ROW_IDS.root}>
    <FabButton
      type="button"
      title="שחזר סעיף שנמחק"
      aria-label="שחזר סעיף שנמחק"
      data-testid={SIDEBAR_FAB_ROW_IDS.restoreBtn}
      onClick={onRestoreClick}
    >
      <RotateCcw size={16} aria-hidden="true" />
    </FabButton>

    <AddMenu onSelect={onAddAction} />
  </FabRow>
);
