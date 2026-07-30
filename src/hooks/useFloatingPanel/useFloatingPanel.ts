import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { getFocusable } from '@/utils/focusable';

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

const computePos = (r: DOMRect, spec: PosSpec, contentHeight: number): Pos => {
  const raw =
    typeof spec === 'function' ? spec(r) : { top: r.bottom + GAP, left: r.left + r.width - spec };
  const maxLeft = window.innerWidth - (typeof spec === 'number' ? spec : 0) - EDGE_MARGIN;
  const left = Math.min(Math.max(raw.left, EDGE_MARGIN), Math.max(maxLeft, EDGE_MARGIN));

  const spaceBelow = window.innerHeight - raw.top - EDGE_MARGIN;
  const spaceAbove = r.top - GAP - EDGE_MARGIN;
  const wanted = Math.min(contentHeight, MAX_PANEL_HEIGHT);
  const above: Pos = { bottom: window.innerHeight - r.top + GAP, left, maxHeight: wanted };

  if (wanted <= spaceBelow) return { top: raw.top, left, maxHeight: wanted };
  if (wanted <= spaceAbove) return above;
  return spaceAbove > spaceBelow
    ? { ...above, maxHeight: spaceAbove }
    : { top: raw.top, left, maxHeight: spaceBelow };
};

const samePos = (a: Pos | null, b: Pos) =>
  a?.top === b.top && a?.bottom === b.bottom && a?.left === b.left && a?.maxHeight === b.maxHeight;

export interface FloatingPanelOptions {
  focusOnOpen?: boolean;
}

export const useFloatingPanel = <TTrigger extends HTMLElement = HTMLButtonElement>({
  focusOnOpen = false,
}: FloatingPanelOptions = {}) => {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<Pos | null>(null);
  const btnRef = useRef<TTrigger>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);
  const suppressRefocusRef = useRef(false);
  const specRef = useRef<PosSpec>(0);

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
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
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

    const onScroll = (e: Event) => {
      if (panelRef.current?.contains(e.target as Node)) return;
      suppressRefocusRef.current = true;
      setOpen(false);
    };
    const onResize = () => {
      suppressRefocusRef.current = true;
      setOpen(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setOpen(false);
        return;
      }

      const panel = panelRef.current;
      if (e.key !== 'Tab' || !focusOnOpen || !panel?.contains(document.activeElement)) return;
      const items = getFocusable(panel);
      if (items.length === 0) return;
      const edge = e.shiftKey ? items[0] : items[items.length - 1];
      if (document.activeElement !== edge) return;
      e.preventDefault();
      (e.shiftKey ? items[items.length - 1] : items[0]).focus();
    };
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);
    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('keydown', onKeyDown, true);
    };
  }, [open, focusOnOpen]);

  useEffect(() => {
    if (!open || !focusOnOpen) return;
    const panel = panelRef.current;
    if (!panel) return;
    const [first] = getFocusable(panel);
    (first ?? panel).focus();
  }, [open, focusOnOpen]);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    const trigger = btnRef.current;
    if (!open || !panel || !trigger) return;

    const capped = panel.style.maxHeight;
    panel.style.maxHeight = 'none';
    const borders = panel.offsetHeight - panel.clientHeight;
    const natural = panel.scrollHeight + borders;
    panel.style.maxHeight = capped;

    const next = computePos(trigger.getBoundingClientRect(), specRef.current, natural);
    setPos((prev) => (samePos(prev, next) ? prev : next));
  });

  const toggle = (spec: PosSpec) => {
    if (!open && btnRef.current) {
      specRef.current = spec;
      setPos(computePos(btnRef.current.getBoundingClientRect(), spec, MAX_PANEL_HEIGHT));
    }
    setOpen((o) => !o);
  };

  const close = () => setOpen(false);

  const closeWithoutRefocus = () => {
    suppressRefocusRef.current = true;
    setOpen(false);
  };

  return { open, pos, btnRef, panelRef, toggle, close, closeWithoutRefocus } as const;
};
