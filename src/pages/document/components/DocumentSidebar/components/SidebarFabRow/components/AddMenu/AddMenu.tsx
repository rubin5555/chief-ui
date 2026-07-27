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

// The `+` at the bottom of the sidebar and the four things it can add.
//
// main positions this by hand — `bottom: window.innerHeight - rect.top + 8` — to
// make it open upward from a button that sits at the bottom of the viewport
// (Edit.tsx:3569). useFloatingPanel flips it upward on its own when there isn't
// room below, so the anchor here just asks for "below the button" and gets the
// flip, the viewport clamp, outside-click and Escape for free.
export const AddMenu = ({ onSelect }: AddMenuProps) => {
  const panel = useFloatingPanel<HTMLButtonElement>();

  const handleToggle = () => panel.toggle((rect) => ({ top: rect.bottom + 6, left: rect.left }));

  // Every one of these four actions hands focus onward — to a new topic's name
  // field, or to a modal — so none of them wants it back on the `+`. Returning it
  // would blur the name field in the commit it appeared and discard the new topic.
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
          $pos={panel.pos}
          $width={PANEL_WIDTH}
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
