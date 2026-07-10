import { useEffect, useRef, useState } from 'react';

// panelWidth: pass a number to use the standard right-anchor formula (left = r.left + r.width - panelWidth)
// or pass a function for a custom position calculation
type PosSpec = number | ((r: DOMRect) => { top: number; left: number });

export interface Pos {
  top?: number;
  bottom?: number;
  left: number;
  maxHeight: number;
}

const EDGE_MARGIN = 8;
const GAP = 6;
const MAX_PANEL_HEIGHT = 320;
const MIN_PANEL_HEIGHT = 120;

const computePos = (r: DOMRect, spec: PosSpec): Pos => {
  const raw =
    typeof spec === 'function' ? spec(r) : { top: r.bottom + GAP, left: r.left + r.width - spec };
  const maxLeft = window.innerWidth - (typeof spec === 'number' ? spec : 0) - EDGE_MARGIN;
  const left = Math.min(Math.max(raw.left, EDGE_MARGIN), Math.max(maxLeft, EDGE_MARGIN));

  const spaceBelow = window.innerHeight - r.bottom - GAP - EDGE_MARGIN;
  const spaceAbove = r.top - GAP - EDGE_MARGIN;

  // flip upward when there isn't enough room below but there's more room above — otherwise the
  // panel renders past the viewport bottom with no way to reach its lower options
  if (spaceBelow < MIN_PANEL_HEIGHT && spaceAbove > spaceBelow) {
    return {
      bottom: window.innerHeight - r.top + GAP,
      left,
      maxHeight: Math.min(MAX_PANEL_HEIGHT, spaceAbove),
    };
  }
  return {
    top: raw.top,
    left,
    maxHeight: Math.min(MAX_PANEL_HEIGHT, Math.max(spaceBelow, MIN_PANEL_HEIGHT)),
  };
};

export const useFloatingPanel = <TTrigger extends HTMLElement = HTMLButtonElement>() => {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<Pos | null>(null);
  const btnRef = useRef<TTrigger>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);
  const suppressRefocusRef = useRef(false);

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      )
        setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  useEffect(() => {
    if (wasOpenRef.current && !open) {
      if (!suppressRefocusRef.current) btnRef.current?.focus();
      suppressRefocusRef.current = false;
    }
    wasOpenRef.current = open;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    // scrolling the trigger out from under a fixed-position panel leaves it floating detached,
    // so close immediately on any scroll that isn't inside the panel itself (e.g. its own
    // options list). No debounce and no refocus — both caused a visible delay/jump in testing.
    const onScroll = (e: Event) => {
      if (panelRef.current?.contains(e.target as Node)) return;
      suppressRefocusRef.current = true;
      setOpen(false);
    };
    const onResize = () => {
      suppressRefocusRef.current = true;
      setOpen(false);
    };
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  const toggle = (spec: PosSpec) => {
    if (!open && btnRef.current) {
      setPos(computePos(btnRef.current.getBoundingClientRect(), spec));
    }
    setOpen((o) => !o);
  };

  const close = () => setOpen(false);

  return { open, pos, btnRef, panelRef, toggle, close } as const;
};
