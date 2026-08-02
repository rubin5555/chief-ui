import { Check, Loader2 } from 'lucide-react';
import { useRef } from 'react';
import { ModalPortal } from '@/components/ui/ModalPortal';
import { useClickOutside } from '@/hooks/useClickOutside';
import type { RowAction } from './RowActionMenu.constants';
import { INLINE_PHASE_ACTIONS } from './RowActionMenu.constants';
import {
  MenuItem,
  MenuItemIcon,
  MenuItemLabel,
  MenuLayer,
  MenuPanel,
  MenuSeparator,
  PhaseDone,
  PhaseSpinner,
} from './RowActionMenu.styles';

export interface RowMenuAnchor {
  top?: number;
  bottom?: number;
  left: number;
}

export interface RowActionPhase {
  label: string;
  phase: 'loading' | 'done';
}

interface RowActionMenuProps {
  actions: RowAction[];
  anchor: RowMenuAnchor;
  phase: RowActionPhase | null;
  onAction: (label: string) => void;
  onClose: () => void;
}

// The menu opens below its trigger unless the trigger sits low enough that it
// would run off the bottom, in which case it hangs above instead. Measured from
// the trigger's rect at click time — see `rowMenuAnchor`.
const FLIP_THRESHOLD = 0.55;
const GAP = 6;

export const rowMenuAnchor = (rect: DOMRect): RowMenuAnchor => {
  const flipped = rect.bottom > window.innerHeight * FLIP_THRESHOLD;
  return flipped
    ? { bottom: window.innerHeight - rect.top + GAP, left: rect.left }
    : { top: rect.bottom + GAP, left: rect.left };
};

export const RowActionMenu = ({
  actions,
  anchor,
  phase,
  onAction,
  onClose,
}: RowActionMenuProps) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useClickOutside([panelRef], onClose);

  // An inline action reports back inside the menu, so it must not close it;
  // everything else does.
  const handleAction = (label: string) => () => {
    onAction(label);
    if (!INLINE_PHASE_ACTIONS.has(label)) onClose();
  };

  return (
    <ModalPortal>
      <MenuLayer $top={anchor.top} $bottom={anchor.bottom} $left={anchor.left}>
        <MenuPanel ref={panelRef} dir="rtl">
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
      </MenuLayer>
    </ModalPortal>
  );
};
