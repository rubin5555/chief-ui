import { ExternalLink, Lock, MessageCircle } from 'lucide-react';
import type { RefObject } from 'react';
import {
  PanelBody,
  PanelOption,
  PanelOptionLabel,
} from '@/components/layout/TopNavbar/TopNavPanel.styles';
import { FloatingPanel } from '@/components/ui/FloatingPanel';
import type { Pos } from '@/hooks/useFloatingPanel';
import { gray } from '@/styles/theme';
import { SUPPORT_MENU_IDS } from '../../SupportMenu.testids';

interface SupportOptionsPanelProps {
  panelRef: RefObject<HTMLDivElement | null>;
  pos: Pos;
  width: number;
  onPermissionsClick: () => void;
  onChatClick: () => void;
}

export const SupportOptionsPanel = ({
  panelRef,
  pos,
  width,
  onPermissionsClick,
  onChatClick,
}: SupportOptionsPanelProps) => (
  <FloatingPanel ref={panelRef} data-testid={SUPPORT_MENU_IDS.panel} pos={pos} width={width}>
    <PanelBody>
      <PanelOption
        type="button"
        data-testid={SUPPORT_MENU_IDS.permissionsOption}
        onClick={onPermissionsClick}
      >
        <Lock size={16} color={gray[500]} />
        <PanelOptionLabel>הרשאות</PanelOptionLabel>
      </PanelOption>
      <PanelOption type="button" data-testid={SUPPORT_MENU_IDS.chatOption} onClick={onChatClick}>
        <MessageCircle size={16} color={gray[500]} />
        <PanelOptionLabel>צ'אט תמיכה</PanelOptionLabel>
        <ExternalLink size={14} color={gray[400]} />
      </PanelOption>
    </PanelBody>
  </FloatingPanel>
);
