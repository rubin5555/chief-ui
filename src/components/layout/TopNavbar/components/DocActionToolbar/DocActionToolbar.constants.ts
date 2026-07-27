/**
 * How much one press of −/+ moves the zoom. The bounds it gets clamped to are
 * *not* here: they belong to the page being zoomed, which is also what validates
 * them on the way into the URL — see ZOOM_MIN/ZOOM_MAX/ZOOM_DEFAULT in
 * src/pages/document/document.measurements.ts. Keeping a copy of them here is
 * how the button and the URL clamp end up disagreeing.
 */
export const ZOOM_STEP = 10;
export const EXPORT_SIMULATED_DELAY_MS = 2000;
export const SEARCH_DEBOUNCE_MS = 300;
