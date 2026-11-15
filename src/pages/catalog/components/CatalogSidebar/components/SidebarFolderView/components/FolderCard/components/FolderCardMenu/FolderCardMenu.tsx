import { FolderOpen, Pencil, Trash2 } from 'lucide-react';
import type { MouseEvent } from 'react';
import { useRef, useState } from 'react';
import { useClickOutside } from '@/hooks/useClickOutside';
import { CATALOG_SIDEBAR_IDS } from '../../../../../../CatalogSidebar.testids';
import {
  MenuAnchor,
  MenuItem,
  MenuItemIcon,
  MenuPanel,
  MenuSeparator,
  MenuTrigger,
} from './FolderCardMenu.styles';

interface FolderCardMenuProps {
  folderId: string;
  onSelectedRow: boolean;
  onRenameClick: () => void;
  onAddSubClick: () => void;
  onDeleteClick: () => void;
}

export const FolderCardMenu = ({
  folderId,
  onSelectedRow,
  onRenameClick,
  onAddSubClick,
  onDeleteClick,
}: FolderCardMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  useClickOutside([anchorRef], () => setIsOpen(false), isOpen);

  const onToggle = (event: MouseEvent) => {
    event.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  // Every item closes the menu and then does its thing, so the three handlers
  // are one factory rather than three near-identical closures.
  const runAndClose = (action: () => void) => (event: MouseEvent) => {
    event.stopPropagation();
    setIsOpen(false);
    action();
  };

  return (
    <MenuAnchor ref={anchorRef}>
      {/* `data-folder-menu` is what FolderCard's hover rule targets — the
          trigger only appears when the row is hovered, and it is a grandchild
          of the row that does the hovering. */}
      <MenuTrigger
        type="button"
        data-folder-menu
        $onSelectedRow={onSelectedRow}
        data-testid={CATALOG_SIDEBAR_IDS.folderMenuBtn(folderId)}
        onClick={onToggle}
      >
        ···
      </MenuTrigger>

      {isOpen && (
        <MenuPanel dir="rtl">
          <MenuItem type="button" onClick={runAndClose(onRenameClick)}>
            <MenuItemIcon>
              <Pencil size={14} />
            </MenuItemIcon>
            שינוי שם
          </MenuItem>
          <MenuItem type="button" onClick={runAndClose(onAddSubClick)}>
            <MenuItemIcon>
              <FolderOpen size={14} />
            </MenuItemIcon>
            יצירת תת תיקייה
          </MenuItem>
          <MenuSeparator />
          <MenuItem type="button" $danger onClick={runAndClose(onDeleteClick)}>
            <MenuItemIcon $danger>
              <Trash2 size={14} />
            </MenuItemIcon>
            מחיקת תיקייה
          </MenuItem>
        </MenuPanel>
      )}
    </MenuAnchor>
  );
};
