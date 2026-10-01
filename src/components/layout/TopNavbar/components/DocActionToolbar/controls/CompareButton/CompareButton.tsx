import { GitCompare } from 'lucide-react';
import { DOC_ACTION_TOOLBAR_IDS } from '../../DocActionToolbar.testids';
import { IconAction } from '../controls.shared.styles';

interface CompareButtonProps {
  onClick: () => void;
}

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
