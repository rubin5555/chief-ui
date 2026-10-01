import type { ElementType } from 'react';
import { IconTabButton, IconTabIconWrap, IconTabLabel } from './IconTab.styles';
import { ICON_TAB_IDS } from './IconTab.testids';

interface IconTabProps {
  icon: ElementType;
  label: string;
  isActive: boolean;
  compact?: boolean;
  idleIconColor?: string;
  onClick: () => void;
}

export const IconTab = ({
  icon: Icon,
  label,
  isActive,
  compact = false,
  idleIconColor,
  onClick,
}: IconTabProps) => (
  <IconTabButton
    type="button"
    $isActive={isActive}
    $compact={compact}
    data-active={isActive}
    data-testid={ICON_TAB_IDS.root(label)}
    onClick={onClick}
  >
    <IconTabIconWrap $isActive={isActive} $idleIconColor={idleIconColor}>
      <Icon />
    </IconTabIconWrap>
    <IconTabLabel $isActive={isActive}>{label}</IconTabLabel>
  </IconTabButton>
);
