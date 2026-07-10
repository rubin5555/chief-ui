import { TabButton, TabItem, Tooltip, UnderlineTabsRoot } from './UnderlineTabs.styles';
import { UNDERLINE_TABS_IDS } from './UnderlineTabs.testids';

export interface UnderlineTab {
  id: string;
  label: string;
  disabled?: boolean;
}

interface UnderlineTabsProps {
  tabs: UnderlineTab[];
  activeId: string;
  onChange: (id: string) => void;
}

export const UnderlineTabs = ({ tabs, activeId, onChange }: UnderlineTabsProps) => {
  const handleTabClick = (tab: UnderlineTab) => () => {
    if (!tab.disabled) onChange(tab.id);
  };

  return (
    <UnderlineTabsRoot data-testid={UNDERLINE_TABS_IDS.root}>
      {tabs.map((tab) => (
        <TabItem key={tab.id}>
          <TabButton
            data-testid={UNDERLINE_TABS_IDS.tab(tab.id)}
            onClick={handleTabClick(tab)}
            $active={activeId === tab.id}
            $disabled={!!tab.disabled}
          >
            {tab.label}
          </TabButton>
          {tab.disabled && <Tooltip>Coming Soon</Tooltip>}
        </TabItem>
      ))}
    </UnderlineTabsRoot>
  );
};
