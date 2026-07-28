// Geometry of main's Edit.tsx document canvas, extracted once so the styled
// components share one source instead of each restating a magic `210mm`.
//
// These are millimetre page measurements on purpose: main renders a real A4
// sheet, and the browser resolves mm against physical print units, so the paper
// is the same size on screen as it is on paper. Do not "simplify" them to px.
//
// Colours are not here — they live in `docColors`/`docStatusColors`
// (src/styles/theme.ts) so dark mode can override them. These values are
// theme-independent, which is exactly why they are a plain constants module.

/** A4 portrait width — the paper, the sticky toolbar above it, and nothing else. */
export const PAPER_WIDTH = '210mm';

/** A4 portrait height. Also the page-break gradient's repeat interval. */
export const PAPER_MIN_HEIGHT = '297mm';

/** main's `padding: '16mm 20mm 20mm 20mm'` — the printable margin inside the sheet. */
export const PAPER_PADDING = '16mm 20mm 20mm 20mm';

/**
 * The metadata pill / source notice / comparison bar are 1cm wider than the
 * paper on each side, so they read as chrome around the document rather than
 * part of it.
 */
export const BAR_WIDTH = '230mm';

/**
 * main's `w-64` outline sidebar. Doubles as the bars' physical `padding-right`:
 * the bars span the full viewport, so offsetting them by the sidebar's width
 * is what optically centres them over the paper. Reproduce it — a plain
 * `justify-content: center` would sit them 128px off to the side.
 */
export const SIDEBAR_WIDTH = 256;

/** Lifts the sheet off the canvas gradient. Deliberately softer than shadows.md. */
export const PAPER_SHADOW = '0 1px 4px rgba(0,0,0,0.18)';

/** Hairline dashed rule marking each A4 page boundary, drawn at 297mm intervals. */
export const PAGE_BREAK_LINE_WIDTH = '1.5px';

/**
 * Zoom bounds, and the single source for them: the route schema validates `?zoom=`
 * against these and DocumentActionsSlot clamps to them before writing. The navbar's
 * ZoomControl deliberately doesn't know them — it knows only its own step size — so
 * there is no second copy to fall out of sync with what the URL will accept.
 */
export const ZOOM_MIN = 50;
export const ZOOM_MAX = 200;
export const ZOOM_DEFAULT = 100;
