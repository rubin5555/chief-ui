import type { ReactNode, Ref } from 'react';
import { keepSelection } from '../../../../utils/keepSelection';
import { ToolbarButtonRoot } from './ToolbarButton.styles';

export interface ToolbarButtonProps {
  title: string;
  children: ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  ref?: Ref<HTMLButtonElement>;
  'data-testid'?: string;
}

export const ToolbarButton = ({
  title,
  children,
  active,
  disabled,
  onClick,
  ref,
  'data-testid': testId,
}: ToolbarButtonProps) => (
  <ToolbarButtonRoot
    ref={ref}
    type="button"
    title={title}
    aria-label={title}
    aria-pressed={active}
    disabled={disabled}
    $active={active}
    onMouseDown={keepSelection}
    onClick={onClick}
    data-testid={testId}
  >
    {children}
  </ToolbarButtonRoot>
);
