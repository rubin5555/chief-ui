import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { getFocusable } from '@/utils/focusable';

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

/**
 * Where a panel of `contentHeight` should sit relative to its trigger.
 *
 * Below the trigger is the default. It flips above only when the panel does not
 * fit below — not when the space merely looks tight — because a menu that fits
 * has no reason to move, and one that doesn't is unreachable where it is.
 *
 * When it fits on neither side (a viewport shorter than the menu), it takes the
 * roomier side and scrolls inside it. Nothing is ever placed past an edge and
 * left there: FloatingPanel clips to its own box, so overflowing the viewport
 * doesn't hide the panel, it silently amputates its lower half.
 */
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
  /**
   * Move focus into the panel when it opens, and keep Tab inside it until it
   * closes. For a *menu* — a button that opens a list of things to do next.
   *
   * Off by default, and deliberately not the default: a panel is portalled to
   * the body, so it is no longer next to its trigger in the DOM and Tab would
   * otherwise walk straight past it. But the same is not true of a combobox,
   * where the trigger is the field you are typing in (`Select` keeps focus on
   * its trigger and moves an `aria-activedescendant` instead) or where the panel
   * focuses its own search box. Taking focus there would break typing.
   */
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
    // Escape belongs to the panel, not to whatever is behind it: a menu open over
    // a dialog is the innermost thing on screen, and closing the dialog out from
    // under it is not what the key was pressed for. Capture phase plus
    // stopPropagation is how it wins — ui/Modal listens on `document` too, and it
    // was mounted (and so registered) first, so a bubble-phase listener here would
    // always run second, after the dialog had already gone. Registered only while
    // open, so a closed panel never swallows anyone else's Escape.
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setOpen(false);
        return;
      }
      // Tab wraps within the panel rather than leaving it. Only while focus is
      // actually inside — a panel left open behind a click elsewhere has no
      // claim on the key. Closing returns focus to the trigger on its own, so
      // there is no way to be stuck in here.
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

  // Focus the first thing in the panel once it is on screen. The panel mounts in
  // the same commit that sets `open`, so by the time this runs the ref is live;
  // it is a passive effect rather than a layout one because the placement pass
  // below still has to correct where the panel sits, and focusing can scroll.
  useEffect(() => {
    if (!open || !focusOnOpen) return;
    const panel = panelRef.current;
    if (!panel) return;
    const [first] = getFocusable(panel);
    (first ?? panel).focus();
  }, [open, focusOnOpen]);

  // The first placement is a guess: the panel doesn't exist yet, so there is no
  // height to fit. This corrects it against the real one before the browser
  // paints, and keeps correcting it as the panel's content changes — a menu that
  // swaps to a taller view (SectionMenu's permissions) has to be re-placed, or it
  // grows straight through the bottom of the window.
  //
  // Deliberately no dependency array: the trigger can move and the content can
  // change without either being state this hook can watch. `samePos` is what stops
  // that being a loop — a placement that agrees with the current one sets nothing.
  useLayoutEffect(() => {
    const panel = panelRef.current;
    const trigger = btnRef.current;
    if (!open || !panel || !trigger) return;

    // Measured with the cap lifted, because the number we need is how tall the
    // panel *wants* to be. Reading it while capped measures the cap instead: a
    // panel whose content stretches (a chat list, anything on `flex: 1`) reports
    // back the height we just gave it, minus its own border — so every pass would
    // hand the next one a slightly smaller number and the placement would never
    // settle. Restored in the same layout pass, so this never reaches the screen.
    const capped = panel.style.maxHeight;
    panel.style.maxHeight = 'none';
    const natural = panel.scrollHeight;
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

  // Closing after an action that puts focus somewhere else itself — a rename field
  // that opens where the row was, a menu item that creates a node and focuses it.
  // The refocus above would blur that field in the same commit it appeared, and a
  // field that commits on blur would be gone again before anyone saw it.
  const closeWithoutRefocus = () => {
    suppressRefocusRef.current = true;
    setOpen(false);
  };

  return { open, pos, btnRef, panelRef, toggle, close, closeWithoutRefocus } as const;
};
