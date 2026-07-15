import type { ErrorRouteProps } from '@tanstack/react-router';
import { createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatusDetails, StatusMessage, StatusRoot, StatusTitle } from './-root.styles';

const RootRoute = () => (
  <>
    <AppLayout />
    <TanStackRouterDevtools />
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
