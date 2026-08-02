import { Copy, FileText, Plus } from 'lucide-react';
import { useRef, useState } from 'react';
import { useClickOutside } from '@/hooks/useClickOutside';
import { DOCUMENT_CATALOG_IDS } from '../../DocumentCatalog.testids';
import {
  DropdownAnchor,
  DropdownItem,
  DropdownItemIcon,
  DropdownPanel,
  NewDocButton,
} from './NewDocDropdown.styles';

interface NewDocDropdownProps {
  onNew: () => void;
  onDuplicate: () => void;
}

// Two ways to start a document: from nothing, or from one that already exists.
// Both end in the same dialog — the second one seeds it.
export const NewDocDropdown = ({ onNew, onDuplicate }: NewDocDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  useClickOutside([anchorRef], () => setIsOpen(false), isOpen);

  const onToggle = () => setIsOpen((prev) => !prev);

  const runAndClose = (action: () => void) => () => {
    setIsOpen(false);
    action();
  };

  return (
    <DropdownAnchor ref={anchorRef}>
      <NewDocButton type="button" data-testid={DOCUMENT_CATALOG_IDS.newDocBtn} onClick={onToggle}>
        <Plus size={16} />
        <span>מסמך חדש</span>
      </NewDocButton>

      {isOpen && (
        <DropdownPanel dir="rtl">
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
    </DropdownAnchor>
  );
};
