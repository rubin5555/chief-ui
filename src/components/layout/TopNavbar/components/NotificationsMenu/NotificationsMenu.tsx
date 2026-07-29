import { useState } from 'react';
import { useFloatingPanel } from '@/hooks/useFloatingPanel';
import { NotificationsPanel } from './controls/NotificationsPanel';
import { NotificationsTriggerButton } from './controls/NotificationsTriggerButton';
import { useNotificationsMenuAnalytics } from './NotificationsMenu.analytics';
import { PANEL_WIDTH } from './NotificationsMenu.constants';

// This component is the only place that owns analytics tracking for the menu — the
// controls/ subcomponents are dumb and receive already-composed callbacks.
export const NotificationsMenu = () => {
  const [hasUnread, setHasUnread] = useState(true);
  const panel = useFloatingPanel({ focusOnOpen: true });
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
      <NotificationsTriggerButton
        ref={panel.btnRef}
        isOpen={panel.open}
        hasUnread={hasUnread}
        onClick={onToggle}
      />

      {panel.open && panel.pos && (
        <NotificationsPanel
          panelRef={panel.panelRef}
          pos={panel.pos}
          width={PANEL_WIDTH}
          onMarkAllRead={onMarkAllRead}
        />
      )}
    </>
  );
};
