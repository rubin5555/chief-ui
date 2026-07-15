import { Copy } from 'lucide-react';
import { IconAction } from '../DocActionToolbar.styles';
import { DOC_ACTION_TOOLBAR_IDS } from '../DocActionToolbar.testids';

interface DuplicateButtonProps {
  onClick: () => void;
}

export const DuplicateButton = ({ onClick }: DuplicateButtonProps) => (
  <IconAction
    type="button"
    title="שכפול"
    data-testid={DOC_ACTION_TOOLBAR_IDS.duplicate}
    onClick={onClick}
  >
    <Copy size={16} />
  </IconAction>
);
