import { Copy, FileText, Plus } from 'lucide-react';
import { TRIGGER_GAP, useFloatingPanel } from '@/hooks/useFloatingPanel';
import { DOCUMENT_CATALOG_IDS } from '../../DocumentCatalog.testids';
import {
  DropdownItem,
  DropdownItemIcon,
  DropdownPanel,
  NewDocButton,
} from './NewDocDropdown.styles';

interface NewDocDropdownProps {
  onNew: () => void;
  onDuplicate: () => void;
}

// The mock hangs the panel off the button's near edge, and lets its two items
// decide how wide it is.
const PANEL_MIN_WIDTH = 200;
const panelSpec = (trigger: DOMRect) => ({ top: trigger.bottom + TRIGGER_GAP, left: trigger.left });

// Two ways to start a document: from nothing, or from one that already exists.
// Both end in the same dialog — the second one seeds it.
export const NewDocDropdown = ({ onNew, onDuplicate }: NewDocDropdownProps) => {
  const panel = useFloatingPanel<HTMLButtonElement>();

  const onToggle = () => panel.toggle(panelSpec);

  const runAndClose = (action: () => void) => () => {
    panel.close();
    action();
  };

  return (
    <>
      <NewDocButton
        ref={panel.btnRef}
        type="button"
        data-testid={DOCUMENT_CATALOG_IDS.newDocBtn}
        onClick={onToggle}
      >
        <Plus size={16} />
        <span>מסמך חדש</span>
      </NewDocButton>

      {panel.open && panel.pos && (
        <DropdownPanel ref={panel.panelRef} pos={panel.pos} minWidth={PANEL_MIN_WIDTH} dir="rtl">
          <DropdownItem
            type="button"
            data-testid={DOCUMENT_CATALOG_IDS.newDocOption}
            onClick={runAndClose(onNew)}
          >
            <DropdownItemIcon>
              <FileText size={16} />
            </DropdownItemIcon>
            פתיחת מסמך חדש
          </DropdownItem>
          <DropdownItem
            type="button"
            data-testid={DOCUMENT_CATALOG_IDS.duplicateDocOption}
            onClick={runAndClose(onDuplicate)}
          >
            <DropdownItemIcon>
              <Copy size={16} />
            </DropdownItemIcon>
            שכפול מסמך קיים
          </DropdownItem>
        </DropdownPanel>
      )}
    </>
  );
};
