import type { ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { FilterChip } from '@/components/ui/FilterChip';
import { ItemList, ItemListEmpty } from '@/components/ui/ItemList';
import { FilterChipRow, PanelRoot, PanelToolbar } from '@/components/ui/Panel';
import { SearchBar } from '@/components/ui/SearchBar';
import type { UnderlineTab } from '@/components/ui/UnderlineTabs';
import { UnderlineTabs } from '@/components/ui/UnderlineTabs';

interface TabPanelShellProps {
  rootTestId: string;
  toolbarTestId: string;
  primaryLabel: string;
  onPrimaryClick: () => void;
  filterable: {
    search: string;
    onSearchChange: (value: string) => void;
    filterOptions: string[];
    filter: string;
    onFilterChange: (value: string) => void;
    onClearFilter: () => void;
  };
  tabs: UnderlineTab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  isEmpty: boolean;
  emptyLabel: string;
  children: ReactNode;
}

export const TabPanelShell = ({
  rootTestId,
  toolbarTestId,
  primaryLabel,
  onPrimaryClick,
  filterable,
  tabs,
  activeTab,
  onTabChange,
  isEmpty,
  emptyLabel,
  children,
}: TabPanelShellProps) => {
  return (
    <PanelRoot data-testid={rootTestId}>
      <PanelToolbar data-testid={toolbarTestId}>
        <Button variant="primary" size="sm" onClick={onPrimaryClick}>
          {primaryLabel}
        </Button>
        <SearchBar
          value={filterable.search}
          onChange={filterable.onSearchChange}
          filterOptions={filterable.filterOptions}
          selectedFilter={filterable.filter}
          onFilterChange={filterable.onFilterChange}
        />
      </PanelToolbar>

      {filterable.filter && (
        <FilterChipRow>
          <FilterChip label={filterable.filter} onClear={filterable.onClearFilter} />
        </FilterChipRow>
      )}

      <UnderlineTabs tabs={tabs} activeId={activeTab} onChange={onTabChange} />

      <ItemList>{isEmpty ? <ItemListEmpty label={emptyLabel} /> : children}</ItemList>
    </PanelRoot>
  );
};
