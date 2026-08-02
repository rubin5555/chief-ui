import type { ReactNode } from 'react';

// Header rows are positional — one cell per grid column, including the spacer
// columns that hold a checkbox or a row-action button and so carry no label.
// `key` names the column rather than its slot, so the table can key the row off
// something stable instead of the array index.
export interface TableHeaderCell {
  key: string;
  label?: ReactNode;
  align?: 'right' | 'center';
}
