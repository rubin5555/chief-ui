import { useVirtualizer } from '@tanstack/react-virtual';
import type { ReactNode } from 'react';
import { useRef } from 'react';
import { SubTableContext } from './SubTable.context';
import {
  SubTableHeader,
  SubTableScrollViewport,
  SubTableVirtualRow,
  SubTableVirtualSpacer,
} from './SubTable.styles';

const DEFAULT_ROW_HEIGHT = 32;
const DEFAULT_MAX_HEIGHT = 240;
const ROW_OVERSCAN = 8;

interface SubTableProps<T> {
  columns: string;
  headers: ReactNode[];
  items: T[];
  getRowKey: (item: T, index: number) => string | number;
  renderRow: (item: T, index: number) => ReactNode;
  estimateRowHeight?: number;
  maxHeight?: number;
}

export const SubTable = <T,>({
  columns,
  headers,
  items,
  getRowKey,
  renderRow,
  estimateRowHeight = DEFAULT_ROW_HEIGHT,
  maxHeight = DEFAULT_MAX_HEIGHT,
}: SubTableProps<T>) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => estimateRowHeight,
    overscan: ROW_OVERSCAN,
    getItemKey: (index) => getRowKey(items[index], index),
  });

  return (
    <SubTableContext.Provider value={columns}>
      <SubTableHeader $columns={columns}>
        {headers.map((header, i) => (
          <span key={i}>{header}</span>
        ))}
      </SubTableHeader>
      <SubTableScrollViewport ref={scrollRef} $maxHeight={maxHeight}>
        <SubTableVirtualSpacer $totalSize={rowVirtualizer.getTotalSize()}>
          {rowVirtualizer.getVirtualItems().map((virtualRow) => (
            <SubTableVirtualRow
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={rowVirtualizer.measureElement}
              $start={virtualRow.start}
            >
              {renderRow(items[virtualRow.index], virtualRow.index)}
            </SubTableVirtualRow>
          ))}
        </SubTableVirtualSpacer>
      </SubTableScrollViewport>
    </SubTableContext.Provider>
  );
};
