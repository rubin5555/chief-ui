import { Check, Filter, Search } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { useRef, useState } from 'react';
import { useClickOutside } from '@/hooks/useClickOutside';
import {
  FilterButton,
  FilterClearBtn,
  FilterMenu,
  FilterMenuTitle,
  FilterOptionBtn,
  SearchIcon,
  SearchInput,
  SearchRoot,
} from './SearchBar.styles';
import { SEARCH_BAR_IDS } from './SearchBar.testids';

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  filterOptions?: string[];
  filterLabel?: string;
  selectedFilter?: string;
  onFilterChange?: (value: string) => void;
}

const DEFAULT_FILTER_LABEL = 'סינון לפי אגף';

export const SearchBar = ({
  value,
  onChange,
  placeholder = 'חיפוש...',
  filterOptions,
  filterLabel = DEFAULT_FILTER_LABEL,
  selectedFilter = '',
  onFilterChange,
}: SearchBarProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const filterMenuRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = () => setIsFilterOpen(false);
  useClickOutside([filterButtonRef, filterMenuRef], handleClickOutside, isFilterOpen);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value);
  const handleFilterButtonClick = () => setIsFilterOpen((prev) => !prev);
  const handleOptionSelect = (option: string) => () => {
    onFilterChange?.(selectedFilter === option ? '' : option);
    setIsFilterOpen(false);
  };
  const handleFilterClear = () => {
    onFilterChange?.('');
    setIsFilterOpen(false);
  };

  return (
    <SearchRoot data-testid={SEARCH_BAR_IDS.root}>
      <SearchInput
        data-testid={SEARCH_BAR_IDS.input}
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        dir="rtl"
      />
      <SearchIcon>
        <Search size={16} />
      </SearchIcon>
      {filterOptions && (
        <FilterButton
          ref={filterButtonRef}
          data-testid={SEARCH_BAR_IDS.filterButton}
          type="button"
          onClick={handleFilterButtonClick}
          $active={!!selectedFilter}
        >
          <Filter size={16} />
        </FilterButton>
      )}
      {filterOptions && isFilterOpen && (
        <FilterMenu ref={filterMenuRef} data-testid={SEARCH_BAR_IDS.filterMenu}>
          <FilterMenuTitle>{filterLabel}</FilterMenuTitle>
          {filterOptions.map((option) => (
            <FilterOptionBtn
              key={option}
              data-testid={SEARCH_BAR_IDS.filterOption(option)}
              type="button"
              $selected={selectedFilter === option}
              onClick={handleOptionSelect(option)}
            >
              <span>{option}</span>
              {selectedFilter === option && <Check size={14} />}
            </FilterOptionBtn>
          ))}
          {selectedFilter && (
            <FilterClearBtn
              data-testid={SEARCH_BAR_IDS.filterClear}
              type="button"
              onClick={handleFilterClear}
            >
              נקה סינון
            </FilterClearBtn>
          )}
        </FilterMenu>
      )}
    </SearchRoot>
  );
};
