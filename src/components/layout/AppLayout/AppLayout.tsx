import { Outlet } from '@tanstack/react-router';
import { User } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { TopNavbar } from '@/components/layout/TopNavbar';
import { NotificationsMenu } from '@/components/layout/TopNavbar/components/NotificationsMenu';
import { RealityModeSwitch } from '@/components/layout/TopNavbar/components/RealityModeSwitch';
import { SupportMenu } from '@/components/layout/TopNavbar/components/SupportMenu';
import { ThemeToggle } from '@/components/layout/TopNavbar/components/ThemeToggle';
import { TrainingMenu } from '@/components/layout/TopNavbar/components/TrainingMenu';
import { IconButton } from '@/components/ui/IconButton';
import { BrandSpan } from './AppLayout.styles';

// Shared chrome for every routed page — rendered once at the root layout
// (see src/routes/__root.tsx), right next to <Outlet/>, instead of each page
// component re-mounting its own TopNavbar/AppShell.
export const AppLayout = () => (
  <AppShell>
    <TopNavbar
      start={
        <>
          <BrandSpan>Chief</BrandSpan>
          <RealityModeSwitch />
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
);
