import type { CatalogVersion } from '@/api/catalog';
import type { ColumnDef } from '@/components/ui/GridTable';
import { catStatusColors, gray } from '@/styles/theme';
import {
  MetaCell,
  NameCell,
  StatusCell,
  StatusDot,
  StatusText,
} from '../../DocumentCatalog.shared.styles';
import { ViewBtn, ViewBtnCell } from './VersionHistoryModal.styles';

const statusInk = (status: string) => catStatusColors[status]?.ink ?? gray[500];

// Seven columns, same contract as the catalog's own table — one array, and the
// header and the cells both come out of it.
export const versionColumns = (
  onView: (version: CatalogVersion) => () => void,
): ColumnDef<CatalogVersion>[] => [
  {
    key: 'orderNum',
    width: '1.5fr',
    header: 'מס׳ פקודה',
    align: 'right',
    cell: (version) => <NameCell>{version.orderNum}</NameCell>,
  },
  {
    key: 'updateNum',
    width: '0.8fr',
    header: 'מס׳ עדכון',
    cell: (version) => <MetaCell $size="sm">{version.updateNum}</MetaCell>,
  },
  {
    key: 'status',
    width: '1.2fr',
    header: 'סטטוס',
    cell: (version) => (
      <StatusCell>
        <StatusDot $color={statusInk(version.status)} />
        <StatusText $child>{version.status}</StatusText>
      </StatusCell>
    ),
  },
  {
    key: 'date',
    width: '1.2fr',
    header: 'עודכן ב',
    cell: (version) => <MetaCell $size="sm">{version.date}</MetaCell>,
  },
  {
    key: 'refNum',
    width: '1fr',
    header: 'סימוכין',
    cell: (version) => <MetaCell $muted>{version.refNum}</MetaCell>,
  },
  {
    key: 'approvedBy',
    width: '1fr',
    header: 'אושר ע״י',
    cell: (version) => <MetaCell $size="sm">{version.approvedBy}</MetaCell>,
  },
  {
    key: 'view',
    width: '5rem',
    cell: (version) => (
      <ViewBtnCell>
        <ViewBtn type="button" data-row-actions onClick={onView(version)}>
          לצפייה
        </ViewBtn>
      </ViewBtnCell>
    ),
  },
];
