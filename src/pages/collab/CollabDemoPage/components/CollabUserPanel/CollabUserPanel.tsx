import { ContentEditor, ContentEditorToolbar } from '@/components/ui/ContentEditor';
import { type CollabEventLogItem, CollabProvider, useCollabContext } from '@/context/CollabContext';
import { ContentEditorProvider } from '@/context/ContentEditorContext';
import type { DemoSectionDef } from '../../CollabDemoPage.constants';
import { COLLAB_DEMO_IDS } from '../../CollabDemoPage.testids';
import {
  EditorArea,
  PanelBody,
  PanelContainer,
  PanelHeader,
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

  const handleSectionChange = (fieldId: string) => (newValue: string) => {
    onValueChange(fieldId, newValue);
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
        {sections.map((section) => (
          <SectionCard
            key={section.id}
            data-testid={COLLAB_DEMO_IDS.sectionCard(userId, section.id)}
          >
            <SectionCardHeader>
              <SectionTitle>{section.title}</SectionTitle>
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
        ))}
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
  onValueChange,
  onCollabEvent,
}: CollabUserPanelProps) => {
  return (
    <CollabProvider userId={userId} userName={userName} onCollabEvent={onCollabEvent}>
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
