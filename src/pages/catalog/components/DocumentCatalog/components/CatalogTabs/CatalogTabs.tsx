import type { CatalogTab } from '@/api/catalog';
import { CATALOG_TABS } from '../../../../CatalogPage/CatalogPage.constants';
import { DOCUMENT_CATALOG_IDS } from '../../DocumentCatalog.testids';
import { TabButton, TabsRow, TabUnderline } from './CatalogTabs.styles';

interface CatalogTabsProps {
  activeTab: CatalogTab;
  onTabChange: (tab: CatalogTab) => void;
}

export const CatalogTabs = ({ activeTab, onTabChange }: CatalogTabsProps) => {
  const handleTabClick = (tab: CatalogTab) => () => onTabChange(tab);

  return (
    <TabsRow>
      {CATALOG_TABS.map(({ key, label }) => (
        <TabButton
          key={key}
          type="button"
          $active={activeTab === key}
          data-testid={DOCUMENT_CATALOG_IDS.tab(key)}
          onClick={handleTabClick(key)}
        >
          {label}
          {activeTab === key && <TabUnderline />}
        </TabButton>
      ))}
    </TabsRow>
  );
};
