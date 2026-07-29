import type { ElementType } from 'react';
import { IconTabButton, IconTabIconWrap, IconTabLabel } from './IconTab.styles';
import { ICON_TAB_IDS } from './IconTab.testids';

interface IconTabProps {
  icon: ElementType;
  label: string;
  isActive: boolean;
  /**
   * Sized to its own label instead of taking an equal share of the row. For a
   * tab that isn't one of the set — it sits at the end and shouldn't make the
   * tabs that are a set narrower to make room for it.
   */
  compact?: boolean;
  /**
   * What tints the icon while the tab is idle. Defaults to the same grey as the
   * rest; pass a token when the source has a brand colour of its own. Active
   * always wins — a chosen tab is navy whatever it is.
   */
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
