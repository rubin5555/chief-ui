import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

export interface SectionChatCoordination {
  openSectionId: string | null;
  openChat: (sectionId: string) => void;
  toggleChat: (sectionId: string) => void;
  closeChat: () => void;
  isMarking: boolean;
  setMarking: (marking: boolean) => void;
}

const SectionChatContext = createContext<SectionChatCoordination | null>(null);

export interface SectionChatProviderProps {
  children: ReactNode;
}

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
