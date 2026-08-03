import { useState } from 'react';
import type { CatalogDoc } from '@/api/catalog';
import { CATALOG_DOCS_FALLBACK } from '@/api/catalog';
import { DialogSearchField } from '@/components/ui/DialogSearchField';
import { Modal } from '@/components/ui/Modal';
import { useDebounce } from '@/hooks/useDebounce';
import { catStatusColors, gray } from '@/styles/theme';
import { CATALOG_MODAL_IDS } from '../catalogModals.testids';
import {
  NoResults,
  ResultList,
  ResultMeta,
  ResultName,
  ResultRow,
  ResultText,
  SearchField,
  StatusBadge,
  StatusBadgeDot,
} from './DuplicateSearchModal.styles';

interface DuplicateSearchModalProps {
  onSelect: (doc: CatalogDoc) => void;
  onClose: () => void;
}

// Only settled documents can be duplicated, which is why the pool is the
// distributed and archive shelves rather than everything.
const POOL = [...CATALOG_DOCS_FALLBACK.distributed, ...CATALOG_DOCS_FALLBACK.archive];
const UNSEARCHED_LIMIT = 10;

export const DuplicateSearchModal = ({ onSelect, onClose }: DuplicateSearchModalProps) => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const query = debouncedSearch.trim();

  const visible = query
    ? POOL.filter((doc) => doc.name.includes(query) || doc.orderNum.includes(query))
    : POOL.slice(0, UNSEARCHED_LIMIT);

  const handleSelect = (doc: CatalogDoc) => () => onSelect(doc);

  return (
    <Modal
      title="בחר מסמך לשכפול"
      width={560}
      maxHeight="80vh"
      onClose={onClose}
      data-testid={CATALOG_MODAL_IDS.duplicateSearch}
    >
      <SearchField>
        {/* The dialog exists to be typed into, so focus starts here. */}
        <DialogSearchField
          autoFocus
          value={search}
          onChange={setSearch}
          placeholder="חיפוש לפי שם מסמך, מספר פקודה..."
          data-testid={CATALOG_MODAL_IDS.duplicateSearchInput}
        />
      </SearchField>

      <ResultList>
        {visible.map((doc) => {
          const palette = catStatusColors[doc.status] ?? { bg: gray[100], ink: gray[500] };
          return (
            <ResultRow
              key={doc.id}
              type="button"
              data-testid={CATALOG_MODAL_IDS.duplicateSearchRow(doc.id)}
              onClick={handleSelect(doc)}
            >
              <ResultText>
                <ResultName>{doc.name}</ResultName>
                <ResultMeta>{`${doc.orderNum} · ${doc.dept} · ${doc.env}`}</ResultMeta>
              </ResultText>
              <StatusBadge $bg={palette.bg} $ink={palette.ink}>
                <StatusBadgeDot $ink={palette.ink} />
                {doc.status}
              </StatusBadge>
            </ResultRow>
          );
        })}
        {visible.length === 0 && <NoResults>לא נמצאו מסמכים</NoResults>}
      </ResultList>
    </Modal>
  );
};
