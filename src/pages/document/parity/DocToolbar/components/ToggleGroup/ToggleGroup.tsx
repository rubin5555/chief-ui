import { TOOLBAR_ICON_SIZE, type ToolbarToggle } from '../../DocToolbar.constants';
import { DOC_TOOLBAR_IDS } from '../../DocToolbar.testids';
import { ToolbarButton } from '../ToolbarButton';

export interface ToggleGroupProps {
  toggles: ToolbarToggle[];
  activeIds: Set<string>;
  onToggle: (id: string) => void;
}

// One run of on/off ribbon buttons. Which ones cancel each other is the toolbar's
// business (EXCLUSIVE_GROUPS), not this component's — it reports a press and
// renders whatever came back as active.
export const ToggleGroup = ({ toggles, activeIds, onToggle }: ToggleGroupProps) => {
  const handleToggle = (id: string) => () => onToggle(id);

  return (
    <>
      {toggles.map(({ id, title, Icon }) => (
        <ToolbarButton
          key={id}
          title={title}
          active={activeIds.has(id)}
          onClick={handleToggle(id)}
          data-testid={DOC_TOOLBAR_IDS.toggle(id)}
        >
          <Icon size={TOOLBAR_ICON_SIZE} aria-hidden="true" />
        </ToolbarButton>
      ))}
    </>
  );
};
