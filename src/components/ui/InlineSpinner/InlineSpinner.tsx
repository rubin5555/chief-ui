import { Loader2 } from 'lucide-react';
import { SpinIcon, SpinnerRoot } from './InlineSpinner.styles';

// A small centered spinner for gating a content area (a column, a grid) while
// its data loads — unlike ModalLoading, it has no backdrop and doesn't cover
// the page; it just fills the space its content would otherwise occupy.
export const InlineSpinner = () => (
  <SpinnerRoot>
    <SpinIcon>
      <Loader2 size={24} />
    </SpinIcon>
  </SpinnerRoot>
);
