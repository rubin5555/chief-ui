import { UserCog } from 'lucide-react';
import { DOC_ACTION_TOOLBAR_IDS } from '../../DocActionToolbar.testids';
import { IconAction } from '../controls.shared.styles';

interface PermissionsButtonProps {
  onClick: () => void;
}

export const PermissionsButton = ({ onClick }: PermissionsButtonProps) => (
  <IconAction
    type="button"
    title="הרשאות"
    aria-label="הרשאות"
    data-testid={DOC_ACTION_TOOLBAR_IDS.permissions}
    onClick={onClick}
  >
    <UserCog size={16} />
  </IconAction>
);
