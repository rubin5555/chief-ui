import { MessageCircle } from 'lucide-react';
import { forwardRef } from 'react';
import { IconButtonRoot } from '@/components/ui/IconButton';
import { SUPPORT_MENU_IDS } from '../../SupportMenu.testids';

interface SupportTriggerButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export const SupportTriggerButton = forwardRef<HTMLButtonElement, SupportTriggerButtonProps>(
  ({ isOpen, onClick }, ref) => (
    <IconButtonRoot
      ref={ref}
      type="button"
      $isActive={isOpen}
      aria-label="תמיכה"
      data-testid={SUPPORT_MENU_IDS.trigger}
      onClick={onClick}
    >
      <MessageCircle size={20} />
    </IconButtonRoot>
  ),
);
SupportTriggerButton.displayName = 'SupportTriggerButton';
