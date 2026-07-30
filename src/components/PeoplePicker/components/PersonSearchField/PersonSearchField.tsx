import { useRef } from 'react';
import type { DirectoryUser } from '@/api/users';
import { ModalPortal } from '@/components/ui/ModalPortal';
import { gray } from '@/styles/theme';
import type { Member } from '../../PeoplePicker.constants';
import { ManualAddPanel } from '../ManualAddPanel';
import { ModalSearchInput } from '../ModalSearchInput';
import {
  NoResults,
  ResultAddIcon,
  SearchFieldRow,
  SearchFieldWrap,
  SearchResultContent,
  SearchResultId,
  SearchResultName,
  SearchResultRow,
  SearchResultsDropdown,
} from './PersonSearchField.styles';
import { useDropdownAnchor } from './useDropdownAnchor';

interface PersonSearchFieldProps {
  query: string;
  onQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
  resultsOpen: boolean;
  results: DirectoryUser[];
  loading?: boolean;
  onSelectResult: (person: DirectoryUser) => void;
  showManualAdd: boolean;
  onManualAdd?: (member: Member) => void;
  autoFocus?: boolean;
}

export const PersonSearchField = ({
  query,
  onQueryChange,
  onFocus,
  onBlur,
  resultsOpen,
  results,
  loading = false,
  onSelectResult,
  showManualAdd,
  onManualAdd,
  autoFocus,
}: PersonSearchFieldProps) => {
  const handleSelectResult = (person: DirectoryUser) => () => onSelectResult(person);

  const fieldRef = useRef<HTMLDivElement>(null);
  const anchor = useDropdownAnchor(fieldRef, resultsOpen && Boolean(query.trim()));

  return (
    <SearchFieldWrap ref={fieldRef}>
      <SearchFieldRow>
        <ModalSearchInput
          value={query}
          onChange={onQueryChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder="חיפוש לפי שם או ת.ז..."
          autoFocus={autoFocus}
        />
        {showManualAdd && onManualAdd && <ManualAddPanel onSave={onManualAdd} />}
      </SearchFieldRow>

      {anchor && (
        <ModalPortal>
          {loading ? (
            <NoResults $anchor={anchor}>מחפש...</NoResults>
          ) : results.length === 0 ? (
            <NoResults $anchor={anchor}>לא נמצאו תוצאות</NoResults>
          ) : (
            <SearchResultsDropdown $anchor={anchor}>
              {results.map((p) => (
                <SearchResultRow key={p.id} type="button" onMouseDown={handleSelectResult(p)}>
                  <SearchResultContent>
                    <SearchResultName>{p.name}</SearchResultName>
                    <SearchResultId>{p.idNumber}</SearchResultId>
                  </SearchResultContent>
                  <ResultAddIcon size={16} color={gray[300]} />
                </SearchResultRow>
              ))}
            </SearchResultsDropdown>
          )}
        </ModalPortal>
      )}
    </SearchFieldWrap>
  );
};
