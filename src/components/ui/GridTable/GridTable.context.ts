import { createContext, useContext } from 'react';
import type { Density } from './GridTable.types';

// Rows are rendered by the table but assembled one level down, so the grid
// tracks and the scale travel by context rather than through every row's props.
export interface GridTableLayout {
  template: string;
  density: Density;
}

export const GridTableContext = createContext<GridTableLayout>({
  template: '',
  density: 'compact',
});

export const useGridTableLayout = () => useContext(GridTableContext);
