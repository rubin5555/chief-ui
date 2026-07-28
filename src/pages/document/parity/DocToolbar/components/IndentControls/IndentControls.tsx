import { Indent, Outdent } from 'lucide-react';
import { useState } from 'react';
import { TOOLBAR_ICON_SIZE } from '../../DocToolbar.constants';
import { DOC_TOOLBAR_IDS } from '../../DocToolbar.testids';
import { ToolbarButton } from '../ToolbarButton';

// The indent depth is a count, not a flag, so it can't live in the toolbar's set
// of active formats — and nothing outside these two buttons reads it, which is
// why it stays here (main keeps it in the ribbon's own state too, Edit.tsx:1123).
export const IndentControls = () => {
  const [level, setLevel] = useState(0);

  const handleDecrease = () => setLevel((current) => Math.max(0, current - 1));
  const handleIncrease = () => setLevel((current) => current + 1);

  return (
    <>
      <ToolbarButton
        title="הקטן הזחה"
        disabled={level === 0}
        onClick={handleDecrease}
        data-testid={DOC_TOOLBAR_IDS.indentDecrease}
      >
        <Indent size={TOOLBAR_ICON_SIZE} aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        title="הגדל הזחה"
        onClick={handleIncrease}
        data-testid={DOC_TOOLBAR_IDS.indentIncrease}
      >
        <Outdent size={TOOLBAR_ICON_SIZE} aria-hidden="true" />
      </ToolbarButton>
    </>
  );
};
