import { useVirtualizer } from '@tanstack/react-virtual';
import type { ReactNode } from 'react';
import { useRef } from 'react';
import { renderBodyCells, renderHeaderCells } from './GridTable.cells';
import { GridTableContext } from './GridTable.context';
import { TableHeader, TableScrollBody, VirtualRow, VirtualScrollSpacer } from './GridTable.styles';
import type { ColumnDef, RowConfig } from './GridTable.types';
import { gridTemplateOf } from './GridTable.types';
import { GridTableRow } from './GridTableRow';

const DEFAULT_ROW_HEIGHT = 44;
const ROW_OVERSCAN = 8;

interface GridTableProps<T> {
  columns: ColumnDef<T>[];
  items: T[];
  getRowKey: (item: T, index: number) => string | number;
  row?: (item: T, index: number) => RowConfig;
  estimateRowHeight?: number;
  emptyState?: ReactNode;
}

export const GridTable = <T,>({
  columns,
  items,
  getRowKey,
  row,
  estimateRowHeight = DEFAULT_ROW_HEIGHT,
  emptyState,
}: GridTableProps<T>) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const template = gridTemplateOf(columns);

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => estimateRowHeight,
    overscan: ROW_OVERSCAN,
    getItemKey: (index) => getRowKey(items[index], index),
  });

  return (
    <GridTableContext.Provider value={template}>
      <TableScrollBody ref={scrollRef}>
        <TableHeader $columns={template}>{renderHeaderCells(columns)}</TableHeader>
        {items.length === 0 ? (
          emptyState
        ) : (
          <VirtualScrollSpacer $totalSize={rowVirtualizer.getTotalSize()}>
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const item = items[virtualRow.index];
              return (
                <VirtualRow
                  key={virtualRow.key}
                  data-index={virtualRow.index}
                  ref={rowVirtualizer.measureElement}
                  $start={virtualRow.start}
                >
                  <GridTableRow {...row?.(item, virtualRow.index)}>
                    {renderBodyCells(columns, item, virtualRow.index)}
                  </GridTableRow>
                </VirtualRow>
              );
            })}
          </VirtualScrollSpacer>
        )}
      </TableScrollBody>
    </GridTableContext.Provider>
  );
};
