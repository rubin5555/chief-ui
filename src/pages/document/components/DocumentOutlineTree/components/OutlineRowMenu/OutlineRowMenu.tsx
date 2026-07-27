import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import type { MouseEvent } from 'react';
import { FloatingPanel } from '@/components/ui/FloatingPanel';
import { useFloatingPanel } from '@/hooks/useFloatingPanel';
import { RowMenuBtn } from '../../DocumentOutlineTree.shared.styles';
import { DeleteIcon, DeleteItem, MenuList, RenameIcon, RenameItem } from './OutlineRowMenu.styles';
import { OUTLINE_ROW_MENU_IDS } from './OutlineRowMenu.testids';

const PANEL_WIDTH = 130;
/** Clears the trigger without a visible seam, matching main's `rect.left + 4`. */
const TRIGGER_GAP = 4;

export interface OutlineRowMenuProps {
  nodeId: string;
  /** Sized down for the two deeper levels, as in main. */
  iconSize?: number;
  onRename: () => void;
  onDelete: () => void;
}

// Every outline row's 3-dots menu: rename, or delete.
//
// One instance per row, each with its own useFloatingPanel — rather than main's
// single page-level `itemMenu` object carrying the target id, its coordinates and
// two closures (Edit.tsx:3948). A per-row instance is what lets the panel anchor
// off its own trigger's rect, and it deletes the whole class of bug where the menu
// is open against a row that has since moved.
export const OutlineRowMenu = ({
  nodeId,
  iconSize = 14,
  onRename,
  onDelete,
}: OutlineRowMenuProps) => {
  const panel = useFloatingPanel<HTMLButtonElement>();

  // The rows above are click-to-expand and drag-to-reorder; without this, opening
  // a topic's menu would also collapse it.
  const handleToggle = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    panel.toggle((rect) => ({
      top: rect.top,
      left: rect.left - TRIGGER_GAP - PANEL_WIDTH,
    }));
  };

  // The rename field opens where this row's title is and focuses itself, so the
  // panel must not pull focus back to the trigger — the field commits on blur and
  // would close again immediately.
  const handleRename = () => {
    panel.closeWithoutRefocus();
    onRename();
  };

  // Delete does return focus to the trigger, which is what the confirm dialog then
  // captures as the element to restore to when it closes.
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
          $pos={panel.pos}
          $width={PANEL_WIDTH}
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
