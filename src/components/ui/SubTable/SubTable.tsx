import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';
import { renderBodyCells, renderHeaderCells } from '../GridTable/GridTable.cells';
import type { ColumnDef } from '../GridTable/GridTable.types';
import { gridTemplateOf } from '../GridTable/GridTable.types';
import { SubTableContext } from './SubTable.context';
import {
  SubTableHeader,
  SubTableScrollViewport,
  SubTableVirtualRow,
  SubTableVirtualSpacer,
} from './SubTable.styles';
import { SubTableRow } from './SubTableRow';

const DEFAULT_ROW_HEIGHT = 32;
const DEFAULT_MAX_HEIGHT = 240;
const ROW_OVERSCAN = 8;

interface SubTableProps<T> {
  columns: ColumnDef<T>[];
  items: T[];
  getRowKey: (item: T, index: number) => string | number;
  estimateRowHeight?: number;
  maxHeight?: number;
}

export const SubTable = <T,>({
  columns,
  items,
  getRowKey,
  estimateRowHeight = DEFAULT_ROW_HEIGHT,
  maxHeight = DEFAULT_MAX_HEIGHT,
}: SubTableProps<T>) => {
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
    <SubTableContext.Provider value={template}>
      <SubTableHeader $columns={template}>{renderHeaderCells(columns)}</SubTableHeader>
      <SubTableScrollViewport ref={scrollRef} $maxHeight={maxHeight}>
        <SubTableVirtualSpacer $totalSize={rowVirtualizer.getTotalSize()}>
          {rowVirtualizer.getVirtualItems().map((virtualRow) => (
            <SubTableVirtualRow
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={rowVirtualizer.measureElement}
              $start={virtualRow.start}
            >
              <SubTableRow>
                {renderBodyCells(columns, items[virtualRow.index], virtualRow.index)}
              </SubTableRow>
            </SubTableVirtualRow>
          ))}
        </SubTableVirtualSpacer>
      </SubTableScrollViewport>
    </SubTableContext.Provider>
  );
};
