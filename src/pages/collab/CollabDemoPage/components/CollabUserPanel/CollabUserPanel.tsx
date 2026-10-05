import { Lock, Unlock } from 'lucide-react';
import { ContentEditor, ContentEditorToolbar } from '@/components/ui/ContentEditor';
import { type CollabEventLogItem, CollabProvider, useCollabContext } from '@/context/CollabContext';
import { ContentEditorProvider, useContentEditorContext } from '@/context/ContentEditorContext';
import type { DemoSectionDef } from '../../CollabDemoPage.constants';
import { COLLAB_DEMO_IDS } from '../../CollabDemoPage.testids';
import {
  EditorArea,
  LockStateBadge,
  PanelBody,
  PanelContainer,
  PanelHeader,
  ReleaseBtn,
  SectionActions,
  SectionCard,
  SectionCardHeader,
  SectionTitle,
  StatusDot,
  StatusPill,
  ToolbarSlot,
  UserAvatar,
  UserIdentity,
  UserMeta,
  UserName,
  UserRole,
} from './CollabUserPanel.styles';

export interface CollabUserPanelProps {
  userId: string;
  userName: string;
  userRole: string;
  accentColor: string;
  sections: DemoSectionDef[];
  values: Record<string, string>;
  locklessMode?: boolean;
  onValueChange: (fieldId: string, value: string) => void;
  onCollabEvent?: (event: CollabEventLogItem) => void;
}

interface UserPanelInnerProps {
  userId: string;
  userName: string;
  userRole: string;
  accentColor: string;
  sections: DemoSectionDef[];
  values: Record<string, string>;
  onValueChange: (fieldId: string, value: string) => void;
}

const UserPanelInner = ({
  userId,
  userName,
  userRole,
  accentColor,
  sections,
  values,
  onValueChange,
}: UserPanelInnerProps) => {
  const collab = useCollabContext();
  const ctx = useContentEditorContext();

  const handleSectionChange = (fieldId: string) => (newValue: string) => {
    onValueChange(fieldId, newValue);
  };

  const handleReleaseLock = (fieldId: string) => () => {
    ctx?.setActive(null);
    ctx?.setActiveEditor(null);
    collab?.releaseLock(fieldId);
  };

  const isConnected = collab?.connected ?? false;

  return (
    <PanelContainer $accentColor={accentColor} data-testid={COLLAB_DEMO_IDS.userPanel(userId)}>
      <PanelHeader>
        <UserIdentity>
          <UserAvatar $accentColor={accentColor}>{userName[0]}</UserAvatar>
          <UserMeta>
            <UserName>{userName}</UserName>
            <UserRole>{userRole}</UserRole>
          </UserMeta>
        </UserIdentity>

        <StatusPill $connected={isConnected} data-testid={COLLAB_DEMO_IDS.userStatus(userId)}>
          <StatusDot $connected={isConnected} />
          {isConnected ? 'מחובר לשירות' : 'מנותק'}
        </StatusPill>
      </PanelHeader>

      <ToolbarSlot>
        <ContentEditorToolbar />
      </ToolbarSlot>

      <PanelBody>
        {sections.map((section) => {
          const isLockless = collab?.locklessMode ?? false;
          const lock = collab?.lockState.get(section.id);
          const isHeldByMe = !isLockless && !!lock && lock.holderId === userId;
          const isHeldByOther = !isLockless && !!lock && lock.holderId !== userId;
          const lockType: 'mine' | 'other' | 'free' = isLockless
            ? 'mine'
            : isHeldByMe
              ? 'mine'
              : isHeldByOther
                ? 'other'
                : 'free';

          return (
            <SectionCard
              key={section.id}
              $isHeldByMe={isHeldByMe}
              $isHeldByOther={isHeldByOther}
              data-testid={COLLAB_DEMO_IDS.sectionCard(userId, section.id)}
            >
              <SectionCardHeader $isHeldByMe={isHeldByMe} $isHeldByOther={isHeldByOther}>
                <SectionTitle>{section.title}</SectionTitle>

                <SectionActions>
                  <LockStateBadge
                    $type={lockType}
                    data-testid={COLLAB_DEMO_IDS.lockStatusBadge(userId, section.id)}
                  >
                    {isLockless
                      ? '⚡ עריכה מקבילית (CRDT Lockless)'
                      : isHeldByMe
                        ? 'עריכה פעילה (נעילה מוחזקת)'
                        : isHeldByOther
                          ? `נעול ע״י ${lock.holderId}`
                          : 'פנוי לעריכה (לחצו להתחלה)'}
                  </LockStateBadge>

                  {!isLockless && isHeldByMe && (
                    <ReleaseBtn
                      type="button"
                      data-testid={COLLAB_DEMO_IDS.releaseBtn(userId, section.id)}
                      onClick={handleReleaseLock(section.id)}
                    >
                      <Unlock size={12} />
                      שחרר נעילה
                    </ReleaseBtn>
                  )}
                  {!isLockless && isHeldByOther && <Lock size={13} color="var(--color-accent)" />}
                </SectionActions>
              </SectionCardHeader>

              <EditorArea>
                <ContentEditor
                  id={section.id}
                  value={values[section.id] ?? ''}
                  onChange={handleSectionChange(section.id)}
                  placeholder={`הזן תוכן עבור ${section.title}...`}
                  minHeight={90}
                  disableBlurDeactivate={true}
                />
              </EditorArea>
            </SectionCard>
          );
        })}
      </PanelBody>
    </PanelContainer>
  );
};

export const CollabUserPanel = ({
  userId,
  userName,
  userRole,
  accentColor,
  sections,
  values,
  locklessMode = false,
  onValueChange,
  onCollabEvent,
}: CollabUserPanelProps) => {
  return (
    <CollabProvider userId={userId} locklessMode={locklessMode} onCollabEvent={onCollabEvent}>
      <ContentEditorProvider>
        <UserPanelInner
          userId={userId}
          userName={userName}
          userRole={userRole}
          accentColor={accentColor}
          sections={sections}
          values={values}
          onValueChange={onValueChange}
        />
      </ContentEditorProvider>
    </CollabProvider>
  );
};
