import { Eye, PenLine } from 'lucide-react';
import type { RefObject } from 'react';
import { FloatingPanel } from '@/components/ui/FloatingPanel';
import type { Pos } from '@/hooks/useFloatingPanel';
import { colors } from '@/styles/theme';
import { NOTIFICATION_ICONS, NOTIFICATIONS } from '../../NotificationsMenu.constants';
import { NOTIFICATIONS_MENU_IDS } from '../../NotificationsMenu.testids';
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
} from './NotificationsPanel.styles';

interface NotificationsPanelProps {
  panelRef: RefObject<HTMLDivElement | null>;
  pos: Pos;
  width: number;
  onMarkAllRead: () => void;
}

export const NotificationsPanel = ({
  panelRef,
  pos,
  width,
  onMarkAllRead,
}: NotificationsPanelProps) => (
  <FloatingPanel ref={panelRef} data-testid={NOTIFICATIONS_MENU_IDS.panel} pos={pos} width={width}>
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
);
