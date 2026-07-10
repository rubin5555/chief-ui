import { useState } from 'react';
import { useDebounce } from '../useDebounce';

export const useSearch = (delay = 300, initialValue = '') => {
  const [search, setSearch] = useState(initialValue);
  const debouncedSearch = useDebounce(search, delay);
  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);
  const onClearSearch = () => setSearch('');
  return { search, debouncedSearch, onSearchChange, onClearSearch } as const;
};
