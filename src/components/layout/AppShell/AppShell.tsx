import type { ReactNode } from 'react';
import type { Canvas } from './AppShell.styles';
import { Shell } from './AppShell.styles';
import { APP_SHELL_IDS } from './AppShell.testids';

export type { Canvas };

interface AppShellProps {
  children: ReactNode;
  canvas?: Canvas;
}

export const AppShell = ({ children, canvas = 'app' }: AppShellProps) => {
  return (
    <Shell $canvas={canvas} data-testid={APP_SHELL_IDS.root}>
      {children}
    </Shell>
  );
};
