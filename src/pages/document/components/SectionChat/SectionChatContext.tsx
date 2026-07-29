import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

export interface SectionChatCoordination {
  openSectionId: string | null;
  /** Opens a thread from outside its own trigger — main's `לתיקון` does this. */
  openChat: (sectionId: string) => void;
  toggleChat: (sectionId: string) => void;
  closeChat: () => void;
}

const SectionChatContext = createContext<SectionChatCoordination | null>(null);

export interface SectionChatProviderProps {
  children: ReactNode;
}

/**
 * Which section's chat is open — at most one, ever.
 *
 * main keeps a single `openChat` for the whole page (Edit.tsx:3147), and that is
 * not an implementation detail: the bubble is pinned to the page's left margin
 * rather than hung under its trigger, so two open at once would sit exactly on
 * top of each other. Opening one has to close the rest, and only something above
 * all of them can do that.
 *
 * It coordinates *which* chat is open and nothing else — each SectionChat still
 * owns its own thread, its draft, its marker mode and its own rendering. So this
 * is not the split-state arrangement `.claude/skills/modal-placement.md` rules
 * out: no state belonging to a panel lives in a subtree that doesn't draw it.
 */
export const SectionChatProvider = ({ children }: SectionChatProviderProps) => {
  const [openSectionId, setOpenSectionId] = useState<string | null>(null);

  const openChat = useCallback((sectionId: string) => setOpenSectionId(sectionId), []);
  const toggleChat = useCallback(
    (sectionId: string) => setOpenSectionId((prev) => (prev === sectionId ? null : sectionId)),
    [],
  );
  const closeChat = useCallback(() => setOpenSectionId(null), []);

  const value = useMemo(
    () => ({ openSectionId, openChat, toggleChat, closeChat }),
    [openSectionId, openChat, toggleChat, closeChat],
  );

  return <SectionChatContext.Provider value={value}>{children}</SectionChatContext.Provider>;
};

export const useSectionChatCoordination = (): SectionChatCoordination => {
  const context = useContext(SectionChatContext);
  if (!context)
    throw new Error('useSectionChatCoordination must be used inside a SectionChatProvider');
  return context;
};
