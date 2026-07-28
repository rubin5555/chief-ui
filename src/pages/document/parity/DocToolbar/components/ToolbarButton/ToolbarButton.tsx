import type { ReactNode, Ref } from 'react';
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

// main's `TB` (Edit.tsx:49-57), the 26×26 square every ribbon control is built on.
// `title` doubles as the accessible name because the button's only child is an
// icon — main leaves those buttons unnamed to a screen reader.
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
    onClick={onClick}
    data-testid={testId}
  >
    {children}
  </ToolbarButtonRoot>
);
