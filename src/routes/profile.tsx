import { createFileRoute, stripSearchParams } from '@tanstack/react-router';
import { z } from 'zod';
import { ProfilePage } from '@/pages/profile/ProfilePage';

const PROFILE_TABS = ['templates', 'signatures', 'lists'] as const;

// The schema falls back to these, and `stripSearchParams` keeps them out of the
// URL — the personal area opens on `/profile`, not
// `/profile?tab=templates&q=&dept=&sub=`.
const DEFAULTS = {
  tab: 'templates',
  q: '',
  dept: '',
  sub: '',
} as const;

const profileSearchSchema = z.object({
  tab: z.enum(PROFILE_TABS).catch(DEFAULTS.tab),
  q: z.string().catch(DEFAULTS.q),
  dept: z.string().catch(DEFAULTS.dept),
  sub: z.string().catch(DEFAULTS.sub),
});

export type ProfileSearch = z.infer<typeof profileSearchSchema>;

export const Route = createFileRoute('/profile')({
  validateSearch: profileSearchSchema,
  search: { middlewares: [stripSearchParams(DEFAULTS)] },
  component: ProfilePage,
});
