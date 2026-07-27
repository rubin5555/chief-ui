import type { ErrorRouteProps } from '@tanstack/react-router';
import { createRootRoute } from '@tanstack/react-router';
import { lazy, Suspense } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatusDetails, StatusMessage, StatusRoot, StatusTitle } from './-root.styles';

// Two reasons this isn't a plain import.
//
// Production never needs it, and a static import would ship the devtools bundle
// to everyone; behind `lazy` it becomes a chunk nothing ever requests.
//
// And under test it actively gets in the way: the toggle is pinned to a viewport
// corner, where it silently intercepts clicks on whatever a popover happens to
// open there. A test failing on a widget that isn't part of the app is a test
// that teaches nothing.
const showDevtools = process.env.NODE_ENV !== 'production' && !process.env.E2E;

const RouterDevtools = showDevtools
  ? lazy(() =>
      import('@tanstack/react-router-devtools').then((m) => ({
        default: m.TanStackRouterDevtools,
      })),
    )
  : () => null;

const RootRoute = () => (
  <>
    <AppLayout />
    <Suspense fallback={null}>
      <RouterDevtools />
    </Suspense>
  </>
);

const RootErrorComponent = ({ error }: ErrorRouteProps) => (
  <StatusRoot>
    <StatusTitle>משהו השתבש</StatusTitle>
    <StatusMessage>אירעה שגיאה בטעינת העמוד. נסו לרענן את הדף או לחזור מאוחר יותר.</StatusMessage>
    <StatusDetails>{error instanceof Error ? error.message : String(error)}</StatusDetails>
  </StatusRoot>
);

const RootNotFoundComponent = () => (
  <StatusRoot>
    <StatusTitle>הדף לא נמצא</StatusTitle>
    <StatusMessage>הכתובת שביקשתם אינה קיימת או שהוסרה.</StatusMessage>
  </StatusRoot>
);

export const Route = createRootRoute({
  component: RootRoute,
  errorComponent: RootErrorComponent,
  notFoundComponent: RootNotFoundComponent,
});
