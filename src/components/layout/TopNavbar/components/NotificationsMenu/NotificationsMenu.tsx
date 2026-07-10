import { Bell, Eye, PenLine } from 'lucide-react';
import { useState } from 'react';
import { FloatingPanel } from '@/components/ui/FloatingPanel';
import { IconButtonBadge, IconButtonRoot } from '@/components/ui/IconButton/IconButton.styles';
import { useFloatingPanel } from '@/hooks/useFloatingPanel';
import { colors } from '@/styles/theme';
import { useNotificationsMenuAnalytics } from './NotificationsMenu.analytics';
import { NOTIFICATION_ICONS, NOTIFICATIONS, PANEL_WIDTH } from './NotificationsMenu.constants';
import {
  EmptyState,
  MarkAllReadBtn,
  NotificationBody,
  NotificationIconWrap,
  NotificationItemRow,
  NotificationList,
  NotificationText,
  NotificationTime,
  PanelHeader,
  PanelTitle,
} from './NotificationsMenu.styles';
import { NOTIFICATIONS_MENU_IDS } from './NotificationsMenu.testids';

export const NotificationsMenu = () => {
  const [hasUnread, setHasUnread] = useState(true);
  const panel = useFloatingPanel();
  const { trackPanelOpened, trackMarkAllRead } = useNotificationsMenuAnalytics();

  const onToggle = () => {
    if (!panel.open) trackPanelOpened();
    panel.toggle(PANEL_WIDTH);
  };

  const onMarkAllRead = () => {
    setHasUnread(false);
    trackMarkAllRead();
  };

  return (
    <>
      <IconButtonRoot
        ref={panel.btnRef}
        type="button"
        $isActive={panel.open}
        aria-label="התראות"
        data-testid={NOTIFICATIONS_MENU_IDS.trigger}
        onClick={onToggle}
      >
        <Bell size={20} />
        {hasUnread && <IconButtonBadge />}
      </IconButtonRoot>

      {panel.open && panel.pos && (
        <FloatingPanel
          ref={panel.panelRef}
          data-testid={NOTIFICATIONS_MENU_IDS.panel}
          $pos={panel.pos}
          $width={PANEL_WIDTH}
        >
          <PanelHeader>
            <PanelTitle>התראות</PanelTitle>
            <MarkAllReadBtn
              type="button"
              data-testid={NOTIFICATIONS_MENU_IDS.markAllRead}
              onClick={onMarkAllRead}
            >
              סמן הכל כנקרא
            </MarkAllReadBtn>
          </PanelHeader>

          <NotificationList>
            {NOTIFICATIONS.length === 0 ? (
              <EmptyState data-testid={NOTIFICATIONS_MENU_IDS.empty}>אין התראות חדשות</EmptyState>
            ) : (
              NOTIFICATIONS.map((notification) => (
                <NotificationItemRow
                  key={notification.id}
                  data-testid={NOTIFICATIONS_MENU_IDS.item(notification.id)}
                >
                  <NotificationIconWrap>
                    {notification.icon === NOTIFICATION_ICONS.VIEW ? (
                      <Eye size={14} color={colors.primary} />
                    ) : (
                      <PenLine size={14} color={colors.primary} />
                    )}
                  </NotificationIconWrap>
                  <NotificationBody>
                    <NotificationText>{notification.text}</NotificationText>
                    <NotificationTime>{notification.time}</NotificationTime>
                  </NotificationBody>
                </NotificationItemRow>
              ))
            )}
          </NotificationList>
        </FloatingPanel>
      )}
    </>
  );
};
