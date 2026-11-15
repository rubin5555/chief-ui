// Where a panel sits once it has been fitted to the viewport. The shape is a
// style object on purpose — every consumer hands it straight to `style`.
export interface Pos {
  top?: number;
  bottom?: number;
  left: number;
  maxHeight: number;
}

export interface PanelSize {
  width: number;
  height: number;
}

// How a panel lines up with its trigger *before* the viewport gets a say. A
// number means "hang the panel's far edge off the trigger's", which is what a
// fixed-width menu wants; a function is for anything else — most often
// `left: r.left`, the mock's `left-0`.
export type PosSpec = number | ((r: DOMRect) => { top: number; left: number });

const EDGE_MARGIN = 8;

export const TRIGGER_GAP = 6;

// The height a panel is assumed to have for the one render before it can be
// measured. Nothing is painted with it: the measuring pass runs in a layout
// effect, so the corrected position lands in the same frame.
export const ESTIMATED_PANEL_HEIGHT = 320;

/**
 * Fit a panel against its trigger and the viewport.
 *
 * A panel keeps its natural height wherever it fits — it only gives ground when
 * neither side of the trigger can hold it, and then it takes the roomier side
 * and scrolls inside what is left. Nothing here caps a panel that would
 * otherwise fit on screen.
 */
export const computeFloatingPos = (r: DOMRect, spec: PosSpec, panel: PanelSize): Pos => {
  const raw =
    typeof spec === 'function'
      ? spec(r)
      : { top: r.bottom + TRIGGER_GAP, left: r.left + r.width - spec };

  // Clamped against the panel's real width, so one opened near either edge
  // slides back into view instead of hanging off it.
  const maxLeft = window.innerWidth - panel.width - EDGE_MARGIN;
  const left = Math.min(Math.max(raw.left, EDGE_MARGIN), Math.max(maxLeft, EDGE_MARGIN));

  const spaceBelow = window.innerHeight - raw.top - EDGE_MARGIN;
  const spaceAbove = r.top - TRIGGER_GAP - EDGE_MARGIN;
  const above: Pos = {
    bottom: window.innerHeight - r.top + TRIGGER_GAP,
    left,
    maxHeight: panel.height,
  };

  if (panel.height <= spaceBelow) return { top: raw.top, left, maxHeight: panel.height };
  if (panel.height <= spaceAbove) return above;
  return spaceAbove > spaceBelow
    ? { ...above, maxHeight: spaceAbove }
    : { top: raw.top, left, maxHeight: spaceBelow };
};

/**
 * A panel's natural size, measured with its height cap lifted — otherwise the
 * cap from the previous pass answers the question it is supposed to depend on,
 * and the panel can never grow back.
 */
export const measurePanel = (panel: HTMLElement): PanelSize => {
  const capped = panel.style.maxHeight;
  panel.style.maxHeight = 'none';
  const borders = panel.offsetHeight - panel.clientHeight;
  const size = { width: panel.offsetWidth, height: panel.scrollHeight + borders };
  panel.style.maxHeight = capped;
  return size;
};

export const samePos = (a: Pos | null, b: Pos) =>
  a?.top === b.top && a?.bottom === b.bottom && a?.left === b.left && a?.maxHeight === b.maxHeight;

// The position a panel opens at before it has been measured. `spec` already
// carries the width when it is a number; a function spec has none to offer, so
// horizontal clamping waits for the measuring pass.
export const estimatePos = (r: DOMRect, spec: PosSpec): Pos =>
  computeFloatingPos(r, spec, {
    width: typeof spec === 'number' ? spec : 0,
    height: ESTIMATED_PANEL_HEIGHT,
  });
