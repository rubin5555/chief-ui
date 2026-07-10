import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';
import { createPortal } from 'react-dom';

const SearchSlotContext = createContext<HTMLDivElement | null>(null);

export const SearchSlotProvider = SearchSlotContext.Provider;

interface SearchSlotProps {
  children: ReactNode;
}

export const SearchSlot = ({ children }: SearchSlotProps) => {
  const node = useContext(SearchSlotContext);
  if (!node) return null;
  return createPortal(children, node);
};
