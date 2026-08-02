import { createFileRoute, redirect } from '@tanstack/react-router';
import type { ProfileSearch } from './profile';

// The personal area used to be the app's index route. It lives at /profile now,
// and `/` forwards to it so existing links and bookmarks still land somewhere.
// The raw search is handed straight over — /profile's own schema is what
// validates it, so a stale `?tab=` either survives the move or falls back.
export const Route = createFileRoute('/')({
  beforeLoad: ({ location }) => {
    throw redirect({
      to: '/profile',
      search: location.search as ProfileSearch,
      replace: true,
    });
  },
});
