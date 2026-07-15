import { getRouteApi } from '@tanstack/react-router';
import { User } from 'lucide-react';
import { lazy, Suspense, useState } from 'react';
import { LISTS_FALLBACK, useLists } from '@/api/lists';
import { PROFILE_FALLBACK, useProfile } from '@/api/profile';
import { SIGNATURES_FALLBACK, useSignatures } from '@/api/signatures';
import { TEMPLATES_FALLBACK, useTemplates } from '@/api/templates';
import { AppShell } from '@/components/layout/AppShell';
import { TopNavbar } from '@/components/layout/TopNavbar';
import { NotificationsMenu } from '@/components/layout/TopNavbar/components/NotificationsMenu';
import { RealityModeSwitch } from '@/components/layout/TopNavbar/components/RealityModeSwitch';
import { SupportMenu } from '@/components/layout/TopNavbar/components/SupportMenu';
import { ThemeToggle } from '@/components/layout/TopNavbar/components/ThemeToggle';
import { TrainingMenu } from '@/components/layout/TopNavbar/components/TrainingMenu';
import { IconButton } from '@/components/ui/IconButton';
import { ModalLoading } from '@/components/ui/ModalLoading';
import { PanelLoading } from '@/components/ui/PanelLoading';
import { useEntityModal } from '@/hooks/useEntityModal';
import type { EnvironmentRequestForm } from '@/modals/EnvironmentRequestModal';
import type { ModalMode } from '@/modals/MailingListModal';
import type { SignatureModalMode } from '@/modals/SignatureModal';
import type { TemplateModalMode } from '@/modals/TemplateModal';
import { ProfileContent } from '../components/ProfileContent';
import { ProfileSidebar } from '../components/ProfileSidebar';
import { SpellCheckBanner } from '../components/SpellCheckBanner';
import type { DistributionList } from '../components/tabs/ListsPanel';
import type { SignatureType } from '../components/tabs/SignaturesPanel';
import type { Template } from '../components/tabs/TemplatesPanel';
import { useProfilePageAnalytics } from './ProfilePage.analytics';
import {
  DEPARTMENT_FILTER_OPTIONS,
  DEPARTMENTS,
  PERMISSIONS,
  PROFILE_TAB_IDS,
  TABS,
} from './ProfilePage.constants';
import {
  BrandSpan,
  PageInner,
  PageScroll,
  SidebarColumn,
  SidebarDivider,
} from './ProfilePage.styles';

const noop = () => {};
const routeApi = getRouteApi('/');

// Route/tab-gated subtrees load on demand instead of in the main bundle —
// each is behind a Suspense boundary so switching tabs is the trigger that
// fetches its chunk.
const TemplatesPanel = lazy(() =>
  import('../components/tabs/TemplatesPanel').then((m) => ({ default: m.TemplatesPanel })),
);
const SignaturesPanel = lazy(() =>
  import('../components/tabs/SignaturesPanel').then((m) => ({ default: m.SignaturesPanel })),
);
const ListsPanel = lazy(() =>
  import('../components/tabs/ListsPanel').then((m) => ({ default: m.ListsPanel })),
);

// Each modal loads on demand instead of in the main bundle — opening one is
// the trigger that fetches its chunk. Rendered directly here (the page that
// owns each modal's open/close state) rather than through a shared aggregator,
// so each stays next to the state and handlers it belongs to.
const SpellCheckModal = lazy(() =>
  import('@/modals/SpellCheckModal').then((m) => ({ default: m.SpellCheckModal })),
);
const MailingListModal = lazy(() =>
  import('@/modals/MailingListModal').then((m) => ({ default: m.MailingListModal })),
);
const SignatureModal = lazy(() =>
  import('@/modals/SignatureModal').then((m) => ({ default: m.SignatureModal })),
);
const EnvironmentRequestModal = lazy(() =>
  import('@/modals/EnvironmentRequestModal').then((m) => ({ default: m.EnvironmentRequestModal })),
);
const TemplateModal = lazy(() =>
  import('@/modals/TemplateModal').then((m) => ({ default: m.TemplateModal })),
);

export const ProfilePage = () => {
  const { tab: activeTab } = routeApi.useSearch();
  const navigate = routeApi.useNavigate();
  const [showSpellCheck, setShowSpellCheck] = useState(false);
  const [showEnvironmentRequest, setShowEnvironmentRequest] = useState(false);

  const listModal = useEntityModal<ModalMode, DistributionList>();
  const signatureModal = useEntityModal<SignatureModalMode, SignatureType>();
  const templateModal = useEntityModal<TemplateModalMode, Template>();

  // No backend yet — stubLink answers after a simulated delay (see
  // src/api/stubLink.ts) instead of on the same tick, so `loading` is
  // genuinely true for a moment and the `?? *_FALLBACK` default genuinely
  // applies until then.
  const { data: profileData } = useProfile();
  const profile = profileData ?? PROFILE_FALLBACK;

  const { data: templatesData, loading: templatesLoading } = useTemplates();
  const templates = templatesData?.templates ?? TEMPLATES_FALLBACK.templates;
  const deletedTemplates = templatesData?.deletedTemplates ?? TEMPLATES_FALLBACK.deletedTemplates;

  const { data: signaturesData, loading: signaturesLoading } = useSignatures();
  const signatures = signaturesData ?? SIGNATURES_FALLBACK.signatures;

  const { data: listsData, loading: listsLoading } = useLists();
  const lists = listsData?.lists ?? LISTS_FALLBACK.lists;
  const deletedLists = listsData?.deletedLists ?? LISTS_FALLBACK.deletedLists;

  // Only the active tab's own query should gate its panel — a background tab's
  // still-loading query (nothing fetches until its panel first mounts, so this
  // rarely overlaps) shouldn't blank out what's currently visible.
  const activeTabLoading =
    (activeTab === PROFILE_TAB_IDS.TEMPLATES && templatesLoading) ||
    (activeTab === PROFILE_TAB_IDS.SIGNATURES && signaturesLoading) ||
    (activeTab === PROFILE_TAB_IDS.LISTS && listsLoading);

  const {
    trackTabChanged,
    trackMailingListOpened,
    trackSignatureModalOpened,
    trackEnvironmentModalOpened,
    trackSpellCheckOpened,
  } = useProfilePageAnalytics();

  const handleTabChange = (tab: string) => {
    // Reset the shared q/dept/sub params so a filter from one tab's panel
    // doesn't leak into the next (e.g. Templates' "deleted" subTab bleeding
    // into Signatures, which has no such subTab).
    navigate({ search: { tab, q: '', dept: '', sub: '' } });
    trackTabChanged(tab);
  };
  const handleMailingListOpen = () => {
    listModal.open('new');
    trackMailingListOpened();
  };
  const handleListEdit = (id: string) => {
    const list = lists.find((l) => l.id === id);
    if (!list) return;
    listModal.open('edit', list);
  };
  const handleListDuplicate = (id: string) => {
    const list = lists.find((l) => l.id === id);
    if (!list) return;
    listModal.open('duplicate', list);
  };
  const handleSignatureNew = (type: SignatureType) => {
    signatureModal.open('new', type);
    trackSignatureModalOpened();
  };
  const handleSignatureEdit = (_id: string, type: SignatureType) =>
    signatureModal.open('edit', type);
  const handleSignatureDuplicate = (_id: string, type: SignatureType) =>
    signatureModal.open('duplicate', type);
  const handleTemplateNew = () => templateModal.open('new');
  const handleTemplateEdit = (id: string) => {
    const template = [...templates, ...deletedTemplates].find((t) => t.id === id);
    if (!template) return;
    templateModal.open('edit', template);
  };
  const handleTemplateDuplicate = (id: string) => {
    const template = [...templates, ...deletedTemplates].find((t) => t.id === id);
    if (!template) return;
    templateModal.open('duplicate', template);
  };
  const handleSpellCheckOpen = () => {
    setShowSpellCheck(true);
    trackSpellCheckOpened();
  };
  const handleSpellCheckClose = () => setShowSpellCheck(false);
  const handleEnvironmentRequestOpen = () => {
    setShowEnvironmentRequest(true);
    trackEnvironmentModalOpened();
  };
  const handleEnvironmentRequestClose = () => setShowEnvironmentRequest(false);
  const handleEnvironmentRequestSubmit = (_form: EnvironmentRequestForm) => {};

  const renderTabPanel = () => {
    switch (activeTab) {
      case PROFILE_TAB_IDS.TEMPLATES:
        return (
          <TemplatesPanel
            templates={templates}
            deletedTemplates={deletedTemplates}
            departmentOptions={DEPARTMENT_FILTER_OPTIONS}
            onNew={handleTemplateNew}
            onEdit={handleTemplateEdit}
            onDuplicate={handleTemplateDuplicate}
            onDelete={noop}
            onRestore={noop}
          />
        );
      case PROFILE_TAB_IDS.SIGNATURES:
        return (
          <SignaturesPanel
            signatures={signatures}
            departmentOptions={DEPARTMENT_FILTER_OPTIONS}
            onNew={handleSignatureNew}
            onEdit={handleSignatureEdit}
            onDuplicate={handleSignatureDuplicate}
            onDelete={noop}
          />
        );
      case PROFILE_TAB_IDS.LISTS:
        return (
          <ListsPanel
            lists={lists}
            deletedLists={deletedLists}
            departmentOptions={DEPARTMENT_FILTER_OPTIONS}
            onNew={handleMailingListOpen}
            onEdit={handleListEdit}
            onDuplicate={handleListDuplicate}
            onDelete={noop}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AppShell>
      <TopNavbar
        start={
          <>
            <BrandSpan>Chief</BrandSpan>
            <RealityModeSwitch />
          </>
        }
        end={
          <>
            <NotificationsMenu />
            <SupportMenu />
            <TrainingMenu />
            <ThemeToggle />
            <IconButton aria-label="פרופיל" icon={<User size={20} />} isActive />
          </>
        }
      />

      <PageScroll>
        <PageInner>
          <SidebarColumn>
            <SidebarDivider />
            <ProfileSidebar
              profile={profile}
              permissions={PERMISSIONS}
              departments={DEPARTMENTS}
              onRequestEnvironment={handleEnvironmentRequestOpen}
            />
          </SidebarColumn>

          <ProfileContent
            tabs={TABS}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            footer={<SpellCheckBanner onInstall={handleSpellCheckOpen} />}
          >
            <Suspense fallback={<PanelLoading />}>
              {activeTabLoading ? <PanelLoading /> : renderTabPanel()}
            </Suspense>
          </ProfileContent>
        </PageInner>
      </PageScroll>

      {showSpellCheck && (
        <Suspense fallback={<ModalLoading />}>
          <SpellCheckModal onClose={handleSpellCheckClose} />
        </Suspense>
      )}

      {listModal.mode && (
        <Suspense fallback={<ModalLoading />}>
          <MailingListModal
            mode={listModal.mode}
            initialName={listModal.editing?.name}
            initialMembers={listModal.editing?.members}
            onClose={listModal.close}
            onSave={noop}
          />
        </Suspense>
      )}

      {signatureModal.mode && (
        <Suspense fallback={<ModalLoading />}>
          <SignatureModal
            mode={signatureModal.mode}
            initialType={signatureModal.editing}
            onClose={signatureModal.close}
            onSave={noop}
          />
        </Suspense>
      )}

      {templateModal.mode && (
        <Suspense fallback={<ModalLoading />}>
          <TemplateModal
            mode={templateModal.mode}
            initialName={templateModal.editing?.name}
            departmentOptions={DEPARTMENT_FILTER_OPTIONS}
            currentUserId={profile.id}
            onClose={templateModal.close}
            onSave={noop}
          />
        </Suspense>
      )}

      {showEnvironmentRequest && (
        <Suspense fallback={<ModalLoading />}>
          <EnvironmentRequestModal
            onClose={handleEnvironmentRequestClose}
            onSubmit={handleEnvironmentRequestSubmit}
          />
        </Suspense>
      )}
    </AppShell>
  );
};
