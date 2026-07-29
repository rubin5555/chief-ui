/**
 * How far each level is inset from the one above (main's inline `paddingRight`
 * values, Edit.tsx:3956 and 4012).
 *
 * Here rather than in either level's styles because both levels need both numbers:
 * a row is indented by its own, and the "+ add" link beneath a list has to line up
 * with the rows it adds to, which are one level further in.
 */
export const SECTION_LIST_INDENT = 30;
export const SUB_SECTION_INDENT = 28;

/** A one-line row plus its 4px of breathing room, until the row is measured. */
export const ESTIMATED_ROW_HEIGHT = 32;

/** A few rows either side of the column, so a flick of the wheel lands on content. */
export const ROW_OVERSCAN = 6;
