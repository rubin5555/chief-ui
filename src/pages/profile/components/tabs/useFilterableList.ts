import { getRouteApi } from '@tanstack/react-router';
import { useDebounce } from '@/hooks/useDebounce';

const FILTER_DEBOUNCE_MS = 300;
const routeApi = getRouteApi('/');

interface UseFilterableListOptions<T extends string> {
  defaultSubTab: T;
  onSearchChange?: (value: string) => void;
  onFilterChange?: (value: string) => void;
  onSubTabChange?: (value: T) => void;
}

export const useFilterableList = <T extends string>({
  defaultSubTab,
  onSearchChange,
  onFilterChange,
  onSubTabChange,
}: UseFilterableListOptions<T>) => {
  const { q: search, dept: filter, sub } = routeApi.useSearch();
  const navigate = routeApi.useNavigate();
  const subTab = (sub || defaultSubTab) as T;

  const debouncedSearch = useDebounce(search, FILTER_DEBOUNCE_MS);
  const debouncedFilter = useDebounce(filter, FILTER_DEBOUNCE_MS);

  const handleSearchChange = (value: string) => {
    navigate({ search: (prev) => ({ ...prev, q: value }), replace: true });
    if (value) onSearchChange?.(value);
  };

  const handleFilterChange = (value: string) => {
    navigate({ search: (prev) => ({ ...prev, dept: value }), replace: true });
    if (value) onFilterChange?.(value);
  };

  const handleClearFilter = () =>
    navigate({ search: (prev) => ({ ...prev, dept: '' }), replace: true });

  const handleSubTabChange = (id: string) => {
    const value = id as T;
    navigate({ search: (prev) => ({ ...prev, sub: value }), replace: true });
    onSubTabChange?.(value);
  };

  const matchesFilterable = (name: string, department?: string) =>
    name.includes(debouncedSearch) && (!debouncedFilter || department === debouncedFilter);

  return {
    search,
    filter,
    subTab,
    handleSearchChange,
    handleFilterChange,
    handleClearFilter,
    handleSubTabChange,
    matchesFilterable,
  } as const;
};
