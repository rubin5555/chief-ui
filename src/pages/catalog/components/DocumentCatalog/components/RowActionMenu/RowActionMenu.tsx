import { Check, Loader2 } from 'lucide-react';
import { useRef } from 'react';
import { useClickOutside } from '@/hooks/useClickOutside';
import { TRIGGER_GAP, useRectAnchoredPos } from '@/hooks/useFloatingPanel';
import { DOCUMENT_CATALOG_IDS } from '../../DocumentCatalog.testids';
import type { RowAction } from './RowActionMenu.constants';
import { INLINE_PHASE_ACTIONS } from './RowActionMenu.constants';
import {
  MenuItem,
  MenuItemIcon,
  MenuItemLabel,
  MenuPanel,
  MenuSeparator,
  PhaseDone,
  PhaseSpinner,
} from './RowActionMenu.styles';

export interface RowActionPhase {
  label: string;
  phase: 'loading' | 'done';
}

interface RowActionMenuProps {
  actions: RowAction[];
  // The rect of the button the menu was opened from, captured at click time —
  // the trigger is a cell in a virtualised table, so it may be recycled out
  // from under the menu while it is open.
  triggerRect: DOMRect;
  phase: RowActionPhase | null;
  onAction: (label: string) => void;
  onClose: () => void;
}

// The mock hangs the menu off the trigger's near edge. It opens below unless
// the whole menu cannot fit there — a `distributed` row's menu is fourteen
// items tall, so on most screens it hangs above instead.
const MENU_MIN_WIDTH = 210;
const menuSpec = (trigger: DOMRect) => ({ top: trigger.bottom + TRIGGER_GAP, left: trigger.left });

export const RowActionMenu = ({
  actions,
  triggerRect,
  phase,
  onAction,
  onClose,
}: RowActionMenuProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const pos = useRectAnchoredPos(triggerRect, menuSpec, panelRef);

  useClickOutside([panelRef], onClose);

  // An inline action reports back inside the menu, so it must not close it;
  // everything else does.
  const handleAction = (label: string) => () => {
    onAction(label);
    if (!INLINE_PHASE_ACTIONS.has(label)) onClose();
  };

  return (
    <MenuPanel
      ref={panelRef}
      pos={pos}
      minWidth={MENU_MIN_WIDTH}
      dir="rtl"
      data-testid={DOCUMENT_CATALOG_IDS.rowMenuPanel}
    >
      {actions.map((action, index) => {
        if ('sep' in action) {
          // Separators have no identity of their own; their position in a
          // static array is the only thing that distinguishes them.
          const previous = actions[index - 1];
          const key = previous && 'label' in previous ? `sep-after-${previous.label}` : 'sep';
          return <MenuSeparator key={key} />;
        }

        const { label, Icon, danger } = action;
        const activePhase = phase?.label === label ? phase.phase : null;

        return (
          <MenuItem key={label} type="button" $danger={danger} onClick={handleAction(label)}>
            <MenuItemIcon $danger={danger}>
              <Icon size={16} />
            </MenuItemIcon>
            <MenuItemLabel>{label}</MenuItemLabel>
            {activePhase === 'loading' && (
              <PhaseSpinner>
                <Loader2 size={14} />
              </PhaseSpinner>
            )}
            {activePhase === 'done' && (
              <PhaseDone>
                <Check size={14} />
              </PhaseDone>
            )}
          </MenuItem>
        );
      })}
    </MenuPanel>
  );
};
