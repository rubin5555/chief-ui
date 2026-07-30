import type { MouseEvent, ReactNode, Ref } from 'react';
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

/**
 * A press that never takes focus, so the selection it is about to act on is still
 * there when it acts.
 *
 * This is the rule every toolbar over a contenteditable obeys, and skipping it
 * doesn't merely look untidy — mousedown moves focus out of the editor, which
 * collapses the selection, so `Bold` would arrive with nothing selected to
 * embolden. Bound to mousedown rather than click because focus has already moved
 * by the time click fires.
 */
const keepSelection = (event: MouseEvent<HTMLButtonElement>) => event.preventDefault();

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
    onMouseDown={keepSelection}
    onClick={onClick}
    data-testid={testId}
  >
    {children}
  </ToolbarButtonRoot>
);
