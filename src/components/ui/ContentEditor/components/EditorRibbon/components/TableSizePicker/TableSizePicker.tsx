import { ChevronDown, Table2 } from 'lucide-react';
import { useState } from 'react';
import { FloatingPanel } from '@/components/ui/FloatingPanel';
import { useFloatingPanel } from '@/hooks/useFloatingPanel';
import { keepSelection } from '../../../../utils/keepSelection';
import { RIBBON_MARKER_ATTR, TOOLBAR_ICON_SIZE } from '../../EditorRibbon.constants';
import { EDITOR_RIBBON_IDS } from '../../EditorRibbon.testids';
import { EMPTY_LABEL, GRID_SIDE, PICKER_WIDTH } from './TableSizePicker.constants';
import { PickerBody, SizeCell, SizeGrid, SizeLabel, TableTrigger } from './TableSizePicker.styles';

export interface TableSizePickerProps {
  disabled: boolean;
  onInsert: (rows: number, cols: number) => void;
}

export const TableSizePicker = ({ disabled, onInsert }: TableSizePickerProps) => {
  const panel = useFloatingPanel<HTMLButtonElement>({ focusOnOpen: true });
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
        disabled={disabled}
        $active={panel.open}
        onMouseDown={keepSelection}
        onClick={handleToggle}
        data-testid={EDITOR_RIBBON_IDS.tableTrigger}
      >
        <Table2 size={TOOLBAR_ICON_SIZE} aria-hidden="true" />
        <ChevronDown size={TOOLBAR_ICON_SIZE - 4} opacity={0.6} aria-hidden="true" />
      </TableTrigger>

      {panel.open && panel.pos && (
        <FloatingPanel
          ref={panel.panelRef}
          pos={panel.pos}
          width={PICKER_WIDTH}
          {...{ [RIBBON_MARKER_ATTR]: '' }}
          data-testid={EDITOR_RIBBON_IDS.tableSizePicker}
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
                  data-testid={EDITOR_RIBBON_IDS.tableSizeCell(row, col)}
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
