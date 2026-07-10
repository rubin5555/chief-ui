import type { ReactNode } from 'react';
import { Shell } from './AppShell.styles';
import { APP_SHELL_IDS } from './AppShell.testids';

interface AppShellProps {
  children: ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => {
  return <Shell data-testid={APP_SHELL_IDS.root}>{children}</Shell>;
};
