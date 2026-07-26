import { useState } from 'react';
import { NETWORK_PEOPLE_FALLBACK, useNetworkPeople } from '@/api/networkPeople';
import { Button } from '@/components/ui/Button';
import { GridTable, GridTableRow } from '@/components/ui/GridTable';
import { Modal } from '@/components/ui/Modal';
import { SearchBar } from '@/components/ui/SearchBar';
import { useDebounce } from '@/hooks/useDebounce';
import { Body, EmptyState, MutedCell, NameCell, TableWrap } from './ClassifiedViewersModal.styles';
import { CLASSIFIED_VIEWERS_MODAL_IDS } from './ClassifiedViewersModal.testids';

const GRID_COLUMNS = '28px 1fr 120px 140px';

export interface ClassifiedViewersModalProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  onClose: () => void;
}

// Reuses the same personnel roster as the network people picker elsewhere
// (src/api/networkPeople.ts) rather than a separate classification-specific
// resource — same shape main's CLASSIFIED_POOL mock used (name/idNumber/env).
export const ClassifiedViewersModal = ({
  selectedIds,
  onChange,
  onClose,
}: ClassifiedViewersModalProps) => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const { data } = useNetworkPeople();
  const people = data ?? NETWORK_PEOPLE_FALLBACK.networkPeople;

  const filtered = people.filter(
    (person) =>
      person.name.includes(debouncedSearch) ||
      person.idNumber.includes(debouncedSearch) ||
      person.networkLabel.includes(debouncedSearch),
  );

  const handleToggle = (id: string) => () =>
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((viewerId) => viewerId !== id)
        : [...selectedIds, id],
    );

  return (
    <Modal
      title="רשימת צופים ממודרת"
      onClose={onClose}
      width={560}
      height="70vh"
      data-testid={CLASSIFIED_VIEWERS_MODAL_IDS.root}
      footer={
        <Button type="button" onClick={onClose} data-testid={CLASSIFIED_VIEWERS_MODAL_IDS.closeBtn}>
          סגירה
        </Button>
      }
    >
      <Body>
        <SearchBar value={search} onChange={setSearch} placeholder="חיפוש..." />
        <TableWrap>
          <GridTable
            columns={GRID_COLUMNS}
            headers={[null, 'שם מלא', 'ת.ז', 'סביבה']}
            items={filtered}
            getRowKey={(person) => person.id}
            emptyState={<EmptyState>לא נמצאו תוצאות</EmptyState>}
            renderRow={(person) => {
              const isSelected = selectedIds.includes(person.id);
              return (
                <GridTableRow isSelected={isSelected} onClick={handleToggle(person.id)}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={handleToggle(person.id)}
                    data-testid={CLASSIFIED_VIEWERS_MODAL_IDS.checkbox(person.id)}
                  />
                  <NameCell>{person.name}</NameCell>
                  <MutedCell>{person.idNumber}</MutedCell>
                  <MutedCell>{person.networkLabel}</MutedCell>
                </GridTableRow>
              );
            }}
          />
        </TableWrap>
      </Body>
    </Modal>
  );
};
