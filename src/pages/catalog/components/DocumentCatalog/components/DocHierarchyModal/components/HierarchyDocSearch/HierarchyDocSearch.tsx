import { FileText, Plus, Search } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { useRef, useState } from 'react';
import type { CatalogDoc } from '@/api/catalog';
import { useClickOutside } from '@/hooks/useClickOutside';
import { CATALOG_MODAL_IDS } from '../../../catalogModals.testids';
import { DocIcon, DocName, DocOrderNum, DocText } from '../../DocHierarchyModal.styles';
import {
  AddIcon,
  ResultRow,
  ResultsPanel,
  SearchAnchor,
  SearchBox,
  SearchInput,
} from './HierarchyDocSearch.styles';

interface HierarchyDocSearchProps {
  pool: CatalogDoc[];
  placeholder: string;
  onSelect: (doc: CatalogDoc) => void;
}

const MAX_RESULTS = 6;

// main declares this inside the modal's own body, which remounts it on every
// keystroke and drops focus. It is a component in its own file here, and owns
// the query it is filtering on.
export const HierarchyDocSearch = ({ pool, placeholder, onSelect }: HierarchyDocSearchProps) => {
  const [query, setQuery] = useState('');
  const [isShowingResults, setIsShowingResults] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  useClickOutside([anchorRef], () => setIsShowingResults(false), isShowingResults);

  const results = query.trim()
    ? pool
        .filter((doc) => doc.name.includes(query) || doc.orderNum.includes(query))
        .slice(0, MAX_RESULTS)
    : [];

  const onQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsShowingResults(true);
  };

  const onFocus = () => setIsShowingResults(true);

  const handleSelect = (doc: CatalogDoc) => () => {
    onSelect(doc);
    setQuery('');
    setIsShowingResults(false);
  };

  return (
    <SearchAnchor ref={anchorRef}>
      <SearchBox>
        <DocIcon $muted>
          <Search size={16} />
        </DocIcon>
        <SearchInput
          dir="rtl"
          value={query}
          placeholder={placeholder}
          data-testid={CATALOG_MODAL_IDS.hierarchySearchInput}
          onChange={onQueryChange}
          onFocus={onFocus}
        />
      </SearchBox>

      {isShowingResults && results.length > 0 && (
        <ResultsPanel>
          {results.map((doc) => (
            <ResultRow
              key={doc.id}
              type="button"
              data-testid={CATALOG_MODAL_IDS.hierarchyResult(doc.id)}
              onClick={handleSelect(doc)}
            >
              <DocIcon $muted>
                <FileText size={16} />
              </DocIcon>
              <DocText>
                <DocName>{doc.name}</DocName>
                <DocOrderNum>{doc.orderNum}</DocOrderNum>
              </DocText>
              <AddIcon>
                <Plus size={14} />
              </AddIcon>
            </ResultRow>
          ))}
        </ResultsPanel>
      )}
    </SearchAnchor>
  );
};
