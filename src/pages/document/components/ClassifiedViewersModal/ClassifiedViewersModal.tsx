import { useState } from 'react';
import type { ClassifiedViewerDto } from '@/api/classifiedViewers';
import { CLASSIFIED_VIEWER_POOL_FALLBACK, useClassifiedViewerPool } from '@/api/classifiedViewers';
import { Button } from '@/components/ui/Button';
import type { ColumnDef, RowConfig } from '@/components/ui/GridTable';
import { GridTable } from '@/components/ui/GridTable';
import { Modal } from '@/components/ui/Modal';
import { SearchBar } from '@/components/ui/SearchBar';
import { useDebounce } from '@/hooks/useDebounce';
import { useClassifiedViewersModalAnalytics } from './ClassifiedViewersModal.analytics';
import { Body, EmptyState, MutedCell, NameCell, TableWrap } from './ClassifiedViewersModal.styles';
import { CLASSIFIED_VIEWERS_MODAL_IDS } from './ClassifiedViewersModal.testids';

const personKey = (person: ClassifiedViewerDto) => person.id;

export interface ClassifiedViewersModalProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  onClose: () => void;
}

export const ClassifiedViewersModal = ({
  selectedIds,
  onChange,
  onClose,
}: ClassifiedViewersModalProps) => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const { data } = useClassifiedViewerPool();
  const people = data ?? CLASSIFIED_VIEWER_POOL_FALLBACK.classifiedViewerPool;

  const filtered = people.filter(
    (person) =>
      person.name.includes(debouncedSearch) ||
      person.idNumber.includes(debouncedSearch) ||
      person.env.includes(debouncedSearch),
  );

  const { trackViewersChanged } = useClassifiedViewersModalAnalytics();

  const handleToggle = (id: string) => () => {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((viewerId) => viewerId !== id)
      : [...selectedIds, id];
    trackViewersChanged(next.length);
    onChange(next);
  };

  const columns: ColumnDef<ClassifiedViewerDto>[] = [
    {
      key: 'select',
      width: '28px',
      cell: (person) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(person.id)}
          onChange={handleToggle(person.id)}
          data-testid={CLASSIFIED_VIEWERS_MODAL_IDS.checkbox(person.id)}
        />
      ),
    },
    {
      key: 'name',
      width: '1fr',
      header: 'שם מלא',
      align: 'right',
      cell: (person) => (
        <NameCell data-testid={CLASSIFIED_VIEWERS_MODAL_IDS.name(person.id)}>
          {person.name}
        </NameCell>
      ),
    },
    {
      key: 'idNumber',
      width: '120px',
      header: 'ת.ז',
      align: 'right',
      cell: (person) => <MutedCell>{person.idNumber}</MutedCell>,
    },
    {
      key: 'environment',
      width: '140px',
      header: 'סביבה',
      align: 'right',
      cell: (person) => <MutedCell>{person.env}</MutedCell>,
    },
  ];

  const rowConfig = (person: ClassifiedViewerDto): RowConfig => ({
    isSelected: selectedIds.includes(person.id),
    onClick: handleToggle(person.id),
  });

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
            columns={columns}
            items={filtered}
            getRowKey={personKey}
            row={rowConfig}
            emptyState={<EmptyState>לא נמצאו תוצאות</EmptyState>}
          />
        </TableWrap>
      </Body>
    </Modal>
  );
};
