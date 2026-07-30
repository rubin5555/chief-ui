import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

export interface SectionChatCoordination {
  openSectionId: string | null;
  /** Opens a thread from outside its own trigger — main's `לתיקון` does this. */
  openChat: (sectionId: string) => void;
  toggleChat: (sectionId: string) => void;
  closeChat: () => void;
  /**
   * A passage is being marked in the sheet to quote in the open comment. The
   * paper reads this to stop turning clicks into edits for the duration.
   */
  isMarking: boolean;
  setMarking: (marking: boolean) => void;
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
 * It coordinates *which* chat is open, and whether one of them is currently
 * marking a passage — each SectionChat still owns its own thread, its draft and
 * its own rendering. So this is not the split-state arrangement
 * `.claude/skills/modal-placement.md` rules out: no state belonging to a panel
 * lives in a subtree that doesn't draw it.
 *
 * Marking is here rather than inside the bubble because it is not a fact about
 * the bubble: it changes what a click on the sheet *means*, everywhere at once,
 * and the sheet has no other way to be told. Only one chat can be open, so one
 * flag covers the page; opening or closing a thread ends any marking with it,
 * since a gesture aimed at a comment that is no longer on screen has no target.
 */
export const SectionChatProvider = ({ children }: SectionChatProviderProps) => {
  const [openSectionId, setOpenSectionId] = useState<string | null>(null);
  const [isMarking, setMarking] = useState(false);

  const openChat = useCallback((sectionId: string) => {
    setMarking(false);
    setOpenSectionId(sectionId);
  }, []);
  const toggleChat = useCallback((sectionId: string) => {
    setMarking(false);
    setOpenSectionId((prev) => (prev === sectionId ? null : sectionId));
  }, []);
  const closeChat = useCallback(() => {
    setMarking(false);
    setOpenSectionId(null);
  }, []);

  const value = useMemo(
    () => ({ openSectionId, openChat, toggleChat, closeChat, isMarking, setMarking }),
    [openSectionId, openChat, toggleChat, closeChat, isMarking],
  );

  return <SectionChatContext.Provider value={value}>{children}</SectionChatContext.Provider>;
};

export const useSectionChatCoordination = (): SectionChatCoordination => {
  const context = useContext(SectionChatContext);
  if (!context)
    throw new Error('useSectionChatCoordination must be used inside a SectionChatProvider');
  return context;
};
