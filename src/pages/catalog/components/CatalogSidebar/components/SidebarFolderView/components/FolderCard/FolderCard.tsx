import { ChevronLeft, Folder } from 'lucide-react';
import type { ChangeEvent, KeyboardEvent, MouseEvent } from 'react';
import { useState } from 'react';
import type { FolderNode } from '../../../../CatalogSidebar.constants';
import { CATALOG_SIDEBAR_IDS } from '../../../../CatalogSidebar.testids';
import { FolderCardMenu } from './components/FolderCardMenu';
import { SubFolderForm } from './components/SubFolderForm';
import {
  CardRoot,
  CardRow,
  DocCount,
  FolderIcon,
  Name,
  NameWrap,
  RenameInput,
  SubIcon,
  SubList,
  SubName,
  SubRow,
  SubsToggle,
} from './FolderCard.styles';

interface FolderCardProps {
  node: FolderNode;
  readOnly?: boolean;
  isSelected: boolean;
  selectedSub: string | null;
  onRename: (name: string) => void;
  onAddSub: (name: string) => void;
  onToggleSubs: () => void;
  onDeleteRequest: () => void;
  onSelect: () => void;
  onSelectSub: (sub: string) => void;
}

export const FolderCard = ({
  node,
  readOnly,
  isSelected,
  selectedSub,
  onRename,
  onAddSub,
  onToggleSubs,
  onDeleteRequest,
  onSelect,
  onSelectSub,
}: FolderCardProps) => {
  const [renameValue, setRenameValue] = useState<string | null>(null);
  const [isAddingSub, setIsAddingSub] = useState(false);

  const isRenaming = renameValue !== null;
  const hasSubs = node.subs.length > 0;

  const onRenameStart = () => setRenameValue(node.name);
  const onRenameChange = (event: ChangeEvent<HTMLInputElement>) =>
    setRenameValue(event.target.value);

  // Blur and Enter both land here, so a rename commits the same way however it
  // ends. An empty or unchanged value is simply dropped.
  const commitRename = () => {
    const trimmed = renameValue?.trim() ?? '';
    if (trimmed && trimmed !== node.name) onRename(trimmed);
    setRenameValue(null);
  };

  const onRenameKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') commitRename();
    if (event.key === 'Escape') setRenameValue(null);
  };

  const stopPropagation = (event: MouseEvent) => event.stopPropagation();

  const onToggleClick = (event: MouseEvent) => {
    event.stopPropagation();
    if (hasSubs) onToggleSubs();
  };

  const onAddSubStart = () => setIsAddingSub(true);
  const onAddSubCancel = () => setIsAddingSub(false);
  const onAddSubCreate = (name: string) => {
    onAddSub(name);
    setIsAddingSub(false);
  };

  const handleSubClick = (sub: string) => (event: MouseEvent) => {
    event.stopPropagation();
    onSelectSub(sub);
  };

  return (
    <CardRoot data-testid={CATALOG_SIDEBAR_IDS.folderCard(node.id)}>
      <CardRow $selected={isSelected} onClick={onSelect}>
        <FolderIcon $selected={isSelected}>
          <Folder size={15} />
        </FolderIcon>

        <SubsToggle
          type="button"
          $selected={isSelected}
          $expanded={!node.subCollapsed}
          $shown={hasSubs}
          onClick={onToggleClick}
        >
          <ChevronLeft size={14} />
        </SubsToggle>

        {isRenaming ? (
          <RenameInput
            autoFocus
            dir="rtl"
            value={renameValue}
            data-testid={CATALOG_SIDEBAR_IDS.folderRenameInput(node.id)}
            onChange={onRenameChange}
            onKeyDown={onRenameKeyDown}
            onBlur={commitRename}
            onClick={stopPropagation}
          />
        ) : (
          <NameWrap>
            <Name $selected={isSelected}>{node.name}</Name>
            {node.docs != null && node.docs > 0 && (
              <DocCount $selected={isSelected}>({node.docs})</DocCount>
            )}
          </NameWrap>
        )}

        {!readOnly && (
          <FolderCardMenu
            folderId={node.id}
            onSelectedRow={isSelected}
            onRenameClick={onRenameStart}
            onAddSubClick={onAddSubStart}
            onDeleteClick={onDeleteRequest}
          />
        )}
      </CardRow>

      {isAddingSub && <SubFolderForm onCreate={onAddSubCreate} onCancel={onAddSubCancel} />}

      {hasSubs && !node.subCollapsed && (
        <SubList>
          {node.subs.map((sub) => (
            <SubRow
              key={sub}
              $active={selectedSub === sub}
              data-testid={CATALOG_SIDEBAR_IDS.folderSub(node.id, sub)}
              onClick={handleSubClick(sub)}
            >
              <SubIcon>
                <Folder size={13} />
              </SubIcon>
              <SubName>{sub}</SubName>
            </SubRow>
          ))}
        </SubList>
      )}
    </CardRoot>
  );
};
