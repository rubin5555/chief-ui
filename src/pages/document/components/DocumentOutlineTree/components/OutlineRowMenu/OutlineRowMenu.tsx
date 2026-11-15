import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import type { MouseEvent } from 'react';
import { FloatingPanel } from '@/components/ui/FloatingPanel';
import { useFloatingPanel } from '@/hooks/useFloatingPanel';
import { RowMenuBtn } from '../../DocumentOutlineTree.shared.styles';
import { DeleteIcon, DeleteItem, MenuList, RenameIcon, RenameItem } from './OutlineRowMenu.styles';
import { OUTLINE_ROW_MENU_IDS } from './OutlineRowMenu.testids';

const PANEL_WIDTH = 130;

const TRIGGER_GAP = 4;

export interface OutlineRowMenuProps {
  nodeId: string;
  iconSize?: number;
  onRename: () => void;
  onDelete: () => void;
}

export const OutlineRowMenu = ({
  nodeId,
  iconSize = 14,
  onRename,
  onDelete,
}: OutlineRowMenuProps) => {
  const panel = useFloatingPanel<HTMLButtonElement>({ focusOnOpen: true });

  const handleToggle = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    panel.toggle((rect) => ({
      top: rect.top,
      left: rect.left - TRIGGER_GAP - PANEL_WIDTH,
    }));
  };

  const handleRename = () => {
    panel.closeWithoutRefocus();
    onRename();
  };

  const handleDelete = () => {
    panel.close();
    onDelete();
  };

  return (
    <>
      <RowMenuBtn
        ref={panel.btnRef}
        type="button"
        title="אפשרויות"
        aria-label="אפשרויות"
        data-testid={OUTLINE_ROW_MENU_IDS.trigger(nodeId)}
        onClick={handleToggle}
      >
        <MoreVertical size={iconSize} aria-hidden="true" />
      </RowMenuBtn>

      {panel.open && panel.pos && (
        <FloatingPanel
          ref={panel.panelRef}
          pos={panel.pos}
          width={PANEL_WIDTH}
          dir="rtl"
          data-testid={OUTLINE_ROW_MENU_IDS.panel(nodeId)}
        >
          <MenuList>
            <RenameItem
              type="button"
              data-testid={OUTLINE_ROW_MENU_IDS.renameAction}
              onClick={handleRename}
            >
              <RenameIcon>
                <Pencil size={14} aria-hidden="true" />
              </RenameIcon>
              שינוי שם
            </RenameItem>

            <DeleteItem
              type="button"
              data-testid={OUTLINE_ROW_MENU_IDS.deleteAction}
              onClick={handleDelete}
            >
              <DeleteIcon>
                <Trash2 size={14} aria-hidden="true" />
              </DeleteIcon>
              מחיקה
            </DeleteItem>
          </MenuList>
        </FloatingPanel>
      )}
    </>
  );
};
