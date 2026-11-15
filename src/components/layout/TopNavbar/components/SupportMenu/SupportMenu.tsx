import { useState } from 'react';
import { useFloatingPanel } from '@/hooks/useFloatingPanel';
import { ContactPermissionsModal } from '@/modals/ContactPermissionsModal';
import { SupportOptionsPanel } from './controls/SupportOptionsPanel';
import { SupportTriggerButton } from './controls/SupportTriggerButton';
import { useSupportMenuAnalytics } from './SupportMenu.analytics';
import { PANEL_WIDTH } from './SupportMenu.constants';

export const SupportMenu = () => {
  const [showPermissions, setShowPermissions] = useState(false);
  const panel = useFloatingPanel({ focusOnOpen: true });
  const { trackPanelOpened, trackPermissionsRequested, trackSupportChatOpened } =
    useSupportMenuAnalytics();

  const onToggle = () => {
    if (!panel.open) trackPanelOpened();
    panel.toggle(PANEL_WIDTH);
  };

  const onPermissionsClick = () => {
    setShowPermissions(true);
    panel.close();
    trackPermissionsRequested();
  };

  const onChatClick = () => trackSupportChatOpened();

  const onPermissionsModalClose = () => setShowPermissions(false);

  return (
    <>
      <SupportTriggerButton ref={panel.btnRef} isOpen={panel.open} onClick={onToggle} />

      {panel.open && panel.pos && (
        <SupportOptionsPanel
          panelRef={panel.panelRef}
          pos={panel.pos}
          width={PANEL_WIDTH}
          onPermissionsClick={onPermissionsClick}
          onChatClick={onChatClick}
        />
      )}

      {showPermissions && <ContactPermissionsModal onClose={onPermissionsModalClose} />}
    </>
  );
};
