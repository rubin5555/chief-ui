import { TOOLBAR_ICON_SIZE, type ToolbarToggle } from '../../EditorRibbon.constants';
import { EDITOR_RIBBON_IDS } from '../../EditorRibbon.testids';
import { ToolbarButton } from '../ToolbarButton';

export interface ToggleGroupProps {
  toggles: ToolbarToggle[];
  activeIds: Set<string>;
  disabled: boolean;
  onToggle: (toggle: ToolbarToggle) => void;
}

// One run of on/off ribbon buttons. It reports which toggle was pressed and
// renders whichever ids came back as active — what a press does to the document,
// and what that in turn does to the other buttons, is the editor's business.
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
