import { ChevronLeft, Folder } from 'lucide-react';
import type { OrgGroup } from '../../../../CatalogSidebar.constants';
import { SubItem, SubItemIcon, SubItemLabel } from '../../../../CatalogSidebar.shared.styles';
import { CATALOG_SIDEBAR_IDS } from '../../../../CatalogSidebar.testids';
import { OrgChevron, OrgDepts, OrgIcon, OrgLabel, OrgRow } from './SidebarOrgGroup.styles';

interface SidebarOrgGroupProps {
  org: OrgGroup;
  isExpanded: boolean;
  activeDept: string;
  onToggle: () => void;
  onSelectDept: (dept: string) => void;
}

export const SidebarOrgGroup = ({
  org,
  isExpanded,
  activeDept,
  onToggle,
  onSelectDept,
}: SidebarOrgGroupProps) => {
  // `org.name` is known at this level, so the department handler arrives at the
  // row already bound to one department rather than as a factory to re-curry.
  const handleDeptClick = (dept: string) => () => onSelectDept(dept);

  return (
    <div>
      <OrgRow
        $expanded={isExpanded}
        data-testid={CATALOG_SIDEBAR_IDS.orgToggle(org.name)}
        onClick={onToggle}
      >
        <OrgChevron $expanded={isExpanded}>
          <ChevronLeft size={12} />
        </OrgChevron>
        <OrgIcon>
          <Folder size={14} />
        </OrgIcon>
        <OrgLabel>{org.name}</OrgLabel>
      </OrgRow>

      {isExpanded && (
        <OrgDepts>
          {org.depts.map((dept) => (
            <SubItem
              key={dept}
              $active={activeDept === dept}
              data-testid={CATALOG_SIDEBAR_IDS.subItem(dept)}
              onClick={handleDeptClick(dept)}
            >
              <SubItemIcon $active={activeDept === dept}>
                <Folder size={14} />
              </SubItemIcon>
              <SubItemLabel>{dept}</SubItemLabel>
            </SubItem>
          ))}
        </OrgDepts>
      )}
    </div>
  );
};
