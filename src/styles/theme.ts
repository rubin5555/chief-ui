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
  warningStrong: 'var(--doc-warning-strong)',
  stampInk: 'var(--doc-stamp-ink)',
  chatOwnAccent: 'var(--doc-chat-own-accent)',
  chatArrowBorder: 'var(--doc-chat-arrow-border)',
  cellActiveBg: 'var(--doc-cell-active-bg)',
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
} as const;

export const radii = {
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
