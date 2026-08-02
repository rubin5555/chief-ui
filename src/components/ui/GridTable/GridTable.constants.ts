import { gray, radii, tableColors } from '@/styles/theme';
import type { Density } from './GridTable.types';

interface DensityMetrics {
  headerPadding: string;
  headerFontSize: string;
  headerBackground: string;
  columnGap: string;
  // Horizontal inset on the rows area only. The header stays edge-to-edge so
  // its bar reaches the card's rounded corners, which is how main draws both
  // tables — the rows are the part that sits in from the edge.
  rowsInset: string;
  rowPadding: string;
  rowRadius: string;
  rowDivider: string;
  estimateRowHeight: number;
}

// `compact` holds the values every table shipped with before there was a
// choice, so adding this prop moved nothing. `comfortable` is main's catalog /
// import-document table: Catalog.tsx:1980-2090 and Edit.tsx:1908-1940 draw the
// same header bar, the same 12px/16px row and the same rounded hover.
export const DENSITY: Record<Density, DensityMetrics> = {
  compact: {
    headerPadding: '8px 12px',
    headerFontSize: '10px',
    headerBackground: gray[200],
    columnGap: '6px',
    rowsInset: '0',
    rowPadding: '10px 12px',
    rowRadius: '0',
    rowDivider: gray[100],
    estimateRowHeight: 44,
  },
  comfortable: {
    headerPadding: '12px 24px',
    headerFontSize: '12px',
    headerBackground: tableColors.headerBar,
    columnGap: '16px',
    rowsInset: '8px',
    rowPadding: '12px 16px',
    rowRadius: radii.xl,
    rowDivider: tableColors.rowDivider,
    estimateRowHeight: 48,
  },
};
