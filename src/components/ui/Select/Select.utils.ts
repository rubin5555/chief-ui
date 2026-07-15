export interface DropPos {
  top?: number;
  bottom?: number;
  left: number;
  width: number;
  maxHeight: number;
}

const EDGE_MARGIN = 8;
const GAP = 4;
const MAX_DROPDOWN_HEIGHT = 240;
const MIN_DROPDOWN_HEIGHT = 120;

export const computeDropPos = (rect: DOMRect): DropPos => {
  const spaceBelow = window.innerHeight - rect.bottom - GAP - EDGE_MARGIN;
  const spaceAbove = rect.top - GAP - EDGE_MARGIN;

  // flip upward when there isn't enough room below but there's more room above — otherwise the
  // dropdown renders past the viewport bottom with no way to reach its lower options
  if (spaceBelow < MIN_DROPDOWN_HEIGHT && spaceAbove > spaceBelow) {
    return {
      bottom: window.innerHeight - rect.top + GAP,
      left: rect.left,
      width: rect.width,
      maxHeight: Math.min(MAX_DROPDOWN_HEIGHT, spaceAbove),
    };
  }
  return {
    top: rect.bottom + GAP,
    left: rect.left,
    width: rect.width,
    maxHeight: Math.min(MAX_DROPDOWN_HEIGHT, Math.max(spaceBelow, MIN_DROPDOWN_HEIGHT)),
  };
};
