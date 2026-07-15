import { getRouteApi } from '@tanstack/react-router';
import { lazy, Suspense } from 'react';
import { PROFILE_FALLBACK, useProfile } from '@/api/profile';
import { PanelLoading } from '@/components/ui/PanelLoading';
import { ProfileContent } from '../components/ProfileContent';
import { ProfileSidebar } from '../components/ProfileSidebar';
import { SpellCheckBanner } from '../components/SpellCheckBanner';
import { useProfilePageAnalytics } from './ProfilePage.analytics';
import {
  DEPARTMENT_FILTER_OPTIONS,
  DEPARTMENTS,
  PERMISSIONS,
  PROFILE_TAB_IDS,
  TABS,
} from './ProfilePage.constants';
import { PageInner, PageScroll, SidebarColumn, SidebarDivider } from './ProfilePage.styles';

const noop = () => {};
const routeApi = getRouteApi('/');

// Route/tab-gated subtrees load on demand instead of in the main bundle —
// each is behind a Suspense boundary so switching tabs is the trigger that
// fetches its chunk. Each panel also owns its own data query (useTemplates/
// useSignatures/useLists) and its own new/edit/duplicate modal — fetching
// only starts once the tab is actually active, matching the JS chunk fetch.
// See .claude/skills/modal-placement.md and .claude/skills/react-engineering.md.
const TemplatesPanel = lazy(() =>
  import('../components/tabs/TemplatesPanel').then((m) => ({ default: m.TemplatesPanel })),
);
const SignaturesPanel = lazy(() =>
  import('../components/tabs/SignaturesPanel').then((m) => ({ default: m.SignaturesPanel })),
);
const ListsPanel = lazy(() =>
  import('../components/tabs/ListsPanel').then((m) => ({ default: m.ListsPanel })),
);

export const ProfilePage = () => {
  const { tab: activeTab } = routeApi.useSearch();
  const navigate = routeApi.useNavigate();

  // Shared by both ProfileSidebar and TemplatesPanel (collab user identity),
  // so it stays here rather than being owned by either one alone.
  const { data: profileData } = useProfile();
  const profile = profileData ?? PROFILE_FALLBACK;

  const { trackTabChanged } = useProfilePageAnalytics();

  const handleTabChange = (tab: string) => {
    // Reset the shared q/dept/sub params so a filter from one tab's panel
    // doesn't leak into the next (e.g. Templates' "deleted" subTab bleeding
    // into Signatures, which has no such subTab).
    navigate({ search: { tab, q: '', dept: '', sub: '' } });
    trackTabChanged(tab);
  };

  const renderTabPanel = () => {
    switch (activeTab) {
      case PROFILE_TAB_IDS.TEMPLATES:
        return (
          <TemplatesPanel
            departmentOptions={DEPARTMENT_FILTER_OPTIONS}
            currentUserId={profile.id}
            onDelete={noop}
            onRestore={noop}
          />
        );
      case PROFILE_TAB_IDS.SIGNATURES:
        return <SignaturesPanel departmentOptions={DEPARTMENT_FILTER_OPTIONS} onDelete={noop} />;
      case PROFILE_TAB_IDS.LISTS:
        return <ListsPanel departmentOptions={DEPARTMENT_FILTER_OPTIONS} onDelete={noop} />;
      default:
        return null;
    }
  };

  return (
    <PageScroll>
      <PageInner>
        <SidebarColumn>
          <SidebarDivider />
          <ProfileSidebar profile={profile} permissions={PERMISSIONS} departments={DEPARTMENTS} />
        </SidebarColumn>

        <ProfileContent
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          footer={<SpellCheckBanner />}
        >
          <Suspense fallback={<PanelLoading />}>{renderTabPanel()}</Suspense>
        </ProfileContent>
      </PageInner>
    </PageScroll>
  );
};
