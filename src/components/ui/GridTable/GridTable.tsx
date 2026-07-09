import { useVirtualizer } from '@tanstack/react-virtual';
import type { ReactNode } from 'react';
import { useRef } from 'react';
import { GridTableContext } from './GridTable.context';
import { TableHeader, TableScrollBody, VirtualRow, VirtualScrollSpacer } from './GridTable.styles';

const DEFAULT_ROW_HEIGHT = 44;
const ROW_OVERSCAN = 8;

interface GridTableProps<T> {
  columns: string;
  headers: ReactNode[];
  items: T[];
  getRowKey: (item: T, index: number) => string | number;
  renderRow: (item: T, index: number) => ReactNode;
  estimateRowHeight?: number;
  emptyState?: ReactNode;
}

export const GridTable = <T,>({
  columns,
  headers,
  items,
  getRowKey,
  renderRow,
  estimateRowHeight = DEFAULT_ROW_HEIGHT,
  emptyState,
}: GridTableProps<T>) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => estimateRowHeight,
    overscan: ROW_OVERSCAN,
    getItemKey: (index) => getRowKey(items[index], index),
  });

  return (
    <GridTableContext.Provider value={columns}>
      <TableScrollBody ref={scrollRef}>
        <TableHeader $columns={columns}>
          {headers.map((header, i) => (
            <span key={i}>{header}</span>
          ))}
        </TableHeader>
        {items.length === 0 ? (
          emptyState
        ) : (
          <VirtualScrollSpacer $totalSize={rowVirtualizer.getTotalSize()}>
            {rowVirtualizer.getVirtualItems().map((virtualRow) => (
              <VirtualRow
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={rowVirtualizer.measureElement}
                $start={virtualRow.start}
              >
                {renderRow(items[virtualRow.index], virtualRow.index)}
              </VirtualRow>
            ))}
          </VirtualScrollSpacer>
        )}
      </TableScrollBody>
    </GridTableContext.Provider>
  );
};
