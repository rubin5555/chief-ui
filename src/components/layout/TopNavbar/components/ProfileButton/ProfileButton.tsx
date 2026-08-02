import { useMatchRoute } from '@tanstack/react-router';
import { User } from 'lucide-react';
import { useProfileButtonAnalytics } from './ProfileButton.analytics';
import { ProfileLink } from './ProfileButton.styles';
import { PROFILE_BUTTON_IDS } from './ProfileButton.testids';

export const ProfileButton = () => {
  const matchRoute = useMatchRoute();
  const isActive = Boolean(matchRoute({ to: '/profile' }));

  const { trackProfileOpened } = useProfileButtonAnalytics();

  return (
    <ProfileLink
      to="/profile"
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
