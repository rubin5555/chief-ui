import { useState } from 'react';
import { useCatalogSidebarAnalytics } from './CatalogSidebar.analytics';
import { sectionForDept } from './CatalogSidebar.constants';
import { Aside, AsideScroll } from './CatalogSidebar.shared.styles';
import { CATALOG_SIDEBAR_IDS } from './CatalogSidebar.testids';
import { SidebarFolderView } from './components/SidebarFolderView';
import { SidebarNavView } from './components/SidebarNavView';
import { useSidebarFolders } from './useSidebarFolders';

export interface CatalogSidebarProps {
  dept: string;
  folder: string;
  sub: string;
  onSelectDepartment: (dept: string) => void;
  onSelectFolder: (folder: string | null, sub: string | null) => void;
  onOpenCommandPage: (org: string) => void;
}

export const CatalogSidebar = ({
  dept,
  folder,
  sub,
  onSelectDepartment,
  onSelectFolder,
  onOpenCommandPage,
}: CatalogSidebarProps) => {
  // Which of the two views is showing. main derives this from a `folderDept`
  // that its mount effect fills in from the selected department; here the
  // department comes off the URL, so the initial view is known at first render
  // and the effect isn't needed — arriving at `/catalog?dept=…` opens straight
  // into that department's folders, and only the back button returns to the menu.
  const [showMenu, setShowMenu] = useState(!dept);
  const folders = useSidebarFolders();

  const { trackDepartmentSelected, trackFolderSelected, trackBackToMenu, trackCommandPageOpened } =
    useCatalogSidebarAnalytics();

  const handleSelectDepartment = (next: string) => {
    onSelectDepartment(next);
    trackDepartmentSelected(next);
    setShowMenu(false);
  };

  const handleSelectFolder = (nextFolder: string | null, nextSub: string | null) => {
    onSelectFolder(nextFolder, nextSub);
    trackFolderSelected(nextFolder, nextSub);
  };

  const handleOpenCommandPage = (org: string) => {
    onOpenCommandPage(org);
    trackCommandPageOpened(org);
  };

  // Going back to the menu drops the folder filter but keeps the department —
  // the catalog beside it carries on showing that department's documents.
  const handleBack = () => {
    onSelectFolder(null, null);
    trackBackToMenu();
    setShowMenu(true);
  };

  return (
    <Aside data-testid={CATALOG_SIDEBAR_IDS.root}>
      <AsideScroll dir="rtl">
        {showMenu || !dept ? (
          <SidebarNavView
            activeSection={sectionForDept(dept)}
            activeDept={dept}
            onSelectDept={handleSelectDepartment}
            onOpenCommandPage={handleOpenCommandPage}
          />
        ) : (
          <SidebarFolderView
            dept={dept}
            folders={folders}
            selectedFolder={folder}
            selectedSub={sub}
            onSelectFolder={handleSelectFolder}
            onBack={handleBack}
          />
        )}
      </AsideScroll>
    </Aside>
  );
};
