import { ChevronDown, Search } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useFloatingPanel } from '@/hooks/useFloatingPanel';
import { useSearch } from '@/hooks/useSearch';
import {
  ChevronWrapper,
  Dropdown,
  EmptyText,
  OptionBtn,
  OptionsList,
  SearchBox,
  SearchInput,
  Trigger,
} from './SearchableSelect.styles';
import { SEARCHABLE_SELECT_IDS } from './SearchableSelect.testids';

interface SearchableSelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  noBorder?: boolean;
  id?: string;
  'data-testid'?: string;
}

export const SearchableSelect = ({
  options,
  value,
  onChange,
  placeholder = 'חפש...',
  noBorder = false,
  id,
  'data-testid': testId,
}: SearchableSelectProps) => {
  const panel = useFloatingPanel();
  const { search, debouncedSearch, onSearchChange, onClearSearch } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const base = testId ?? SEARCHABLE_SELECT_IDS.root;

  useEffect(() => {
    if (panel.open) {
      inputRef.current?.focus();
    } else {
      onClearSearch();
    }
  }, [panel.open, onClearSearch]);

  const onTriggerClick = () => panel.toggle((r) => ({ top: r.bottom + 4, left: r.left }));

  const onSelect = (opt: string) => () => {
    onChange(opt);
    panel.close();
  };

  const filtered = options.filter((opt) => opt.includes(debouncedSearch));
  const triggerWidth = panel.btnRef.current?.offsetWidth;

  return (
    <>
      <Trigger
        ref={panel.btnRef}
        type="button"
        id={id}
        data-testid={base}
        $isPlaceholder={!value}
        $noBorder={noBorder}
        onClick={onTriggerClick}
      >
        <span>{value || placeholder}</span>
        <ChevronWrapper $open={panel.open}>
          <ChevronDown size={16} />
        </ChevronWrapper>
      </Trigger>

      {panel.open && panel.pos && (
        <Dropdown
          ref={panel.panelRef}
          data-testid={SEARCHABLE_SELECT_IDS.dropdown}
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
                  data-testid={SEARCHABLE_SELECT_IDS.option(opt)}
                  $selected={value === opt}
                  onClick={onSelect(opt)}
                >
                  {opt}
                </OptionBtn>
              ))
            )}
          </OptionsList>
        </Dropdown>
      )}
    </>
  );
};
