// The chat bubble's geometry (main's Edit.tsx:379-404). It is pinned to the
// page's left margin — the empty strip beside the paper on this RTL page — and
// only tracks its section vertically, so the document underneath stays clear
// while a comment is being written about it.

/** Distance from the viewport's left edge. */
export const BUBBLE_LEFT = 12;
export const BUBBLE_WIDTH = 240;
export const BUBBLE_MAX_HEIGHT = 300;

/**
 * How far the tail's point sits below the bubble's top edge: the 10px border
 * offset plus half the 20px triangle. The bubble is placed so this lands on the
 * middle of its trigger, which is what makes the tail point at the section.
 */
export const TAIL_CENTER = 19;
/** Smallest gap between the bubble's top and the viewport's, so it never clips. */
export const TAIL_MIN_TOP_GAP = 10;
/** Room kept below the bubble, so a section low on the page doesn't push it off. */
export const BUBBLE_BOTTOM_MARGIN = 20;

/**
 * How much of the trigger has to still be on screen for the bubble to be shown.
 * The top margin clears the sticky toolbar: a bubble pointing at a section that
 * has scrolled under it would be pointing at the toolbar.
 */
export const ANCHOR_TOP_MARGIN = 60;
export const ANCHOR_BOTTOM_MARGIN = 20;
