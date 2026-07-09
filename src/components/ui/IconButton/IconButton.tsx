import type { ReactNode } from 'react';
import { IconButtonBadge, IconButtonRoot } from './IconButton.styles';
import { ICON_BUTTON_IDS } from './IconButton.testids';

interface IconButtonProps {
  icon: ReactNode;
  isActive?: boolean;
  hasBadge?: boolean;
  onClick?: () => void;
  'aria-label': string;
}

export const IconButton = ({
  icon,
  isActive = false,
  hasBadge = false,
  onClick,
  'aria-label': ariaLabel,
}: IconButtonProps) => {
  return (
    <IconButtonRoot
      aria-label={ariaLabel}
      data-testid={ICON_BUTTON_IDS.root(ariaLabel)}
      onClick={onClick}
      $isActive={isActive}
    >
      {icon}
      {hasBadge && !isActive && <IconButtonBadge />}
    </IconButtonRoot>
  );
};
