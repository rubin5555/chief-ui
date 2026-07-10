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
