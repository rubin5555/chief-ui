import type { MouseEvent, ReactNode } from 'react';
import { ActionButton, RowActions, RowLabel, RowRoot, RowText } from './ItemRow.styles';
import { ITEM_ROW_IDS } from './ItemRow.testids';

export interface RowAction {
  icon: ReactNode;
  label: string;
  onClick: (e: MouseEvent) => void;
  danger?: boolean;
  accent?: boolean;
}

interface ItemRowProps {
  label: string;
  leadingSlot?: ReactNode;
  actions: RowAction[];
  onClick?: () => void;
}

export const ItemRow = ({ label, leadingSlot, actions, onClick }: ItemRowProps) => {
  const handleActionClick = (action: RowAction) => (e: MouseEvent) => {
    e.stopPropagation();
    action.onClick(e);
  };

  return (
    <RowRoot data-testid={ITEM_ROW_IDS.root} onClick={onClick} $clickable={!!onClick}>
      <RowLabel>
        {leadingSlot}
        <RowText>{label}</RowText>
      </RowLabel>
      <RowActions>
        {actions.map((action) => (
          <ActionButton
            key={action.label}
            data-testid={ITEM_ROW_IDS.action(action.label)}
            title={action.label}
            $danger={action.danger}
            $accent={action.accent}
            onClick={handleActionClick(action)}
          >
            {action.icon}
          </ActionButton>
        ))}
      </RowActions>
    </RowRoot>
  );
};
