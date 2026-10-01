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
