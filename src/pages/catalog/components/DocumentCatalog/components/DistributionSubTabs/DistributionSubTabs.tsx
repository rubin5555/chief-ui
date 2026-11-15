import { DIST_SUB_TABS } from '../../DocumentCatalog.constants';
import { DOCUMENT_CATALOG_IDS } from '../../DocumentCatalog.testids';
import { SubTabButton, SubTabsRow } from './DistributionSubTabs.styles';

interface DistributionSubTabsProps {
  active: string;
  onChange: (label: string) => void;
}

export const DistributionSubTabs = ({ active, onChange }: DistributionSubTabsProps) => {
  const handleClick = (label: string) => () => onChange(label);

  return (
    <SubTabsRow>
      {DIST_SUB_TABS.map((label) => (
        <SubTabButton
          key={label}
          type="button"
          $active={active === label}
          data-testid={DOCUMENT_CATALOG_IDS.distSubTab(label)}
          onClick={handleClick(label)}
        >
          {label}
        </SubTabButton>
      ))}
    </SubTabsRow>
  );
};
