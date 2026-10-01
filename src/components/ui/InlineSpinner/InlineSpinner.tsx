import { Loader2 } from 'lucide-react';
import { SpinIcon, SpinnerRoot } from './InlineSpinner.styles';

export const InlineSpinner = () => (
  <SpinnerRoot>
    <SpinIcon>
      <Loader2 size={24} />
    </SpinIcon>
  </SpinnerRoot>
);
