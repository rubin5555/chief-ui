import { useRouterState } from '@tanstack/react-router';
import { User } from 'lucide-react';
import { useProfileButtonAnalytics } from './ProfileButton.analytics';
import { PROFILE_ROUTE } from './ProfileButton.constants';
import { ProfileLink } from './ProfileButton.styles';
import { PROFILE_BUTTON_IDS } from './ProfileButton.testids';

// Selected state is selected off the router store rather than derived from
// `useMatchRoute`. That hook hands back a matcher whose identity is stable
// across navigations, so the React Compiler sees the derived boolean as having
// no changing input and freezes it at whatever the first render produced — the
// fill then only caught up on a full reload. Subscribing to the pathname gives
// the compiler a value that genuinely changes, so the styled component
// restyles when the route does.
export const ProfileButton = () => {
  const isActive = useRouterState({
    select: ({ location }) =>
      location.pathname === PROFILE_ROUTE || location.pathname.startsWith(`${PROFILE_ROUTE}/`),
  });

  const { trackProfileOpened } = useProfileButtonAnalytics();

  return (
    <ProfileLink
      to={PROFILE_ROUTE}
      aria-label="פרופיל"
      aria-current={isActive ? 'page' : undefined}
      data-testid={PROFILE_BUTTON_IDS.trigger}
      $isActive={isActive}
      onClick={trackProfileOpened}
    >
      <User size={20} />
    </ProfileLink>
  );
};
