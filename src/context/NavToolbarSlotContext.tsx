import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';
import { createPortal } from 'react-dom';

const NavToolbarSlotContext = createContext<HTMLDivElement | null>(null);

export const NavToolbarSlotProvider = NavToolbarSlotContext.Provider;

interface NavToolbarSlotProps {
  children: ReactNode;
}

export const NavToolbarSlot = ({ children }: NavToolbarSlotProps) => {
  const node = useContext(NavToolbarSlotContext);
  if (!node) return null;
  return createPortal(children, node);
};
