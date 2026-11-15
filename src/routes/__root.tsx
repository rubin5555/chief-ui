import type { ErrorRouteProps } from '@tanstack/react-router';
import { createRootRoute } from '@tanstack/react-router';
import { lazy, Suspense } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { chunkGuard, isStaleChunkError, recoverFromStaleChunk } from '../utils/chunkRecovery';
import { StatusDetails, StatusMessage, StatusRoot, StatusTitle } from './-root.styles';

const showDevtools = process.env.NODE_ENV !== 'production' && !process.env.E2E;

const RouterDevtools = showDevtools
  ? lazy(
      chunkGuard(() =>
        import('@tanstack/react-router-devtools').then((m) => ({
          default: m.TanStackRouterDevtools,
        })),
      ),
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

// The router splits its own route chunks, and those requests never pass through
// chunkGuard — a route whose chunk a deploy has taken away lands here instead.
// Same answer: pick up the current build once, and only fall through to the
// error screen if that has already been tried.
const RootErrorComponent = ({ error }: ErrorRouteProps) => {
  if (isStaleChunkError(error) && recoverFromStaleChunk()) return null;

  return (
    <StatusRoot>
      <StatusTitle>משהו השתבש</StatusTitle>
      <StatusMessage>אירעה שגיאה בטעינת העמוד. נסו לרענן את הדף או לחזור מאוחר יותר.</StatusMessage>
      <StatusDetails>{error instanceof Error ? error.message : String(error)}</StatusDetails>
    </StatusRoot>
  );
};

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
