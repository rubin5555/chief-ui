import { Network, User } from 'lucide-react';
import type { ReactNode } from 'react';
import { lazy, Suspense, useState } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { ModalLoading } from '@/components/ui/ModalLoading';
import { colors } from '@/styles/theme';
import { useProfileSidebarAnalytics } from './ProfileSidebar.analytics';
import {
  AvatarWrap,
  EntryRow,
  EnvIcon,
  EnvRow,
  EnvSub,
  EnvText,
  EnvTitle,
  ListEntryIcon,
  ListEntryText,
  ScrollList,
  Section,
  SectionTitle,
  SidebarRoot,
  UserInfo,
  UserMeta,
  UserName,
} from './ProfileSidebar.styles';
import { PROFILE_SIDEBAR_IDS } from './ProfileSidebar.testids';

export interface ProfileInfo {
  name: string;
  id: string;
  organization: string;
}

export interface ListEntry {
  id: string;
  icon: ReactNode;
  label: string;
}

const noop = () => {};

// EnvironmentRequestModal is only needed once the user asks to request an
// environment — lazy-loaded so it doesn't ship in the main bundle.
const EnvironmentRequestModal = lazy(() =>
  import('@/modals/EnvironmentRequestModal').then((m) => ({
    default: m.EnvironmentRequestModal,
  })),
);

interface ProfileSidebarProps {
  profile: ProfileInfo;
  permissions: ListEntry[];
  departments: ListEntry[];
}

export const ProfileSidebar = ({ profile, permissions, departments }: ProfileSidebarProps) => {
  const [showEnvironmentRequest, setShowEnvironmentRequest] = useState(false);
  const { trackEnvironmentModalOpened } = useProfileSidebarAnalytics();

  const handleRequestEnvironment = () => {
    setShowEnvironmentRequest(true);
    trackEnvironmentModalOpened();
  };
  const handleEnvironmentRequestClose = () => setShowEnvironmentRequest(false);

  return (
    <SidebarRoot data-testid={PROFILE_SIDEBAR_IDS.root}>
      <AvatarWrap>
        <Avatar size="lg" data-testid={PROFILE_SIDEBAR_IDS.avatar}>
          <User size={48} color={colors.surface} />
        </Avatar>
      </AvatarWrap>

      <UserInfo data-testid={PROFILE_SIDEBAR_IDS.userInfo}>
        <UserName>{profile.name}</UserName>
        <UserMeta>ת.ז: {profile.id}</UserMeta>
        <UserMeta $noMargin>{profile.organization}</UserMeta>
      </UserInfo>

      <Section data-testid={PROFILE_SIDEBAR_IDS.permissions} $scroll>
        <SectionTitle>הרשאות</SectionTitle>
        <ScrollList>
          {permissions.map((p) => (
            <EntryRow data-testid={PROFILE_SIDEBAR_IDS.permissionEntry(p.id)} key={p.id}>
              <ListEntryIcon>{p.icon}</ListEntryIcon>
              <ListEntryText>{p.label}</ListEntryText>
            </EntryRow>
          ))}
        </ScrollList>
      </Section>

      <Section data-testid={PROFILE_SIDEBAR_IDS.departments} $mt $scroll>
        <SectionTitle>אגפים</SectionTitle>
        <ScrollList>
          {departments.map((d) => (
            <EntryRow data-testid={PROFILE_SIDEBAR_IDS.departmentEntry(d.id)} key={d.id}>
              <ListEntryIcon>{d.icon}</ListEntryIcon>
              <ListEntryText>{d.label}</ListEntryText>
            </EntryRow>
          ))}
        </ScrollList>
      </Section>

      <Section data-testid={PROFILE_SIDEBAR_IDS.env} $mt>
        <EnvRow>
          <EnvIcon>
            <Network size={16} />
          </EnvIcon>
          <EnvText>
            <EnvTitle>רוצה סביבה משלך?</EnvTitle>
            <EnvSub>ליצור ולערוך פקודות באופן עצמאי</EnvSub>
          </EnvText>
          <Button
            size="xs"
            data-testid={PROFILE_SIDEBAR_IDS.envButton}
            onClick={handleRequestEnvironment}
          >
            שלח בקשה
          </Button>
        </EnvRow>
      </Section>

      {showEnvironmentRequest && (
        <Suspense fallback={<ModalLoading />}>
          <EnvironmentRequestModal onClose={handleEnvironmentRequestClose} onSubmit={noop} />
        </Suspense>
      )}
    </SidebarRoot>
  );
};
