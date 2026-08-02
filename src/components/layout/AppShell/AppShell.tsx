import type { ReactNode } from 'react';
import { Shell } from './AppShell.styles';
import { APP_SHELL_IDS } from './AppShell.testids';

interface AppShellProps {
  children: ReactNode;
  onDocumentCanvas?: boolean;
}

export const AppShell = ({ children, onDocumentCanvas = false }: AppShellProps) => {
  return (
    <Shell $onDocumentCanvas={onDocumentCanvas} data-testid={APP_SHELL_IDS.root}>
      {children}
    </Shell>
  );
};
