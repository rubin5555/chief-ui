// The grid is six 22px swatches, as main draws it. The panel's width has to be
// derived from that rather than picked: a fixed width narrower than the grid
// leaves every swatch overflowing its own `1fr` track, which is what put the
// palette half outside its own box.
export const SWATCH_SIZE = 22;
export const SWATCH_GAP = 6;
export const SWATCH_COLUMNS = 6;
export const MENU_PADDING_X = 12;

// `FloatingPanel` is border-box and draws a hairline on each side, so the two
// borders come out of the content width unless they are added back here.
const PANEL_BORDER = 2;

export const COLOR_MENU_WIDTH =
  SWATCH_COLUMNS * SWATCH_SIZE +
  (SWATCH_COLUMNS - 1) * SWATCH_GAP +
  MENU_PADDING_X * 2 +
  PANEL_BORDER;
