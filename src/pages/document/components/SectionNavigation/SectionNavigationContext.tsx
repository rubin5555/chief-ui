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
  /**
   * The node the reader is currently on, as the paper reports it. The outline
   * marks this row so the column always says where you are.
   */
  activeNodeId: string | null;
  setActiveNodeId: (id: string | null) => void;
  /**
   * A node the outline has asked to be taken to, until the paper has taken you
   * there. Cleared by the paper rather than by a timer: it is a request with a
   * completion, not a state with a duration.
   */
  pendingRevealId: string | null;
  revealNode: (id: string) => void;
  clearPendingReveal: () => void;
  /** The node to mark for a moment, so it is obvious which one you landed on. */
  revealedNodeId: string | null;
}

const SectionNavigationContext = createContext<SectionNavigation | null>(null);

/**
 * Moving between the outline and the paper, in both directions: the column sends
 * you to a section, and the sheet says which section you are in.
 *
 * A provider because the two ends are in different subtrees — the outline is in
 * the sidebar, the sections are three levels inside the paper — and neither is
 * an ancestor of the other. DocumentCanvas is, which is where this is mounted,
 * the same span and the same reasoning as SignatureGateProvider above it.
 *
 * It holds no idea of *how* to scroll. Where a node sits is a question only the
 * paper can answer, since it virtualizes its topics and half of them aren't
 * rendered; this only carries the request across.
 */
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

  // The mark goes up here rather than when the scroll lands, so asking for a
  // section that is already on screen still says so — there is no journey to
  // watch in that case, and nothing else would tell you the click registered.
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

/**
 * Null outside the provider rather than throwing: the outline rows and the
 * section blocks are both rendered by the parity gallery too, which has no
 * document canvas around it and nowhere to scroll.
 */
export const useSectionNavigation = () => useContext(SectionNavigationContext);
