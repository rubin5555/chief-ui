import { MoreHorizontal } from 'lucide-react';
import type { MouseEvent } from 'react';
import type { TrashDoc } from '@/api/catalog';
import type { ColumnDef } from '@/components/ui/GridTable';
import { ACTIONS_TITLE } from '../DocumentCatalog/DocumentCatalog.constants';
import {
  MetaCell,
  NameCell,
  RowActionButton,
  RowActions,
} from '../DocumentCatalog/DocumentCatalog.shared.styles';
import { TRASH_CATALOG_IDS, URGENT_DAYS } from './TrashCatalog.constants';
import { DaysLeft } from './TrashCatalog.styles';

interface TrashColumnsDeps {
  onMenuClick: (doc: TrashDoc) => (event: MouseEvent) => void;
}

// Seven tracks, the same shape as the drafts shelf minus its status and date
// columns — a deleted document has one date that matters and it is the one
// counting down.
export const trashColumns = ({ onMenuClick }: TrashColumnsDeps): ColumnDef<TrashDoc>[] => [
  { key: 'spacer', width: '1.5rem' },
  {
    key: 'name',
    width: '3fr',
    header: 'שם המסמך',
    align: 'right',
    cell: (doc) => <NameCell>{doc.name}</NameCell>,
  },
  {
    key: 'orderNum',
    width: '1fr',
    header: 'מס׳ פקודה',
    cell: (doc) => <MetaCell>{doc.orderNum}</MetaCell>,
  },
  {
    key: 'updateNum',
    width: '1fr',
    header: 'עדכון',
    cell: (doc) => <MetaCell $size="sm">{doc.updateNum}</MetaCell>,
  },
  {
    key: 'daysLeft',
    width: '1fr',
    header: 'תימחק בעוד',
    cell: (doc) => (
      <DaysLeft $urgent={doc.daysLeft <= URGENT_DAYS}>{`${doc.daysLeft} ימים`}</DaysLeft>
    ),
  },
  {
    key: 'refNum',
    width: '1fr',
    header: 'מס׳ סימוכין',
    cell: (doc) => <MetaCell $muted>{doc.refNum}</MetaCell>,
  },
  {
    key: 'actions',
    width: '2.5rem',
    cell: (doc) => (
      <RowActions data-row-actions>
        <RowActionButton
          type="button"
          title={ACTIONS_TITLE}
          data-testid={TRASH_CATALOG_IDS.rowMenu(doc.id)}
          onClick={onMenuClick(doc)}
        >
          <MoreHorizontal size={14} />
        </RowActionButton>
      </RowActions>
    ),
  },
];
