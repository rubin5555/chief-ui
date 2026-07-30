import { GitCompare } from 'lucide-react';
import { IconAction } from '../../DocActionToolbar.styles';
import { DOC_ACTION_TOOLBAR_IDS } from '../../DocActionToolbar.testids';

interface CompareButtonProps {
  onClick: () => void;
}

// Opens the version picker that starts a comparison. main puts this in the navbar
// beside the other document icons (TopNavbar.tsx:1275) rather than above the
// paper, which is where the bar it turns on appears.
export const CompareButton = ({ onClick }: CompareButtonProps) => (
  <IconAction
    type="button"
    title="השוואת גרסאות"
    aria-label="השוואת גרסאות"
    data-testid={DOC_ACTION_TOOLBAR_IDS.compare}
    onClick={onClick}
  >
    <GitCompare size={16} />
  </IconAction>
);
