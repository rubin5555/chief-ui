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

export const excelColors = {
  green: 'var(--excel-green)',

  chromeBg: 'var(--excel-chrome-bg)',
  gridLine: 'var(--excel-grid-line)',

  zebraBg: 'var(--excel-zebra-bg)',
  headerInk: 'var(--excel-header-ink)',
  gutterInk: 'var(--excel-gutter-ink)',
  cellInk: 'var(--excel-cell-ink)',
  activeCellBg: 'var(--excel-active-cell-bg)',
} as const;

// Chrome shared by every comfortable-density GridTable — the catalog's and the
// import modal's tables are the same table, so their header bar and row
// separator are one pair of tokens rather than one pair per page.
export const tableColors = {
  headerBar: 'var(--table-header-bar)',
  rowDivider: 'var(--table-row-divider)',
} as const;

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

  progressAmber: 'var(--doc-progress-amber)',
  warningStrong: 'var(--doc-warning-strong)',
  stampInk: 'var(--doc-stamp-ink)',
  chatOwnAccent: 'var(--doc-chat-own-accent)',
  chatArrowBorder: 'var(--doc-chat-arrow-border)',
  cellActiveBg: 'var(--doc-cell-active-bg)',
  cellActiveBorder: 'var(--doc-cell-active-border)',

  selectionBg: 'var(--doc-selection-bg)',
  selectionBorder: 'var(--doc-selection-border)',

  translucentHover: 'var(--doc-translucent-hover)',

  iconHover: 'var(--doc-icon-hover)',

  amberHover: 'var(--doc-amber-hover)',
} as const;

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

  tooltip: '0 2px 6px rgba(0,0,0,0.10)',

  primary: '0 2px 8px rgba(27,58,107,0.3)',

  bubble: '0 4px 16px rgba(0,0,0,0.12)',

  card: '0 1px 6px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
} as const;

export const radii = {
  sm: '4px',

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

export const catColors = {
  // main paints the same warm ramp behind the catalog as behind the document
  // (`Catalog.tsx:2364`), one stop shorter — the document's holds flat from 85%
  // and this one runs all the way to 100%. Kept as main wrote each.
  canvasGradient: 'var(--cat-canvas-gradient)',
  outlineBorder: 'var(--cat-outline-border)',
  primarySoftBorder: 'var(--cat-primary-soft-border)',
  selectedTileBg: 'var(--cat-selected-tile-bg)',
  invalidBorder: 'var(--cat-invalid-border)',
  // Tailwind's red-500, softer than `colors.danger` (#c4342b). main uses it for
  // both the trash countdown and the sidebar's delete menu item.
  dangerSoft: 'var(--cat-danger-soft)',
  dangerSoftBg: 'var(--cat-danger-soft-bg)',
  // The sidebar's rows hover to translucent white because what shows through is
  // the page gradient. Two strengths, as main draws them.
  hoverVeil: 'var(--cat-hover-veil)',
  hoverVeilStrong: 'var(--cat-hover-veil-strong)',
  dashedHoverBg: 'var(--cat-dashed-hover-bg)',
  childRowBg: 'var(--cat-child-row-bg)',
  childRowAccent: 'var(--cat-child-row-accent)',
  childRowDivider: 'var(--cat-child-row-divider)',
} as const;

// The catalog's ten status pills, keyed by the Hebrew status the API returns.
// Four inks are the same role as a document status and reuse that token rather
// than duplicating it; the rest, and every background, are the pills' own.
export const catStatusColors: Record<string, { bg: string; ink: string }> = {
  'טיוטה פנימית': { bg: gray[100], ink: gray[500] },
  בהכנה: { bg: 'var(--cat-status-preparing-bg)', ink: docStatusColors.importPreparing },
  'בסבב אישורים': {
    bg: 'var(--cat-status-in-approval-bg)',
    ink: 'var(--cat-status-in-approval-ink)',
  },
  נדחתה: { bg: 'var(--cat-status-rejected-bg)', ink: docStatusColors.fix },
  נדרסה: { bg: 'var(--cat-status-superseded-bg)', ink: 'var(--cat-status-superseded-ink)' },
  'ממתין להפצה': { bg: 'var(--cat-status-awaiting-bg)', ink: 'var(--cat-status-awaiting-ink)' },
  מבצעית: { bg: 'var(--cat-status-active-bg)', ink: docStatusColors.approved },
  נצורה: { bg: 'var(--cat-status-frozen-bg)', ink: colors.warning },
  הסתיימה: { bg: 'var(--cat-status-finished-bg)', ink: 'var(--cat-status-finished-ink)' },
  התבטלה: { bg: 'var(--cat-status-cancelled-bg)', ink: 'var(--cat-status-cancelled-ink)' },
};
