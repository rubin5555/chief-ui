import type { ReactNode } from 'react';

export type TableGridIconVariant =
  | 'row-before'
  | 'row-after'
  | 'row-delete'
  | 'col-before'
  | 'col-after'
  | 'col-delete';

const PATHS: Record<TableGridIconVariant, ReactNode> = {
  'row-before': (
    <>
      <line x1="7" y1="1" x2="7" y2="4.5" strokeWidth="1.4" />
      <line x1="5" y1="2.75" x2="9" y2="2.75" strokeWidth="1.4" />
      <rect x="1.5" y="6" width="11" height="7.5" rx="0.5" strokeWidth="1.1" />
      <line x1="1.5" y1="9.75" x2="12.5" y2="9.75" strokeWidth="1" />
      <line x1="7" y1="6" x2="7" y2="13.5" strokeWidth="0.9" />
    </>
  ),
  'row-after': (
    <>
      <rect x="1.5" y="0.5" width="11" height="7.5" rx="0.5" strokeWidth="1.1" />
      <line x1="1.5" y1="4.25" x2="12.5" y2="4.25" strokeWidth="1" />
      <line x1="7" y1="0.5" x2="7" y2="8" strokeWidth="0.9" />
      <line x1="7" y1="9.5" x2="7" y2="13" strokeWidth="1.4" />
      <line x1="5" y1="11.25" x2="9" y2="11.25" strokeWidth="1.4" />
    </>
  ),
  'row-delete': (
    <>
      <rect x="1.5" y="1" width="11" height="12" rx="0.5" strokeWidth="1.1" />
      <line x1="1.5" y1="5" x2="12.5" y2="5" strokeWidth="1" />
      <line x1="1.5" y1="9" x2="12.5" y2="9" strokeWidth="1" />
      <line x1="4.5" y1="5.8" x2="9.5" y2="8.2" strokeWidth="1.3" />
      <line x1="9.5" y1="5.8" x2="4.5" y2="8.2" strokeWidth="1.3" />
    </>
  ),
  'col-before': (
    <>
      <line x1="10.25" y1="7" x2="13.5" y2="7" strokeWidth="1.4" />
      <line x1="11.875" y1="5.2" x2="11.875" y2="8.8" strokeWidth="1.4" />
      <rect x="0.5" y="1.5" width="7.5" height="11" rx="0.5" strokeWidth="1.1" />
      <line x1="4.25" y1="1.5" x2="4.25" y2="12.5" strokeWidth="1" />
      <line x1="0.5" y1="7" x2="8" y2="7" strokeWidth="0.9" />
    </>
  ),
  'col-after': (
    <>
      <rect x="6" y="1.5" width="7.5" height="11" rx="0.5" strokeWidth="1.1" />
      <line x1="9.75" y1="1.5" x2="9.75" y2="12.5" strokeWidth="1" />
      <line x1="6" y1="7" x2="13.5" y2="7" strokeWidth="0.9" />
      <line x1="0.5" y1="7" x2="3.8" y2="7" strokeWidth="1.4" />
      <line x1="2.15" y1="5.2" x2="2.15" y2="8.8" strokeWidth="1.4" />
    </>
  ),
  'col-delete': (
    <>
      <rect x="1" y="1.5" width="12" height="11" rx="0.5" strokeWidth="1.1" />
      <line x1="5" y1="1.5" x2="5" y2="12.5" strokeWidth="1" />
      <line x1="9" y1="1.5" x2="9" y2="12.5" strokeWidth="1" />
      <line x1="5.8" y1="4.5" x2="8.2" y2="9.5" strokeWidth="1.3" />
      <line x1="8.2" y1="4.5" x2="5.8" y2="9.5" strokeWidth="1.3" />
    </>
  ),
};

export interface TableGridIconProps {
  variant: TableGridIconVariant;
}

export const TableGridIcon = ({ variant }: TableGridIconProps) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    aria-hidden="true"
  >
    {PATHS[variant]}
  </svg>
);
