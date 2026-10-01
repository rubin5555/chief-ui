import type { ReactNode } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { REVEAL_FLASH_MS } from './SectionNavigation.constants';

export interface SectionNavigation {
  activeNodeId: string | null;
  setActiveNodeId: (id: string | null) => void;
  pendingRevealId: string | null;
  revealNode: (id: string) => void;
  clearPendingReveal: () => void;
  revealedNodeId: string | null;
}

const SectionNavigationContext = createContext<SectionNavigation | null>(null);

export const SectionNavigationProvider = ({ children }: { children: ReactNode }) => {
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [pendingRevealId, setPendingRevealId] = useState<string | null>(null);
  const [revealedNodeId, setRevealedNodeId] = useState<string | null>(null);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    },
    [],
  );

  const revealNode = useCallback((id: string) => {
    setPendingRevealId(id);
    setRevealedNodeId(id);
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    flashTimerRef.current = setTimeout(() => setRevealedNodeId(null), REVEAL_FLASH_MS);
  }, []);

  const clearPendingReveal = useCallback(() => setPendingRevealId(null), []);

  const value = useMemo<SectionNavigation>(
    () => ({
      activeNodeId,
      setActiveNodeId,
      pendingRevealId,
      revealNode,
      clearPendingReveal,
      revealedNodeId,
    }),
    [activeNodeId, pendingRevealId, revealNode, clearPendingReveal, revealedNodeId],
  );

  return (
    <SectionNavigationContext.Provider value={value}>{children}</SectionNavigationContext.Provider>
  );
};

export const useSectionNavigation = () => useContext(SectionNavigationContext);
