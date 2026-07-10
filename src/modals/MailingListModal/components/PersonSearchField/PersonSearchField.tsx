import { gray } from '@/styles/theme';
import type { Member, NetworkPerson } from '../../MailingListModal.constants';
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

interface PersonSearchFieldProps {
  query: string;
  onQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
  resultsOpen: boolean;
  results: NetworkPerson[];
  onSelectResult: (person: NetworkPerson) => void;
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
  onSelectResult,
  showManualAdd,
  onManualAdd,
  autoFocus,
}: PersonSearchFieldProps) => {
  const handleSelectResult = (person: NetworkPerson) => () => onSelectResult(person);

  return (
    <SearchFieldWrap>
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

      {resultsOpen &&
        query.trim() &&
        (results.length === 0 ? (
          <NoResults>לא נמצאו תוצאות</NoResults>
        ) : (
          <SearchResultsDropdown>
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
        ))}
    </SearchFieldWrap>
  );
};
