import type { ReactNode } from 'react';
import { TabCardButton, TabCardIcon, TabCardLabel } from './TabCard.styles';
import { TAB_CARD_IDS } from './TabCard.testids';

interface TabCardProps {
  icon: ReactNode;
  label: string;
  count?: number;
  isActive: boolean;
  onClick: () => void;
}

export const TabCard = ({ icon, label, isActive, onClick }: TabCardProps) => {
  return (
    <TabCardButton data-testid={TAB_CARD_IDS.card(label)} onClick={onClick} $isActive={isActive}>
      <TabCardIcon>{icon}</TabCardIcon>
      <TabCardLabel>{label}</TabCardLabel>
    </TabCardButton>
  );
};
