import { BookOpen, ChevronLeft, FileText, Folder } from 'lucide-react';
import { useState } from 'react';
import type { SectionKey } from '../../CatalogSidebar.constants';
import {
  MAIN_ORGS,
  MY_DEPTS,
  OTHER_ORGS,
  orgForDept,
  SECTION,
  SECTION_LABEL,
} from '../../CatalogSidebar.constants';
import {
  SectionButton,
  SectionChevron,
  SectionLabel,
  SubItem,
  SubItemIcon,
  SubItemLabel,
  SubList,
} from '../../CatalogSidebar.shared.styles';
import { CATALOG_SIDEBAR_IDS } from '../../CatalogSidebar.testids';
import { SidebarOrgGroup } from './components/SidebarOrgGroup';
import { NavStack } from './SidebarNavView.styles';

interface SidebarNavViewProps {
  activeSection: SectionKey | null;
  activeDept: string;
  onSelectDept: (dept: string) => void;
  onOpenCommandPage: (org: string) => void;
}

export const SidebarNavView = ({
  activeSection,
  activeDept,
  onSelectDept,
  onOpenCommandPage,
}: SidebarNavViewProps) => {
  const [expandedSection, setExpandedSection] = useState<SectionKey | null>(activeSection);
  const [expandedOrg, setExpandedOrg] = useState<string | null>(() => orgForDept(activeDept));

  const handleSectionClick = (key: SectionKey) => () => {
    setExpandedSection((prev) => (prev === key ? null : key));
    if (key === SECTION.allDocuments) onSelectDept(SECTION_LABEL.allDocuments);
  };

  const handleDeptClick = (dept: string) => () => onSelectDept(dept);
  const handleOrgToggle = (name: string) => () =>
    setExpandedOrg((prev) => (prev === name ? null : name));
  const handleMainOrgClick = (org: string) => () => onOpenCommandPage(org);

  const renderSectionButton = (key: SectionKey, expandable: boolean) => {
    const isActive = activeSection === key;
    return (
      <SectionButton
        type="button"
        $active={isActive}
        data-testid={CATALOG_SIDEBAR_IDS.section(key)}
        onClick={handleSectionClick(key)}
      >
        <SectionChevron $active={isActive} $expanded={expandable && expandedSection === key}>
          <ChevronLeft size={16} />
        </SectionChevron>
        <SectionLabel>{SECTION_LABEL[key]}</SectionLabel>
      </SectionButton>
    );
  };

  return (
    <NavStack data-testid={CATALOG_SIDEBAR_IDS.navView}>
      <div>
        {renderSectionButton(SECTION.myEnvironment, true)}
        {expandedSection === SECTION.myEnvironment && (
          <SubList>
            {MY_DEPTS.map((dept) => (
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
          </SubList>
        )}
      </div>

      <div>
        {renderSectionButton(SECTION.additionalEnvironments, true)}
        {expandedSection === SECTION.additionalEnvironments && (
          <SubList>
            {OTHER_ORGS.map((org) => (
              <SidebarOrgGroup
                key={org.name}
                org={org}
                isExpanded={expandedOrg === org.name}
                activeDept={activeDept}
                onToggle={handleOrgToggle(org.name)}
                onSelectDept={onSelectDept}
              />
            ))}
          </SubList>
        )}
      </div>

      {renderSectionButton(SECTION.allDocuments, false)}

      <div>
        {renderSectionButton(SECTION.mainDocuments, true)}
        {expandedSection === SECTION.mainDocuments && (
          <SubList>
            {MAIN_ORGS.map((org) => (
              <SubItem
                key={org}
                $active={activeDept === org}
                data-testid={CATALOG_SIDEBAR_IDS.subItem(org)}
                onClick={handleMainOrgClick(org)}
              >
                <SubItemIcon $active={activeDept === org}>
                  <Folder size={14} />
                </SubItemIcon>
                <SubItemLabel>{org}</SubItemLabel>
              </SubItem>
            ))}
          </SubList>
        )}
      </div>

      <div>
        {renderSectionButton(SECTION.guide, true)}
        {expandedSection === SECTION.guide && (
          <SubList>
            <SubItem
              $active={activeDept === 'מדיניות'}
              data-testid={CATALOG_SIDEBAR_IDS.subItem('מדיניות')}
              onClick={handleDeptClick('מדיניות')}
            >
              <SubItemIcon $active={activeDept === 'מדיניות'}>
                <FileText size={14} />
              </SubItemIcon>
              <SubItemLabel>מדיניות</SubItemLabel>
            </SubItem>
            <SubItem
              $active={activeDept === 'הוראות'}
              data-testid={CATALOG_SIDEBAR_IDS.subItem('הוראות')}
              onClick={handleDeptClick('הוראות')}
            >
              <SubItemIcon $active={activeDept === 'הוראות'}>
                <BookOpen size={14} />
              </SubItemIcon>
              <SubItemLabel>הוראות</SubItemLabel>
            </SubItem>
          </SubList>
        )}
      </div>
    </NavStack>
  );
};
