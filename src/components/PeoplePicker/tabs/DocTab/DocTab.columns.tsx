import type { MouseEvent } from 'react';
import type { ColumnDef } from '@/components/ui/GridTable';
import { SubTable } from '@/components/ui/SubTable';
import { gray } from '@/styles/theme';
import { SelectionCheckbox } from '../../components/SelectionCheckbox';
import type { DocItem, PersonMember } from '../../PeoplePicker.constants';
import {
  CheckboxCell,
  CountLabel,
  ExpandBtn,
  ExpandChevron,
  NameCell,
} from '../tabs.shared.styles';
import { ColCenter, SubCell, SubNameCell } from './components/components.shared.styles';
import { DOC_TAB_IDS } from './DocTab.testids';

// The distribution table sits inside a document row and borrows the nine tracks
// of the table above it so its cells line up under the matching columns. Only
// five of them carry anything; the four trailing spacers are load-bearing —
// drop them and the grid narrows and the alignment goes.
const DISTRIBUTION_COLUMNS: ColumnDef<PersonMember>[] = [
  { key: 'spacer', width: '28px' },
  {
    key: 'name',
    width: '1fr',
    header: 'שם מלא',
    align: 'right',
    cell: (person) => <SubNameCell>{person.name}</SubNameCell>,
  },
  {
    key: 'idNumber',
    width: '64px',
    header: 'תעודת זהות',
    cell: (person) => <SubCell $tabular>{person.idNumber}</SubCell>,
  },
  { key: 'gap', width: '58px' },
  {
    key: 'organization',
    width: '58px',
    header: 'ארגון',
    cell: (person) => <SubCell>{person.environment}</SubCell>,
  },
  { key: 'pad-date', width: '80px' },
  { key: 'pad-updated', width: '80px' },
  { key: 'pad-ref', width: '58px' },
  { key: 'pad-actions', width: '24px' },
];

const distributionKey = (person: PersonMember, index: number) => person.idNumber || index;

export const DocDistribution = ({ doc }: { doc: DocItem }) => (
  <SubTable columns={DISTRIBUTION_COLUMNS} items={doc.distribution} getRowKey={distributionKey} />
);

interface DocColumnsDeps {
  selectedIds: Set<string>;
  addedDocIds: Set<string>;
  expandedId: string | null;
  onCheckClick: (id: string, isAdded: boolean) => (event: MouseEvent) => void;
  onToggleExpand: (id: string) => (event: MouseEvent) => void;
}

export const docColumns = ({
  selectedIds,
  addedDocIds,
  expandedId,
  onCheckClick,
  onToggleExpand,
}: DocColumnsDeps): ColumnDef<DocItem>[] => [
  {
    key: 'select',
    width: '28px',
    cell: (doc) => (
      <CheckboxCell
        data-testid={DOC_TAB_IDS.rowCheckbox(doc.id)}
        onClick={onCheckClick(doc.id, addedDocIds.has(doc.id))}
      >
        <SelectionCheckbox isSelected={selectedIds.has(doc.id)} isAdded={addedDocIds.has(doc.id)} />
      </CheckboxCell>
    ),
  },
  {
    key: 'name',
    width: '1fr',
    header: 'שם המסמך',
    align: 'right',
    cell: (doc) => (
      <NameCell>
        {doc.name}
        <CountLabel>({doc.distribution.length})</CountLabel>
      </NameCell>
    ),
  },
  {
    key: 'command',
    width: '64px',
    header: 'פקודה',
    cell: (doc) => <ColCenter>{doc.cmdNum}</ColCenter>,
  },
  {
    key: 'update',
    width: '58px',
    header: 'עדכון',
    cell: (doc) => <ColCenter>{doc.update}</ColCenter>,
  },
  {
    key: 'type',
    width: '58px',
    header: 'סוג',
    cell: (doc) => <ColCenter>{doc.docType}</ColCenter>,
  },
  {
    key: 'organization',
    width: '80px',
    header: 'ארגון',
    cell: (doc) => <ColCenter>{doc.environment}</ColCenter>,
  },
  {
    key: 'date',
    width: '80px',
    header: 'תאריך',
    cell: (doc) => <ColCenter $color={gray[500]}>{doc.lastUpdate}</ColCenter>,
  },
  {
    key: 'distribution',
    width: '58px',
    header: 'מ"פ',
    cell: (doc) => <ColCenter $color={gray[400]}>{doc.refNum}</ColCenter>,
  },
  {
    key: 'actions',
    width: '24px',
    cell: (doc) => (
      <ExpandBtn
        type="button"
        data-testid={DOC_TAB_IDS.rowExpand(doc.id)}
        onClick={onToggleExpand(doc.id)}
      >
        <ExpandChevron size={14} color={gray[400]} $isExpanded={expandedId === doc.id} />
      </ExpandBtn>
    ),
  },
];
