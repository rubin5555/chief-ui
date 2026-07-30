import { Outlet } from '@tanstack/react-router';
import { User } from 'lucide-react';
import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { TopNavbar } from '@/components/layout/TopNavbar';
import { NotificationsMenu } from '@/components/layout/TopNavbar/components/NotificationsMenu';
import { RealityModeSwitch } from '@/components/layout/TopNavbar/components/RealityModeSwitch';
import { SupportMenu } from '@/components/layout/TopNavbar/components/SupportMenu';
import { ThemeToggle } from '@/components/layout/TopNavbar/components/ThemeToggle';
import { TrainingMenu } from '@/components/layout/TopNavbar/components/TrainingMenu';
import { IconButton } from '@/components/ui/IconButton';
import { NavToolbarSlotProvider } from '@/context/NavToolbarSlotContext';
import { useOverflowTitles } from '@/hooks/useOverflowTitles';
import { BrandLink, NavToolbarHost } from './AppLayout.styles';

// Shared chrome for every routed page — rendered once at the root layout
// (see src/routes/__root.tsx), right next to <Outlet/>, instead of each page
// component re-mounting its own TopNavbar/AppShell.
//
// The only state here is the toolbar slot's host element. AppLayout deliberately
// knows nothing about what a page puts in it — pages portal their own toolbar in
// and keep their own handlers and modals, per NavToolbarSlotContext's doc comment.
export const AppLayout = () => {
  const [navToolbarNode, setNavToolbarNode] = useState<HTMLDivElement | null>(null);

  // Every page, including whatever a modal portals outside this tree — the
  // listener is on the document, not on the subtree below.
  useOverflowTitles();

  return (
    <NavToolbarSlotProvider value={navToolbarNode}>
      <AppShell>
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
              <IconButton aria-label="פרופיל" icon={<User size={20} />} isActive />
            </>
          }
        />
        <Outlet />
      </AppShell>
    </NavToolbarSlotProvider>
  );
};
