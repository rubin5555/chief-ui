import { Plus } from 'lucide-react';
import { FloatingPanel } from '@/components/ui/FloatingPanel';
import { useFloatingPanel } from '@/hooks/useFloatingPanel';
import { FabButton } from '../../SidebarFabRow.shared.styles';
import type { AddActionId } from './AddMenu.constants';
import { ADD_ACTIONS } from './AddMenu.constants';
import { MenuIcon, MenuItem, MenuList } from './AddMenu.styles';
import { ADD_MENU_IDS } from './AddMenu.testids';

const PANEL_WIDTH = 220;

export interface AddMenuProps {
  onSelect: (action: AddActionId) => void;
}

export const AddMenu = ({ onSelect }: AddMenuProps) => {
  const panel = useFloatingPanel<HTMLButtonElement>({ focusOnOpen: true });

  const handleToggle = () => panel.toggle((rect) => ({ top: rect.bottom + 6, left: rect.left }));

  const handleSelect = (action: AddActionId) => () => {
    onSelect(action);
    panel.closeWithoutRefocus();
  };

  return (
    <>
      <FabButton
        ref={panel.btnRef}
        type="button"
        title="הוסף סעיף / נושא"
        aria-label="הוסף סעיף / נושא"
        data-testid={ADD_MENU_IDS.trigger}
        onClick={handleToggle}
      >
        <Plus size={16} aria-hidden="true" />
      </FabButton>

      {panel.open && panel.pos && (
        <FloatingPanel
          ref={panel.panelRef}
          pos={panel.pos}
          width={PANEL_WIDTH}
          dir="rtl"
          data-testid={ADD_MENU_IDS.panel}
        >
          <MenuList>
            {ADD_ACTIONS.map(({ id, label, Icon }) => (
              <MenuItem
                key={id}
                type="button"
                data-testid={ADD_MENU_IDS.action(id)}
                onClick={handleSelect(id)}
              >
                <MenuIcon>
                  <Icon size={16} aria-hidden="true" />
                </MenuIcon>
                {label}
              </MenuItem>
            ))}
          </MenuList>
        </FloatingPanel>
      )}
    </>
  );
};
