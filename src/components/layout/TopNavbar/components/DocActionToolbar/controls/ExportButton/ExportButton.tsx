import { Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { IconAction, SpinningLoader } from '../../DocActionToolbar.styles';

interface ExportButtonProps {
  title: string;
  testId: string;
  isLoading: boolean;
  icon: ReactNode;
  onClick: () => void;
}

export const ExportButton = ({ title, testId, isLoading, icon, onClick }: ExportButtonProps) => (
  <IconAction type="button" title={title} aria-label={title} data-testid={testId} onClick={onClick}>
    {isLoading ? (
      <SpinningLoader>
        <Loader2 size={16} />
      </SpinningLoader>
    ) : (
      icon
    )}
  </IconAction>
);
