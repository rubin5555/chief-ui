import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import type { FolderNode } from '../../CatalogSidebar.constants';
import {
  BACK_TO_MENU_TEXT,
  EMPTY_FOLDERS_TEXT,
  envForDept,
  isGuideDept,
  isReadOnlyDept,
  MY_DEPTS,
} from '../../CatalogSidebar.constants';
import { CATALOG_SIDEBAR_IDS } from '../../CatalogSidebar.testids';
import type { SidebarFolders } from '../../useSidebarFolders';
import { DeleteFolderModal } from './components/DeleteFolderModal';
import { FolderCard } from './components/FolderCard';
import { NewFolderForm } from './components/NewFolderForm';
import {
  BackButton,
  DeptHeading,
  DeptLabel,
  Divider,
  EnvLabel,
  FolderList,
  FolderViewBody,
  NoFolders,
} from './SidebarFolderView.styles';

interface SidebarFolderViewProps {
  dept: string;
  folders: SidebarFolders;
  selectedFolder: string;
  selectedSub: string;
  onSelectFolder: (folder: string | null, sub: string | null) => void;
  onBack: () => void;
}

export const SidebarFolderView = ({
  dept,
  folders,
  selectedFolder,
  selectedSub,
  onSelectFolder,
  onBack,
}: SidebarFolderViewProps) => {
  const [deleteTarget, setDeleteTarget] = useState<FolderNode | null>(null);
  const [guideCollapsed, setGuideCollapsed] = useState<Record<string, boolean>>({});

  const isGuide = isGuideDept(dept);
  const readOnly = isReadOnlyDept(dept);

  // The guide's two entries don't have folders of their own — they list the
  // departments, each one carrying its own folders as sub-rows.
  const nodes: FolderNode[] = isGuide
    ? MY_DEPTS.map((name) => ({
        id: name,
        name,
        subs: folders.forDept(name).map((folder) => folder.name),
        subCollapsed: guideCollapsed[name] ?? false,
        docs: folders.forDept(name).reduce((total, folder) => total + (folder.docs ?? 0), 0),
      }))
    : folders.forDept(dept);

  const onCreateFolder = (name: string) => folders.create(dept, name);

  const toggleGuide = (id: string) => setGuideCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleToggleSubs = (node: FolderNode) => () => {
    if (isGuide) {
      toggleGuide(node.id);
      return;
    }
    folders.update(dept, node.id, { subCollapsed: !node.subCollapsed });
  };

  const handleRename = (node: FolderNode) => (name: string) =>
    folders.update(dept, node.id, { name });

  const handleAddSub = (node: FolderNode) => (sub: string) =>
    folders.update(dept, node.id, { subs: [...node.subs, sub], subCollapsed: false });

  const handleDeleteRequest = (node: FolderNode) => () => setDeleteTarget(node);

  // Clicking the folder that is already selected clears the filter, which is
  // how main lets you get back to "everything in this department".
  const handleSelect = (node: FolderNode) => () => {
    if (isGuide) {
      toggleGuide(node.id);
      return;
    }
    const alreadyOn = selectedFolder === node.name && !selectedSub;
    onSelectFolder(alreadyOn ? null : node.name, null);
  };

  const handleSelectSub = (node: FolderNode) => (sub: string) => {
    const alreadyOn = selectedFolder === node.name && selectedSub === sub;
    if (alreadyOn) {
      onSelectFolder(null, null);
      return;
    }
    onSelectFolder(isGuide ? null : node.name, sub);
  };

  const onDeleteCancel = () => setDeleteTarget(null);
  const onDeleteConfirm = () => {
    if (deleteTarget) folders.remove(dept, deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <FolderViewBody data-testid={CATALOG_SIDEBAR_IDS.folderView}>
      <BackButton type="button" data-testid={CATALOG_SIDEBAR_IDS.backToMenu} onClick={onBack}>
        <ArrowRight size={14} />
        {BACK_TO_MENU_TEXT}
      </BackButton>

      <DeptHeading>
        {!readOnly && <EnvLabel>{envForDept(dept)}</EnvLabel>}
        <DeptLabel>{dept}</DeptLabel>
      </DeptHeading>

      <Divider />

      {!readOnly && <NewFolderForm onCreate={onCreateFolder} />}

      {nodes.length > 0 ? (
        <FolderList>
          {nodes.map((node) => (
            <FolderCard
              key={node.id}
              node={node}
              readOnly={readOnly}
              isSelected={!isGuide && selectedFolder === node.name}
              selectedSub={selectedFolder === node.name || isGuide ? selectedSub || null : null}
              onRename={handleRename(node)}
              onAddSub={handleAddSub(node)}
              onToggleSubs={handleToggleSubs(node)}
              onDeleteRequest={handleDeleteRequest(node)}
              onSelect={handleSelect(node)}
              onSelectSub={handleSelectSub(node)}
            />
          ))}
        </FolderList>
      ) : (
        <NoFolders data-testid={CATALOG_SIDEBAR_IDS.emptyFolders}>{EMPTY_FOLDERS_TEXT}</NoFolders>
      )}

      {deleteTarget && <DeleteFolderModal onConfirm={onDeleteConfirm} onClose={onDeleteCancel} />}
    </FolderViewBody>
  );
};
