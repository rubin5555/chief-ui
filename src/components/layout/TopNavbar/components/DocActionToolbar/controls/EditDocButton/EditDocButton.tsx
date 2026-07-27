import { FileEdit } from 'lucide-react';
import { IconAction } from '../../DocActionToolbar.styles';
import { DOC_ACTION_TOOLBAR_IDS } from '../../DocActionToolbar.testids';

interface EditDocButtonProps {
  onClick: () => void;
}

export const EditDocButton = ({ onClick }: EditDocButtonProps) => (
  <IconAction
    type="button"
    title="עריכת פרטי מסמך"
    aria-label="עריכת פרטי מסמך"
    data-testid={DOC_ACTION_TOOLBAR_IDS.editDoc}
    onClick={onClick}
  >
    <FileEdit size={16} />
  </IconAction>
);
