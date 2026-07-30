import { FileEdit } from 'lucide-react';
import { DOC_ACTION_TOOLBAR_IDS } from '../../DocActionToolbar.testids';
import { IconAction } from '../controls.shared.styles';

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
