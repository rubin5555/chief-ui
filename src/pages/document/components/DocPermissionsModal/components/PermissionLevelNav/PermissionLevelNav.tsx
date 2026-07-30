import type { PermissionLevel } from '../../DocPermissionsModal.constants';
import { DOC_PERMISSIONS_MODAL_IDS } from '../../DocPermissionsModal.testids';
import {
  LevelButton,
  LevelDescription,
  LevelIcon,
  LevelLabel,
  LevelList,
  NavRoot,
} from './PermissionLevelNav.styles';

interface PermissionLevelNavProps {
  levels: PermissionLevel[];
  activeId: string;
  onSelect: (id: string) => void;
}

export const PermissionLevelNav = ({ levels, activeId, onSelect }: PermissionLevelNavProps) => {
  const handleSelect = (id: string) => () => onSelect(id);
  const active = levels.find((level) => level.id === activeId) ?? levels[0];

  return (
    <NavRoot>
      <LevelList>
        {levels.map(({ id, label, Icon }) => {
          const isActive = id === activeId;
          return (
            <LevelButton
              key={id}
              type="button"
              $active={isActive}
              aria-pressed={isActive}
              data-testid={DOC_PERMISSIONS_MODAL_IDS.level(id)}
              onClick={handleSelect(id)}
            >
              <LevelIcon $active={isActive}>
                <Icon size={16} aria-hidden="true" />
              </LevelIcon>
              <LevelLabel $active={isActive}>{label}</LevelLabel>
            </LevelButton>
          );
        })}
      </LevelList>

      <LevelDescription data-testid={DOC_PERMISSIONS_MODAL_IDS.description}>
        {active.description}
      </LevelDescription>
    </NavRoot>
  );
};
