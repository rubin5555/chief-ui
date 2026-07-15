import { UserCog } from 'lucide-react';
import { IconAction } from '../DocActionToolbar.styles';
import { DOC_ACTION_TOOLBAR_IDS } from '../DocActionToolbar.testids';

interface PermissionsButtonProps {
  onClick: () => void;
}

export const PermissionsButton = ({ onClick }: PermissionsButtonProps) => (
  <IconAction
    type="button"
    title="הרשאות"
    data-testid={DOC_ACTION_TOOLBAR_IDS.permissions}
    onClick={onClick}
  >
    <UserCog size={16} />
  </IconAction>
);
