import { ChevronDown, Table2 } from 'lucide-react';
import { useState } from 'react';
import { FloatingPanel } from '@/components/ui/FloatingPanel';
import { useFloatingPanel } from '@/hooks/useFloatingPanel';
import { TOOLBAR_ICON_SIZE } from '../../DocToolbar.constants';
import { DOC_TOOLBAR_IDS } from '../../DocToolbar.testids';
import { EMPTY_LABEL, GRID_SIDE, PICKER_WIDTH } from './TableSizePicker.constants';
import { PickerBody, SizeCell, SizeGrid, SizeLabel, TableTrigger } from './TableSizePicker.styles';

export interface TableSizePickerProps {
  onInsert: (rows: number, cols: number) => void;
}

// The hovered corner of an 8×8 grid picks a table's dimensions (Edit.tsx:
// 1407-1437). main dispatches a global `insert-table` CustomEvent from here and
// catches it with a `useEffect` in the page; this calls a prop, because the two
// ends are eight lines apart and an event bus between them buys nothing.
export const TableSizePicker = ({ onInsert }: TableSizePickerProps) => {
  const panel = useFloatingPanel<HTMLButtonElement>();
  const [hover, setHover] = useState<{ rows: number; cols: number } | null>(null);

  const handleToggle = () => {
    setHover(null);
    panel.toggle((rect) => ({
      top: rect.bottom + 4,
      left: rect.left + rect.width / 2 - PICKER_WIDTH / 2,
    }));
  };

  const handleHover = (rows: number, cols: number) => () => setHover({ rows, cols });
  const handleLeaveGrid = () => setHover(null);

  const handlePick = (rows: number, cols: number) => () => {
    setHover(null);
    panel.close();
    onInsert(rows, cols);
  };

  // 1-based, because "3 × 4" counts rows and columns, not offsets.
  const cells = Array.from({ length: GRID_SIDE * GRID_SIDE }, (_, index) => ({
    row: Math.floor(index / GRID_SIDE) + 1,
    col: (index % GRID_SIDE) + 1,
  }));

  return (
    <>
      <TableTrigger
        ref={panel.btnRef}
        type="button"
        title="הוספת טבלה"
        aria-label="הוספת טבלה"
        $active={panel.open}
        onClick={handleToggle}
        data-testid={DOC_TOOLBAR_IDS.tableTrigger}
      >
        <Table2 size={TOOLBAR_ICON_SIZE} aria-hidden="true" />
        <ChevronDown size={TOOLBAR_ICON_SIZE - 4} opacity={0.6} aria-hidden="true" />
      </TableTrigger>

      {panel.open && panel.pos && (
        <FloatingPanel
          ref={panel.panelRef}
          pos={panel.pos}
          width={PICKER_WIDTH}
          data-testid={DOC_TOOLBAR_IDS.tableSizePicker}
        >
          <PickerBody>
            <SizeGrid onMouseLeave={handleLeaveGrid}>
              {cells.map(({ row, col }) => (
                <SizeCell
                  key={`${row}-${col}`}
                  type="button"
                  aria-label={`${row} × ${col}`}
                  $lit={!!hover && col <= hover.cols && row <= hover.rows}
                  onMouseEnter={handleHover(row, col)}
                  onFocus={handleHover(row, col)}
                  onClick={handlePick(row, col)}
                  data-testid={DOC_TOOLBAR_IDS.tableSizeCell(row, col)}
                />
              ))}
            </SizeGrid>
            <SizeLabel>{hover ? `${hover.rows} × ${hover.cols}` : EMPTY_LABEL}</SizeLabel>
          </PickerBody>
        </FloatingPanel>
      )}
    </>
  );
};
