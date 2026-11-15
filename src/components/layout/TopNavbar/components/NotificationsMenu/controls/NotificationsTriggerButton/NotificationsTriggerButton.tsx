import { Bell } from 'lucide-react';
import { forwardRef } from 'react';
import { IconButtonBadge, IconButtonRoot } from '@/components/ui/IconButton';
import { NOTIFICATIONS_MENU_IDS } from '../../NotificationsMenu.testids';

interface NotificationsTriggerButtonProps {
  isOpen: boolean;
  hasUnread: boolean;
  onClick: () => void;
}

export const NotificationsTriggerButton = forwardRef<
  HTMLButtonElement,
  NotificationsTriggerButtonProps
>(({ isOpen, hasUnread, onClick }, ref) => (
  <IconButtonRoot
    ref={ref}
    type="button"
    $isActive={isOpen}
    aria-label="התראות"
    data-testid={NOTIFICATIONS_MENU_IDS.trigger}
    onClick={onClick}
  >
    <Bell size={20} />
    {hasUnread && <IconButtonBadge />}
  </IconButtonRoot>
));
NotificationsTriggerButton.displayName = 'NotificationsTriggerButton';
