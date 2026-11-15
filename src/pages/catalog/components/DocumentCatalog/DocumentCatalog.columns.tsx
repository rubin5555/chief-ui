import { ChevronDown, Clock, MoreHorizontal } from 'lucide-react';
import type { MouseEvent } from 'react';
import type { CatalogDoc, CatalogTab } from '@/api/catalog';
import type { ColumnDef } from '@/components/ui/GridTable';
import { catStatusColors, gray } from '@/styles/theme';
import {
  ACTIONS_TITLE,
  DATE_HEADER,
  EXPAND_TITLE,
  HISTORY_TITLE,
  NEW_VIEWERS_LABEL,
  NO_RECEIPT,
  RESHARE_LABEL,
} from './DocumentCatalog.constants';
import {
  CellCenter,
  ExpandButton,
  MetaCell,
  NameCell,
  ReceiptEmpty,
  ReceiptLink,
  ReshareButton,
  ReshareCell,
  ReshareLabel,
  RowActionButton,
  RowActions,
  StatusCell,
  StatusDot,
  StatusText,
} from './DocumentCatalog.shared.styles';
import { DOCUMENT_CATALOG_IDS } from './DocumentCatalog.testids';

// A parent row and one of its expanded children draw the same columns at
// different weights. One factory builds both so the tracks cannot drift — see
// `.claude/skills/table-columns.md`, "Nested Sub-Tables Must Repeat The
// Parent's Tracks".
export type RowVariant = 'parent' | 'child';

export interface CatalogColumnsDeps {
  tab: CatalogTab;
  isAllDocs: boolean;
  variant: RowVariant;
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => (event: MouseEvent) => void;
  onHistoryClick: (doc: CatalogDoc) => (event: MouseEvent) => void;
  onMenuClick: (doc: CatalogDoc) => (event: MouseEvent) => void;
  onReceiptClick: (doc: CatalogDoc) => (event: MouseEvent) => void;
  onReshareClick: (doc: CatalogDoc) => (event: MouseEvent) => void;
}

const statusInk = (status: string) => catStatusColors[status]?.ink ?? gray[500];

export const catalogColumns = ({
  tab,
  isAllDocs,
  variant,
  expandedIds,
  onToggleExpand,
  onHistoryClick,
  onMenuClick,
  onReceiptClick,
  onReshareClick,
}: CatalogColumnsDeps): ColumnDef<CatalogDoc>[] => {
  const isChild = variant === 'child';
  const isDistribution = tab === 'distribution';

  const columns: ColumnDef<CatalogDoc>[] = [
    {
      key: 'expand',
      width: '1.5rem',
      // Parent rows with children get a chevron here; children get the gutter
      // that keeps their names under their parent's.
      cell: isChild
        ? undefined
        : (doc) =>
            doc.children?.length ? (
              <CellCenter>
                <ExpandButton
                  type="button"
                  title={EXPAND_TITLE}
                  $expanded={expandedIds.has(doc.id)}
                  data-testid={DOCUMENT_CATALOG_IDS.rowExpand(doc.id)}
                  onClick={onToggleExpand(doc.id)}
                >
                  <ChevronDown size={14} />
                </ExpandButton>
              </CellCenter>
            ) : null,
    },
    {
      key: 'name',
      width: isDistribution ? '2fr' : '3fr',
      header: 'שם המסמך',
      align: 'right',
      cell: (doc) => <NameCell $child={isChild}>{doc.name}</NameCell>,
    },
  ];

  if (isAllDocs) {
    columns.push(
      {
        key: 'env',
        width: '1fr',
        header: 'סביבה',
        cell: (doc) => <MetaCell $muted={isChild}>{doc.env}</MetaCell>,
      },
      {
        key: 'dept',
        width: '1fr',
        header: 'מחלקה',
        cell: (doc) => <MetaCell $muted={isChild}>{doc.dept}</MetaCell>,
      },
    );
  }

  columns.push(
    {
      key: 'orderNum',
      width: '1fr',
      header: 'מס׳ פקודה',
      cell: (doc) => <MetaCell $muted={isChild}>{doc.orderNum}</MetaCell>,
    },
    {
      key: 'updateNum',
      width: '1fr',
      header: 'עדכון',
      cell: (doc) => (
        <MetaCell $size={isChild ? 'xs' : 'sm'} $muted={isChild}>
          {doc.updateNum}
        </MetaCell>
      ),
    },
    {
      key: 'effectiveDate',
      width: '1fr',
      header: DATE_HEADER[tab],
      cell: (doc) => (
        <MetaCell $size={isChild ? 'xs' : 'sm'} $muted={isChild}>
          {doc.effectiveDate}
        </MetaCell>
      ),
    },
    {
      key: 'refNum',
      width: '1fr',
      header: 'מס׳ סימוכין',
      cell: (doc) => <MetaCell $muted>{doc.refNum}</MetaCell>,
    },
  );

  if (isDistribution) {
    columns.push({
      key: 'approvedBy',
      width: '1fr',
      header: 'אושר ע״י',
      cell: (doc) => (
        <MetaCell $size={isChild ? 'xs' : 'sm'} $muted={false}>
          {doc.approvedBy}
        </MetaCell>
      ),
    });
  }

  columns.push({
    key: 'status',
    width: '1fr',
    header: 'סטטוס',
    cell: (doc) => (
      <StatusCell>
        <StatusDot $color={statusInk(doc.status)} />
        <StatusText $child={isChild}>{doc.status}</StatusText>
      </StatusCell>
    ),
  });

  if (isDistribution) {
    columns.push(
      {
        key: 'receipt',
        width: '1fr',
        header: 'וידוא קבלה',
        // A document with nobody to confirm receipt shows a dash and does
        // nothing; anything else opens the per-HML breakdown.
        cell: isChild
          ? undefined
          : (doc) =>
              doc.receiptStatus ? (
                <ReceiptLink
                  type="button"
                  data-testid={DOCUMENT_CATALOG_IDS.rowReceipt(doc.id)}
                  onClick={onReceiptClick(doc)}
                >
                  {doc.receiptStatus}
                </ReceiptLink>
              ) : (
                <ReceiptEmpty>{NO_RECEIPT}</ReceiptEmpty>
              ),
      },
      {
        key: 'reshare',
        width: '1fr',
        cell: isChild
          ? undefined
          : (doc) =>
              doc.hasNewViewers ? (
                <ReshareCell>
                  <ReshareLabel data-reshare-label>{NEW_VIEWERS_LABEL}</ReshareLabel>
                  <ReshareButton
                    type="button"
                    data-reshare-btn
                    data-testid={DOCUMENT_CATALOG_IDS.rowReshare(doc.id)}
                    onClick={onReshareClick(doc)}
                  >
                    {RESHARE_LABEL}
                  </ReshareButton>
                </ReshareCell>
              ) : null,
      },
    );
  }

  columns.push({
    key: 'actions',
    width: '2.5rem',
    cell: isChild
      ? undefined
      : (doc) => (
          <RowActions data-row-actions>
            <RowActionButton
              type="button"
              title={HISTORY_TITLE}
              data-testid={DOCUMENT_CATALOG_IDS.rowHistory(doc.id)}
              onClick={onHistoryClick(doc)}
            >
              <Clock size={14} />
            </RowActionButton>
            <RowActionButton
              type="button"
              title={ACTIONS_TITLE}
              data-testid={DOCUMENT_CATALOG_IDS.rowMenu(doc.id)}
              onClick={onMenuClick(doc)}
            >
              <MoreHorizontal size={14} />
            </RowActionButton>
          </RowActions>
        ),
  });

  return columns;
};
