import type { ReactNode } from 'react';
import { ItemListCard, ItemListEmptyLabel, ItemListScroll } from './ItemList.styles';

interface ItemListProps {
  children: ReactNode;
}

export const ItemList = ({ children }: ItemListProps) => {
  return (
    <ItemListCard>
      <ItemListScroll>{children}</ItemListScroll>
    </ItemListCard>
  );
};

export const ItemListEmpty = ({ label }: { label: string }) => {
  return <ItemListEmptyLabel>{label}</ItemListEmptyLabel>;
};
