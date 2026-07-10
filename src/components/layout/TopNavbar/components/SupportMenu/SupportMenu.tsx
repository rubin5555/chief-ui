import { ExternalLink, Lock, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import {
  PanelBody,
  PanelOption,
  PanelOptionLabel,
} from '@/components/layout/TopNavbar/TopNavPanel.styles';
import { FloatingPanel } from '@/components/ui/FloatingPanel';
import { IconButtonRoot } from '@/components/ui/IconButton/IconButton.styles';
import { useFloatingPanel } from '@/hooks/useFloatingPanel';
import { ContactPermissionsModal } from '@/modals/ContactPermissionsModal';
import { gray } from '@/styles/theme';
import { useSupportMenuAnalytics } from './SupportMenu.analytics';
import { PANEL_WIDTH } from './SupportMenu.constants';
import { SUPPORT_MENU_IDS } from './SupportMenu.testids';

export const SupportMenu = () => {
  const [showPermissions, setShowPermissions] = useState(false);
  const panel = useFloatingPanel();
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

  const onChatClick = () => {
    trackSupportChatOpened();
  };

  const onPermissionsModalClose = () => setShowPermissions(false);

  return (
    <>
      <IconButtonRoot
        ref={panel.btnRef}
        type="button"
        $isActive={panel.open}
        aria-label="תמיכה"
        data-testid={SUPPORT_MENU_IDS.trigger}
        onClick={onToggle}
      >
        <MessageCircle size={20} />
      </IconButtonRoot>

      {panel.open && panel.pos && (
        <FloatingPanel
          ref={panel.panelRef}
          data-testid={SUPPORT_MENU_IDS.panel}
          $pos={panel.pos}
          $width={PANEL_WIDTH}
        >
          <PanelBody>
            <PanelOption
              type="button"
              data-testid={SUPPORT_MENU_IDS.permissionsOption}
              onClick={onPermissionsClick}
            >
              <Lock size={16} color={gray[500]} />
              <PanelOptionLabel>הרשאות</PanelOptionLabel>
            </PanelOption>
            <PanelOption
              type="button"
              data-testid={SUPPORT_MENU_IDS.chatOption}
              onClick={onChatClick}
            >
              <MessageCircle size={16} color={gray[500]} />
              <PanelOptionLabel>צ'אט תמיכה</PanelOptionLabel>
              <ExternalLink size={14} color={gray[400]} />
            </PanelOption>
          </PanelBody>
        </FloatingPanel>
      )}

      {showPermissions && <ContactPermissionsModal onClose={onPermissionsModalClose} />}
    </>
  );
};
