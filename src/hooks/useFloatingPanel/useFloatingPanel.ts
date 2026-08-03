import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { getFocusable } from '@/utils/focusable';
import { isOnLayerAbove } from '@/utils/layerStack';
import type { Pos, PosSpec } from './floatingPosition';
import { computeFloatingPos, estimatePos, measurePanel, samePos } from './floatingPosition';

export interface FloatingPanelOptions {
  focusOnOpen?: boolean;
  // Shuts the panel the moment this turns true, for a panel that cannot
  // outlive what it acts on. The ribbon's are the case: the editor they format
  // is gone the instant the section deactivates, and a palette left hanging
  // over the document applies its colours to nothing.
  closeWhen?: boolean;
}

export const useFloatingPanel = <TTrigger extends HTMLElement = HTMLButtonElement>({
  focusOnOpen = false,
  closeWhen = false,
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
      const panel = panelRef.current;
      const trigger = btnRef.current;
      if (!panel || !trigger) return;

      // A click belongs to this panel when it lands on it, on its trigger, or
      // on anything the panel itself opened — a date picker inside a filter
      // panel portals out to `body`, so containment alone would read picking a
      // date as a click away and close the panel the picker was living in.
      const target = e.target as Node;
      const owned =
        panel.contains(target) || trigger.contains(target) || isOnLayerAbove(panel, target);
      if (!owned) setOpen(false);
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

  useEffect(() => {
    if (!closeWhen) return;
    // No refocus: whatever took the trigger's reason to exist has the focus
    // now, and pulling it back onto a button that just went dead would be a
    // second thing going wrong rather than a recovery.
    suppressRefocusRef.current = true;
    setOpen(false);
  }, [closeWhen]);

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
      const panel = panelRef.current;
      const target = e.target as Node;
      if (panel && (panel.contains(target) || isOnLayerAbove(panel, target))) return;
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

    const next = computeFloatingPos(
      trigger.getBoundingClientRect(),
      specRef.current,
      measurePanel(panel),
    );
    setPos((prev) => (samePos(prev, next) ? prev : next));
  });

  const toggle = (spec: PosSpec) => {
    if (!open && btnRef.current) {
      specRef.current = spec;
      setPos(estimatePos(btnRef.current.getBoundingClientRect(), spec));
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
