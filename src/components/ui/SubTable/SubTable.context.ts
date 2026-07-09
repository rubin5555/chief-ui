import { createContext, useContext } from 'react';

export const SubTableContext = createContext('');
export const useSubTableColumns = () => useContext(SubTableContext);
