/**
 * How long a section stays marked after the outline sends you to it.
 *
 * Long enough to catch the eye after a smooth scroll has finished, short enough
 * that it is gone before it becomes part of how the section looks.
 */
export const REVEAL_FLASH_MS = 1600;

/**
 * How far below the top of the editor column the "you are here" line sits.
 *
 * The section the reader is reading is the last one to have started above this
 * line, not the topmost one still on screen — those differ for the whole time a
 * long section is scrolling past, which is exactly when the outline should be
 * pointing at it. Clears the sticky toolbar, which covers the first stretch of
 * the column.
 */
export const ACTIVE_LINE_OFFSET = 96;

/**
 * Where a section lands when the outline sends you to it, as `scroll-padding-top`
 * on the editor column.
 *
 * Deliberately a little *above* the line rather than on it. The two have to agree
 * — land a jumped-to section below the line and the outline would mark the
 * section before it, so clicking a row would highlight its neighbour — and
 * agreeing exactly would leave that on the right side of a rounding error. This
 * is the same clearance expressed once, with the margin on the side that can't
 * misread.
 */
export const REVEAL_SCROLL_PADDING = ACTIVE_LINE_OFFSET - 8;
