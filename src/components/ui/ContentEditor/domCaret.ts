// caretRangeFromPoint is Chromium/WebKit-only and caretPositionFromPoint is its Firefox
// counterpart — neither is guaranteed at runtime, so both are feature-detected.
export const caretRangeAtPoint = (x: number, y: number): Range | null => {
  if (typeof document.caretRangeFromPoint === 'function') {
    return document.caretRangeFromPoint(x, y);
  }
  if (typeof document.caretPositionFromPoint === 'function') {
    const pos = document.caretPositionFromPoint(x, y);
    if (!pos) return null;
    const range = document.createRange();
    range.setStart(pos.offsetNode, pos.offset);
    range.collapse(true);
    return range;
  }
  return null;
};

// Prefers a paint frame (TinyMCE re-normalises its body on init/focus, and running after
// the next frame reliably lands past that), but rAF starves when the window isn't being
// painted (hidden/occluded tab) — the timeout keeps the callback from being lost there.
const AFTER_FRAME_FALLBACK_MS = 50;

export const runAfterFrame = (callback: () => void) => {
  let hasRun = false;
  const runOnce = () => {
    if (hasRun) return;
    hasRun = true;
    callback();
  };
  requestAnimationFrame(runOnce);
  setTimeout(runOnce, AFTER_FRAME_FALLBACK_MS);
};
