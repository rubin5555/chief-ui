import { getRouteApi } from '@tanstack/react-router';
import { lazy, Suspense } from 'react';
import { PROFILE_FALLBACK, useProfile } from '@/api/profile';
import { PanelLoading } from '@/components/ui/PanelLoading';
import { chunkGuard } from '../../../utils/chunkRecovery';
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
const routeApi = getRouteApi('/profile');

const TemplatesPanel = lazy(
  chunkGuard(() =>
    import('../components/tabs/TemplatesPanel').then((m) => ({ default: m.TemplatesPanel })),
  ),
);
const SignaturesPanel = lazy(
  chunkGuard(() =>
    import('../components/tabs/SignaturesPanel').then((m) => ({ default: m.SignaturesPanel })),
  ),
);
const ListsPanel = lazy(
  chunkGuard(() =>
    import('../components/tabs/ListsPanel').then((m) => ({ default: m.ListsPanel })),
  ),
);

export const ProfilePage = () => {
  const { tab: activeTab } = routeApi.useSearch();
  const navigate = routeApi.useNavigate();

  const { data: profileData } = useProfile();
  const profile = profileData ?? PROFILE_FALLBACK;

  const { trackTabChanged } = useProfilePageAnalytics();

  const handleTabChange = (tab: string) => {
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
