import { createContext, useContext } from 'react';

export const GridTableContext = createContext('');
export const useGridTableColumns = () => useContext(GridTableContext);
