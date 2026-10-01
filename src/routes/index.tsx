import { createFileRoute, redirect } from '@tanstack/react-router';
import type { CatalogSearch } from './catalog';

// The catalog is where document work starts, the way main treats it, so `/`
// forwards there. It used to forward to /profile — the personal area is still
// reachable from the navbar, it just isn't the front door. The raw search is
// handed straight over; /catalog's own schema is what validates it, so a stale
// `?tab=` either survives the move or falls back.
export const Route = createFileRoute('/')({
  beforeLoad: ({ location }) => {
    throw redirect({
      to: '/catalog',
      search: location.search as CatalogSearch,
      replace: true,
    });
  },
});
