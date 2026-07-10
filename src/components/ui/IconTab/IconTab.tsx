import type { ElementType } from 'react';
import { IconTabButton, IconTabIconWrap, IconTabLabel } from './IconTab.styles';
import { ICON_TAB_IDS } from './IconTab.testids';

interface IconTabProps {
  icon: ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export const IconTab = ({ icon: Icon, label, isActive, onClick }: IconTabProps) => (
  <IconTabButton
    type="button"
    $isActive={isActive}
    data-active={isActive}
    data-testid={ICON_TAB_IDS.root(label)}
    onClick={onClick}
  >
    <IconTabIconWrap $isActive={isActive}>
      <Icon />
    </IconTabIconWrap>
    <IconTabLabel $isActive={isActive}>{label}</IconTabLabel>
  </IconTabButton>
);
