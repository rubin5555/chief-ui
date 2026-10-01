import { Search } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/Checkbox';
import { SectionTitle } from '../components.shared.styles';
import {
  NoOptions,
  OptionLabel,
  OptionList,
  OptionRow,
  SectionSearch,
  SectionSearchIcon,
  SectionSearchInput,
} from './FilterCheckboxSection.styles';

interface FilterCheckboxSectionProps {
  title: string;
  options: string[];
  selected: string[];
  // Long lists get a filter box above them; short fixed ones don't. main has
  // two near-identical components for this; here it is one flag.
  searchable?: boolean;
  onChange: (selected: string[]) => void;
}

export const FilterCheckboxSection = ({
  title,
  options,
  selected,
  searchable = false,
  onChange,
}: FilterCheckboxSectionProps) => {
  const [query, setQuery] = useState('');

  const visible = searchable ? options.filter((option) => option.includes(query)) : options;

  const onQueryChange = (event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value);

  const handleToggle = (option: string) => () =>
    onChange(
      selected.includes(option)
        ? selected.filter((value) => value !== option)
        : [...selected, option],
    );

  return (
    <div>
      <SectionTitle>{title}</SectionTitle>

      {searchable && (
        <SectionSearch>
          <SectionSearchIcon>
            <Search size={12} />
          </SectionSearchIcon>
          <SectionSearchInput
            dir="rtl"
            value={query}
            placeholder="חיפוש..."
            onChange={onQueryChange}
          />
        </SectionSearch>
      )}

      <OptionList $tall={!searchable}>
        {visible.map((option) => (
          <OptionRow key={option}>
            <Checkbox checked={selected.includes(option)} onChange={handleToggle(option)} />
            <OptionLabel $checked={selected.includes(option)}>{option}</OptionLabel>
          </OptionRow>
        ))}
        {visible.length === 0 && <NoOptions>לא נמצאו</NoOptions>}
      </OptionList>
    </div>
  );
};
