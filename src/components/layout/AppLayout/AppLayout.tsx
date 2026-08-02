import { Outlet, useRouterState } from '@tanstack/react-router';
import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { TopNavbar } from '@/components/layout/TopNavbar';
import { NotificationsMenu } from '@/components/layout/TopNavbar/components/NotificationsMenu';
import { ProfileButton } from '@/components/layout/TopNavbar/components/ProfileButton';
import { RealityModeSwitch } from '@/components/layout/TopNavbar/components/RealityModeSwitch';
import { SupportMenu } from '@/components/layout/TopNavbar/components/SupportMenu';
import { ThemeToggle } from '@/components/layout/TopNavbar/components/ThemeToggle';
import { TrainingMenu } from '@/components/layout/TopNavbar/components/TrainingMenu';
import { NavToolbarSlotProvider } from '@/context/NavToolbarSlotContext';
import { DOCUMENT_ROUTE } from './AppLayout.constants';
import { BrandLink, NavToolbarHost } from './AppLayout.styles';
import { useOverflowTitles } from './useOverflowTitles';

// main paints one gradient across the whole document viewport, navbar included
// (`Edit.tsx:3670`) — its navbar is transparent and sits on that background. Here
// the navbar is a sibling of the routed page, so the page's own canvas can never
// reach it; the shell has to carry the document gradient instead, or the navbar
// strip keeps the app's cooler default and leaves a seam above the page. The
// pathname is selected off the router store for the same reason ProfileButton
// does it — see the note there.
export const AppLayout = () => {
  const [navToolbarNode, setNavToolbarNode] = useState<HTMLDivElement | null>(null);
  const onDocumentCanvas = useRouterState({
    select: ({ location }) =>
      location.pathname === DOCUMENT_ROUTE || location.pathname.startsWith(`${DOCUMENT_ROUTE}/`),
  });

  useOverflowTitles();

  return (
    <NavToolbarSlotProvider value={navToolbarNode}>
      <AppShell onDocumentCanvas={onDocumentCanvas}>
        <TopNavbar
          start={
            <>
              <BrandLink to="/">Chief</BrandLink>
              <RealityModeSwitch />
              <NavToolbarHost ref={setNavToolbarNode} />
            </>
          }
          end={
            <>
              <NotificationsMenu />
              <SupportMenu />
              <TrainingMenu />
              <ThemeToggle />
              <ProfileButton />
            </>
          }
        />
        <Outlet />
      </AppShell>
    </NavToolbarSlotProvider>
  );
};
