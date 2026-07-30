import { Indent, Outdent } from 'lucide-react';
import { TOOLBAR_ICON_SIZE } from '../../EditorRibbon.constants';
import { EDITOR_RIBBON_IDS } from '../../EditorRibbon.testids';
import { ToolbarButton } from '../ToolbarButton';

export interface IndentControlsProps {
  disabled: boolean;
  /** There is no indent to take away yet, so the outdent button has nothing to do. */
  canOutdent: boolean;
  onIndent: () => void;
  onOutdent: () => void;
}

// main counts the indent depth in the ribbon's own state, which is a number that
// belongs to whichever paragraph the caret happens to be in — so it is wrong for
// every paragraph but one. The depth lives in the document; whether there is any
// to remove comes back from `queryCommandState('Outdent')`.
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
