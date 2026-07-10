import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { ProfilePage } from '@/pages/profile/ProfilePage';

// Tab ids kept as literals (not imported from ProfilePage.constants) so this route config,
// which stays in the eager bundle, doesn't pull in that file's icons/mock-data.
// Must match the PROFILE_TAB_IDS values.
const PROFILE_TABS = ['templates', 'signatures', 'lists'] as const;
const DEFAULT_TAB = 'templates' satisfies (typeof PROFILE_TABS)[number];

const profileSearchSchema = z.object({
  tab: z.enum(PROFILE_TABS).catch(DEFAULT_TAB),
  q: z.string().catch(''),
  dept: z.string().catch(''),
  sub: z.string().catch(''),
});

export type ProfileSearch = z.infer<typeof profileSearchSchema>;

export const Route = createFileRoute('/')({
  validateSearch: profileSearchSchema,
  component: ProfilePage,
});
