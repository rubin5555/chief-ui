import { Outlet, useRouterState } from '@tanstack/react-router';
import { useState } from 'react';
import type { Canvas } from '@/components/layout/AppShell';
import { AppShell } from '@/components/layout/AppShell';
import { TopNavbar } from '@/components/layout/TopNavbar';
import { NotificationsMenu } from '@/components/layout/TopNavbar/components/NotificationsMenu';
import { ProfileButton } from '@/components/layout/TopNavbar/components/ProfileButton';
import { RealityModeSwitch } from '@/components/layout/TopNavbar/components/RealityModeSwitch';
import { SupportMenu } from '@/components/layout/TopNavbar/components/SupportMenu';
import { ThemeToggle } from '@/components/layout/TopNavbar/components/ThemeToggle';
import { TrainingMenu } from '@/components/layout/TopNavbar/components/TrainingMenu';
import { NavToolbarSlotProvider } from '@/context/NavToolbarSlotContext';
import { CATALOG_ROUTE, DOCUMENT_ROUTE } from './AppLayout.constants';
import { BrandLink, NavToolbarHost } from './AppLayout.styles';
import { useOverflowTitles } from './useOverflowTitles';

const isUnder = (pathname: string, route: string) =>
  pathname === route || pathname.startsWith(`${route}/`);

const canvasFor = (pathname: string): Canvas => {
  if (isUnder(pathname, DOCUMENT_ROUTE)) return 'document';
  if (isUnder(pathname, CATALOG_ROUTE)) return 'catalog';
  return 'app';
};

// main paints one gradient across the whole viewport, navbar included, on both
// the document (`Edit.tsx:3670`) and the catalog (`Catalog.tsx:2364`) — its
// navbar is transparent and sits on that background. Here the navbar is a
// sibling of the routed page, so the page's own canvas can never reach it; the
// shell has to carry the gradient instead, or the navbar strip keeps the app's
// cooler default and leaves a seam above the page. The pathname is selected off
// the router store for the same reason ProfileButton does it — see the note
// there.
export const AppLayout = () => {
  const [navToolbarNode, setNavToolbarNode] = useState<HTMLDivElement | null>(null);
  const canvas = useRouterState({ select: ({ location }) => canvasFor(location.pathname) });

  useOverflowTitles();

  return (
    <NavToolbarSlotProvider value={navToolbarNode}>
      <AppShell canvas={canvas}>
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
