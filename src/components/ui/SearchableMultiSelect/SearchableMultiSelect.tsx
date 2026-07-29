import { Check, ChevronDown, Search } from 'lucide-react';
import type { KeyboardEvent } from 'react';
import { useEffect, useRef } from 'react';
import { FilterChip } from '@/components/ui/FilterChip';
import { useFloatingPanel } from '@/hooks/useFloatingPanel';
import { useSearch } from '@/hooks/useSearch';
import {
  ChevronWrapper,
  ChipClickGuard,
  ChipsWrapper,
  Dropdown,
  EmptyText,
  OptionBtn,
  OptionsList,
  Placeholder,
  SearchBox,
  SearchInput,
  Trigger,
} from './SearchableMultiSelect.styles';
import { SEARCHABLE_MULTI_SELECT_IDS } from './SearchableMultiSelect.testids';

interface SearchableMultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  noBorder?: boolean;
  id?: string;
  'data-testid'?: string;
}

export const SearchableMultiSelect = ({
  options,
  selected,
  onChange,
  placeholder = 'בחר...',
  noBorder = false,
  id,
  'data-testid': testId,
}: SearchableMultiSelectProps) => {
  const panel = useFloatingPanel<HTMLDivElement>();
  const { search, debouncedSearch, onSearchChange, onClearSearch } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const base = testId ?? SEARCHABLE_MULTI_SELECT_IDS.root;

  useEffect(() => {
    if (panel.open) {
      inputRef.current?.focus();
    } else {
      onClearSearch();
    }
  }, [panel.open]);

  const onTriggerClick = () => panel.toggle((r) => ({ top: r.bottom + 4, left: r.left }));

  const onTriggerKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onTriggerClick();
    }
  };

  const toggleOption = (opt: string) => () => {
    onChange(selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt]);
  };

  const removeChip = (opt: string) => () => {
    onChange(selected.filter((s) => s !== opt));
  };

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  const filtered = options.filter((opt) => opt.includes(debouncedSearch));
  const triggerWidth = Math.max(panel.btnRef.current?.offsetWidth ?? 0, 220);

  return (
    <>
      <Trigger
        ref={panel.btnRef}
        id={id}
        data-testid={base}
        $noBorder={noBorder}
        onClick={onTriggerClick}
        onKeyDown={onTriggerKeyDown}
        role="combobox"
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={panel.open}
      >
        <ChipsWrapper>
          {selected.length === 0 ? (
            <Placeholder>{placeholder}</Placeholder>
          ) : (
            selected.map((opt) => (
              <ChipClickGuard key={opt} onClick={stopPropagation}>
                <FilterChip label={opt} onClear={removeChip(opt)} />
              </ChipClickGuard>
            ))
          )}
        </ChipsWrapper>
        <ChevronWrapper $open={panel.open}>
          <ChevronDown size={16} />
        </ChevronWrapper>
      </Trigger>

      {panel.open && panel.pos && (
        <Dropdown
          ref={panel.panelRef}
          data-testid={SEARCHABLE_MULTI_SELECT_IDS.dropdown}
          pos={panel.pos}
          width={triggerWidth}
        >
          <SearchBox>
            <Search size={14} />
            <SearchInput
              ref={inputRef}
              type="text"
              value={search}
              onChange={onSearchChange}
              placeholder="חפש שם..."
              dir="rtl"
            />
          </SearchBox>
          <OptionsList>
            {filtered.length === 0 ? (
              <EmptyText>לא נמצאו תוצאות</EmptyText>
            ) : (
              filtered.map((opt) => (
                <OptionBtn
                  key={opt}
                  type="button"
                  data-testid={SEARCHABLE_MULTI_SELECT_IDS.option(opt)}
                  $selected={selected.includes(opt)}
                  onClick={toggleOption(opt)}
                >
                  <span>{opt}</span>
                  {selected.includes(opt) && <Check size={14} />}
                </OptionBtn>
              ))
            )}
          </OptionsList>
        </Dropdown>
      )}
    </>
  );
};
