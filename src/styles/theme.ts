export const colors = {
  primary: 'var(--color-primary)',
  primaryLight: 'var(--color-primary-light)',
  accent: 'var(--color-accent)',
  surface: 'var(--color-surface)',
  muted: 'var(--color-muted)',
  border: 'var(--color-border)',
  danger: 'var(--color-danger)',
  dangerLight: 'var(--color-danger-light)',
  warning: 'var(--color-warning)',
  warningLight: 'var(--color-warning-light)',
} as const;

// The Excel import source: the green its chip and import button carry, and the
// palette of the example spreadsheet drawn under them (main's
// TopNavbar.tsx:471-798). App-level rather than `docColors` because the people
// picker is shared — the mailing-list form shows the same tab.
export const excelColors = {
  green: 'var(--excel-green)',
  /** Column headers and the row-number gutter. */
  chromeBg: 'var(--excel-chrome-bg)',
  gridLine: 'var(--excel-grid-line)',
  /** Every other data row, so the grid reads as rows without needing a rule. */
  zebraBg: 'var(--excel-zebra-bg)',
  headerInk: 'var(--excel-header-ink)',
  gutterInk: 'var(--excel-gutter-ink)',
  cellInk: 'var(--excel-cell-ink)',
  activeCellBg: 'var(--excel-active-cell-bg)',
} as const;

// Document-page palette. Separate from `colors` because these are specific to
// the document editor's chrome rather than app-wide semantics — but resolved the
// same way (a CSS custom property, so dark mode needs no React re-render).
// Each entry exists because no `colors`/`gray` token matched main's Edit.tsx
// literal byte-for-byte; see src/pages/document/DESIGN_PARITY.md for the audit.
export const docColors = {
  canvasGradient: 'var(--doc-canvas-gradient)',
  neutralBar: 'var(--doc-neutral-bar)',
  pageBreakLine: 'var(--doc-page-break-line)',
  hairline: 'var(--doc-hairline)',
  surfaceSubtle: 'var(--doc-surface-subtle)',
  letterheadBg: 'var(--doc-letterhead-bg)',
  rowDivider: 'var(--doc-row-divider)',
  ink: 'var(--doc-ink)',
  inkInverse: 'var(--doc-ink-inverse)',
  placeholderInk: 'var(--doc-placeholder-ink)',
  primaryHover: 'var(--doc-primary-hover)',
  primaryLightBorder: 'var(--doc-primary-light-border)',
  amberInk: 'var(--doc-amber-ink)',
  amberIcon: 'var(--doc-amber-icon)',
  amberBorder: 'var(--doc-amber-border)',
  compareBg: 'var(--doc-compare-bg)',
  compareBorder: 'var(--doc-compare-border)',
  searchHit: 'var(--doc-search-hit)',
  // main's `bg-amber-400` progress fill (Edit.tsx:3831). Same light value as
  // searchHit, deliberately its own token: a filled bar and a text outline are
  // different roles and needn't stay the same amber once dark mode diverges.
  progressAmber: 'var(--doc-progress-amber)',
  warningStrong: 'var(--doc-warning-strong)',
  stampInk: 'var(--doc-stamp-ink)',
  chatOwnAccent: 'var(--doc-chat-own-accent)',
  chatArrowBorder: 'var(--doc-chat-arrow-border)',
  cellActiveBg: 'var(--doc-cell-active-bg)',
  cellActiveBorder: 'var(--doc-cell-active-border)',
  // The tint a hovered region takes while it is *being* chosen — the table-size
  // picker's grid, and the comparison bar's own background. Same light value as
  // `compareBg`/`compareBorder` today, kept separate for the same reason
  // `progressAmber` is separate from `searchHit`: a transient hover preview and a
  // persistent bar are different roles, and needn't move together later.
  selectionBg: 'var(--doc-selection-bg)',
  selectionBorder: 'var(--doc-selection-border)',
  // main's `hover:bg-white/70` on the sidebar's bordered buttons. Translucent
  // rather than solid because what shows through is the page's own gradient, so
  // the hover reads as a lift off the canvas instead of a white patch on it.
  translucentHover: 'var(--doc-translucent-hover)',
  // main's `hover:bg-gray-200/70` behind the outline tree's small round icon
  // buttons — gray[200]'s exact value at 70%, which lands lighter than gray[100]
  // and is why this isn't just that token.
  iconHover: 'var(--doc-icon-hover)',
  // main's `hover:bg-amber-100` — the same icon-button hover as `iconHover`, but
  // for buttons sitting on the amber emphasis card, where a grey wash would read
  // as a hole in the tint.
  amberHover: 'var(--doc-amber-hover)',
} as const;

// Status colours for the document page. Consumers index this instead of
// branching, so adding a status is a one-line change here plus a token.
export const docStatusColors = {
  approved: 'var(--doc-status-approved)',
  fix: 'var(--doc-status-fix)',
  idle: 'var(--doc-status-idle)',
  preparing: 'var(--doc-status-preparing)',
  inApproval: 'var(--doc-status-in-approval)',
  awaitingDistribution: 'var(--doc-status-awaiting-distribution)',
  importPreparing: 'var(--doc-status-import-preparing)',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgba(0,0,0,0.05)',
  md: '0 2px 12px rgba(0,0,0,0.05)',
  lg: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
  xl: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
  xxl: '0 25px 50px -12px rgba(0,0,0,0.25)',
  // Tighter and darker than `md`: a small floating chip needs a defined edge
  // rather than the soft ambient spread a card gets (main's status tooltip,
  // Edit.tsx:3817).
  tooltip: '0 2px 6px rgba(0,0,0,0.10)',
  // A navy-tinted lift for a filled primary button, rather than the neutral grey
  // of the scale above. main puts the same one on the sidebar's status-flow
  // button (Edit.tsx:3850) and on its round FAB buttons (4088), which is why it
  // lives here and not in either component's styles.
  primary: '0 2px 8px rgba(27,58,107,0.3)',
  // main's chat bubble (Edit.tsx:425). Deeper and tighter than `md` because the
  // bubble floats in the page's empty left margin with only the canvas gradient
  // behind it — at `md`'s spread it reads as a stain on the page rather than a
  // card above it.
  bubble: '0 4px 16px rgba(0,0,0,0.12)',
  // A hairline ring plus a shallow drop, for a card that sits *on* a surface
  // rather than floating above it — main's document-picker table (Edit.tsx:1911).
  // `md` carries no ring, so a white card on a white dialog loses its edge
  // entirely at this elevation.
  card: '0 1px 6px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
} as const;

export const radii = {
  // 4px — main's smallest corner, for a rounded rect that is a hover affordance
  // on inline text (an editable heading) rather than a container.
  sm: '4px',
  // 6px — main's `rounded-md`, for the small square controls (the filter panel's
  // own checkbox) that would read as circles at `lg`.
  md: '6px',
  lg: '8px',
  xl: '12px',
  '2xl': '16px',
  '3xl': '24px',
  full: '9999px',
} as const;

export const transitions = {
  fast: '0.1s ease',
  normal: '0.15s ease',
  slow: '0.2s ease',
} as const;

export const gray = {
  50: 'var(--gray-50)',
  100: 'var(--gray-100)',
  200: 'var(--gray-200)',
  300: 'var(--gray-300)',
  400: 'var(--gray-400)',
  500: 'var(--gray-500)',
  600: 'var(--gray-600)',
  700: 'var(--gray-700)',
  800: 'var(--gray-800)',
  900: 'var(--gray-900)',
} as const;
