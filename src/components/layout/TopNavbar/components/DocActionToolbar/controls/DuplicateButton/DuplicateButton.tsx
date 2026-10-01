import { Copy } from 'lucide-react';
import { DOC_ACTION_TOOLBAR_IDS } from '../../DocActionToolbar.testids';
import { IconAction } from '../controls.shared.styles';

interface DuplicateButtonProps {
  onClick: () => void;
}

export const DuplicateButton = ({ onClick }: DuplicateButtonProps) => (
  <IconAction
    type="button"
    title="שכפול"
    aria-label="שכפול"
    data-testid={DOC_ACTION_TOOLBAR_IDS.duplicate}
    onClick={onClick}
  >
    <Copy size={16} />
  </IconAction>
);
