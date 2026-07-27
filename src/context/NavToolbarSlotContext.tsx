import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';
import { createPortal } from 'react-dom';

// The navbar's per-page toolbar slot. main hangs a page's action icons off the end
// of the navbar's leading group — brand, reality mode, then whatever the current
// page contributes (TopNavbar.tsx:1250, gated on `showDocActions`).
//
// A portal slot rather than a `toolbar` prop on AppLayout, because those buttons
// open modals whose state belongs to the page: a prop would force AppLayout to
// hold onEditDocClick/onPermissionsClick/… for every page that ever grows a
// toolbar — the wall-of-handlers-in-the-ancestor smell. A callback context would
// be worse, rendering those modals in the navbar's subtree while their state
// lived in the page, which .claude/skills/modal-placement.md rules out outright.
//
// Same shape as SearchSlotContext, which already does this for MailingListModal's
// tabs — they render their own search field into the panel's fixed header row.
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
