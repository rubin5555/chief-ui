import { getRouteApi } from '@tanstack/react-router';
import { User } from 'lucide-react';
import { lazy, Suspense, useState } from 'react';
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
  DELETED_LISTS,
  DELETED_TEMPLATES,
  DEPARTMENT_FILTER_OPTIONS,
  DEPARTMENTS,
  LISTS,
  PERMISSIONS,
  PROFILE,
  PROFILE_TAB_IDS,
  SIGNATURES,
  TABS,
  TEMPLATES,
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
// each is behind a Suspense boundary so switching tabs (or opening a modal)
// is the trigger that fetches its chunk.
const TemplatesPanel = lazy(() =>
  import('../components/tabs/TemplatesPanel').then((m) => ({ default: m.TemplatesPanel })),
);
const SignaturesPanel = lazy(() =>
  import('../components/tabs/SignaturesPanel').then((m) => ({ default: m.SignaturesPanel })),
);
const ListsPanel = lazy(() =>
  import('../components/tabs/ListsPanel').then((m) => ({ default: m.ListsPanel })),
);
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
  const [listModalMode, setListModalMode] = useState<ModalMode | null>(null);
  const [editingList, setEditingList] = useState<DistributionList | null>(null);
  const [signatureModalMode, setSignatureModalMode] = useState<SignatureModalMode | null>(null);
  const [editingSignatureType, setEditingSignatureType] = useState<SignatureType | null>(null);
  const [templateModalMode, setTemplateModalMode] = useState<TemplateModalMode | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [showEnvironmentRequest, setShowEnvironmentRequest] = useState(false);

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
    setEditingList(null);
    setListModalMode('new');
    trackMailingListOpened();
  };
  const handleListEdit = (id: string) => {
    const list = LISTS.find((l) => l.id === id);
    if (!list) return;
    setEditingList(list);
    setListModalMode('edit');
  };
  const handleListDuplicate = (id: string) => {
    const list = LISTS.find((l) => l.id === id);
    if (!list) return;
    setEditingList(list);
    setListModalMode('duplicate');
  };
  const handleListModalClose = () => {
    setListModalMode(null);
    setEditingList(null);
  };
  const handleSignatureNew = (type: SignatureType) => {
    setEditingSignatureType(type);
    setSignatureModalMode('new');
    trackSignatureModalOpened();
  };
  const handleSignatureEdit = (_id: string, type: SignatureType) => {
    setEditingSignatureType(type);
    setSignatureModalMode('edit');
  };
  const handleSignatureDuplicate = (_id: string, type: SignatureType) => {
    setEditingSignatureType(type);
    setSignatureModalMode('duplicate');
  };
  const handleSignatureModalClose = () => {
    setSignatureModalMode(null);
    setEditingSignatureType(null);
  };
  const handleTemplateNew = () => {
    setEditingTemplate(null);
    setTemplateModalMode('new');
  };
  const handleTemplateEdit = (id: string) => {
    const template = [...TEMPLATES, ...DELETED_TEMPLATES].find((t) => t.id === id);
    if (!template) return;
    setEditingTemplate(template);
    setTemplateModalMode('edit');
  };
  const handleTemplateDuplicate = (id: string) => {
    const template = [...TEMPLATES, ...DELETED_TEMPLATES].find((t) => t.id === id);
    if (!template) return;
    setEditingTemplate(template);
    setTemplateModalMode('duplicate');
  };
  const handleTemplateModalClose = () => {
    setTemplateModalMode(null);
    setEditingTemplate(null);
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
            templates={TEMPLATES}
            deletedTemplates={DELETED_TEMPLATES}
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
            signatures={SIGNATURES}
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
            lists={LISTS}
            deletedLists={DELETED_LISTS}
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
              profile={PROFILE}
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
            <Suspense fallback={<PanelLoading />}>{renderTabPanel()}</Suspense>
          </ProfileContent>
        </PageInner>
      </PageScroll>

      {showSpellCheck && (
        <Suspense fallback={<ModalLoading />}>
          <SpellCheckModal onClose={handleSpellCheckClose} />
        </Suspense>
      )}
      {listModalMode && (
        <Suspense fallback={<ModalLoading />}>
          <MailingListModal
            mode={listModalMode}
            initialName={editingList?.name}
            initialMembers={editingList?.members}
            onClose={handleListModalClose}
            onSave={noop}
          />
        </Suspense>
      )}
      {signatureModalMode && (
        <Suspense fallback={<ModalLoading />}>
          <SignatureModal
            mode={signatureModalMode}
            initialType={editingSignatureType}
            onClose={handleSignatureModalClose}
            onSave={noop}
          />
        </Suspense>
      )}
      {templateModalMode && (
        <Suspense fallback={<ModalLoading />}>
          <TemplateModal
            mode={templateModalMode}
            initialName={editingTemplate?.name}
            departmentOptions={DEPARTMENT_FILTER_OPTIONS}
            onClose={handleTemplateModalClose}
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
