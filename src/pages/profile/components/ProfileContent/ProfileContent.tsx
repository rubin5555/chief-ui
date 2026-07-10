import type { ReactNode } from 'react';
import { TabCard } from '@/components/ui/TabCard';
import { useProfileContentAnalytics } from './ProfileContent.analytics';
import { ContentRoot, TabGrid } from './ProfileContent.styles';
import { PROFILE_CONTENT_IDS } from './ProfileContent.testids';

export interface Tab {
  id: string;
  icon: ReactNode;
  label: string;
  count?: number;
}

interface ProfileContentProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  children?: ReactNode;
  footer?: ReactNode;
}

export const ProfileContent = ({
  tabs,
  activeTab,
  onTabChange,
  children,
  footer,
}: ProfileContentProps) => {
  const { trackTabChange } = useProfileContentAnalytics();

  const handleTabClick = (id: string) => () => {
    const tab = tabs.find((t) => t.id === id);
    trackTabChange(id, tab?.label ?? id);
    onTabChange(id);
  };

  return (
    <ContentRoot data-testid={PROFILE_CONTENT_IDS.root}>
      <TabGrid data-testid={PROFILE_CONTENT_IDS.tabs}>
        {tabs.map((tab) => (
          <TabCard
            key={tab.id}
            icon={tab.icon}
            label={tab.label}
            count={tab.count}
            isActive={activeTab === tab.id}
            onClick={handleTabClick(tab.id)}
          />
        ))}
      </TabGrid>
      {children}
      {footer}
    </ContentRoot>
  );
};
