import { Filter } from 'lucide-react';
import { IconAction } from '../DocActionToolbar.styles';
import { DOC_ACTION_TOOLBAR_IDS } from '../DocActionToolbar.testids';

interface FilterButtonProps {
  onClick: () => void;
}

export const FilterButton = ({ onClick }: FilterButtonProps) => (
  <IconAction
    type="button"
    title="סינון"
    data-testid={DOC_ACTION_TOOLBAR_IDS.filter}
    onClick={onClick}
  >
    <Filter size={16} />
  </IconAction>
);
