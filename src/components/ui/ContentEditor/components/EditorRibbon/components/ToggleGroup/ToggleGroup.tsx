import { TOOLBAR_ICON_SIZE, type ToolbarToggle } from '../../EditorRibbon.constants';
import { EDITOR_RIBBON_IDS } from '../../EditorRibbon.testids';
import { ToolbarButton } from '../ToolbarButton';

export interface ToggleGroupProps {
  toggles: ToolbarToggle[];
  activeIds: Set<string>;
  disabled: boolean;
  onToggle: (toggle: ToolbarToggle) => void;
}

export const ToggleGroup = ({ toggles, activeIds, disabled, onToggle }: ToggleGroupProps) => {
  const handleToggle = (toggle: ToolbarToggle) => () => onToggle(toggle);

  return (
    <>
      {toggles.map((toggle) => (
        <ToolbarButton
          key={toggle.id}
          title={toggle.title}
          active={activeIds.has(toggle.id)}
          disabled={disabled}
          onClick={handleToggle(toggle)}
          data-testid={EDITOR_RIBBON_IDS.toggle(toggle.id)}
        >
          <toggle.Icon size={TOOLBAR_ICON_SIZE} aria-hidden="true" />
        </ToolbarButton>
      ))}
    </>
  );
};
