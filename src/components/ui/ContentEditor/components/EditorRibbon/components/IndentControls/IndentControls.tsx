import { Indent, Outdent } from 'lucide-react';
import { TOOLBAR_ICON_SIZE } from '../../EditorRibbon.constants';
import { EDITOR_RIBBON_IDS } from '../../EditorRibbon.testids';
import { ToolbarButton } from '../ToolbarButton';

export interface IndentControlsProps {
  disabled: boolean;
  canOutdent: boolean;
  onIndent: () => void;
  onOutdent: () => void;
}

export const IndentControls = ({
  disabled,
  canOutdent,
  onIndent,
  onOutdent,
}: IndentControlsProps) => (
  <>
    <ToolbarButton
      title="הקטן הזחה"
      disabled={disabled || !canOutdent}
      onClick={onOutdent}
      data-testid={EDITOR_RIBBON_IDS.indentDecrease}
    >
      <Indent size={TOOLBAR_ICON_SIZE} aria-hidden="true" />
    </ToolbarButton>
    <ToolbarButton
      title="הגדל הזחה"
      disabled={disabled}
      onClick={onIndent}
      data-testid={EDITOR_RIBBON_IDS.indentIncrease}
    >
      <Outdent size={TOOLBAR_ICON_SIZE} aria-hidden="true" />
    </ToolbarButton>
  </>
);
