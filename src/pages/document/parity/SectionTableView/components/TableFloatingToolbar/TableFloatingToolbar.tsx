import {
  Settings,
  Settings2,
  SplitSquareHorizontal,
  SplitSquareVertical,
  TableCellsMerge,
  TableCellsSplit,
  Trash2,
  WrapText,
} from 'lucide-react';
import type { MouseEvent, RefObject } from 'react';
import { SECTION_TABLE_VIEW_IDS } from '../../SectionTableView.testids';
import { TableGridIcon } from './components/TableGridIcon';
import {
  ToolbarAction,
  ToolbarArrow,
  ToolbarDivider,
  ToolbarRoot,
} from './TableFloatingToolbar.styles';
import { useToolbarAnchor } from './useToolbarAnchor';

const ICON_SIZE = 14;

export interface TableFloatingToolbarProps {
  anchorRef: RefObject<HTMLElement | null>;
  onInsertRowBefore: () => void;
  onInsertRowAfter: () => void;
  onDeleteRow: () => void;
  onInsertColumnBefore: () => void;
  onInsertColumnAfter: () => void;
  onDeleteColumn: () => void;
  onOpenCellProps: () => void;
  onOpenTableProps: () => void;
  onDeleteTable: () => void;
}

export const TableFloatingToolbar = ({
  anchorRef,
  onInsertRowBefore,
  onInsertRowAfter,
  onDeleteRow,
  onInsertColumnBefore,
  onInsertColumnAfter,
  onDeleteColumn,
  onOpenCellProps,
  onOpenTableProps,
  onDeleteTable,
}: TableFloatingToolbarProps) => {
  const anchor = useToolbarAnchor(anchorRef, true);

  const handleMouseDown = (event: MouseEvent) => event.preventDefault();

  if (!anchor) return null;

  return (
    <ToolbarRoot
      $top={anchor.top}
      $left={anchor.left}
      $width={anchor.width}
      onMouseDown={handleMouseDown}
      data-testid={SECTION_TABLE_VIEW_IDS.toolbar}
    >
      <ToolbarArrow />

      <ToolbarAction
        type="button"
        title="הוסף שורה מעל"
        aria-label="הוסף שורה מעל"
        onClick={onInsertRowBefore}
        data-testid={SECTION_TABLE_VIEW_IDS.toolbarAction('row-before')}
      >
        <TableGridIcon variant="row-before" />
      </ToolbarAction>
      <ToolbarAction
        type="button"
        title="הוסף שורה מתחת"
        aria-label="הוסף שורה מתחת"
        onClick={onInsertRowAfter}
        data-testid={SECTION_TABLE_VIEW_IDS.toolbarAction('row-after')}
      >
        <TableGridIcon variant="row-after" />
      </ToolbarAction>
      <ToolbarAction
        type="button"
        $danger
        title="מחק שורה"
        aria-label="מחק שורה"
        onClick={onDeleteRow}
        data-testid={SECTION_TABLE_VIEW_IDS.toolbarAction('row-delete')}
      >
        <TableGridIcon variant="row-delete" />
      </ToolbarAction>

      <ToolbarDivider />

      <ToolbarAction
        type="button"
        title="הוסף עמודה לפני"
        aria-label="הוסף עמודה לפני"
        onClick={onInsertColumnBefore}
        data-testid={SECTION_TABLE_VIEW_IDS.toolbarAction('col-before')}
      >
        <TableGridIcon variant="col-before" />
      </ToolbarAction>
      <ToolbarAction
        type="button"
        title="הוסף עמודה אחרי"
        aria-label="הוסף עמודה אחרי"
        onClick={onInsertColumnAfter}
        data-testid={SECTION_TABLE_VIEW_IDS.toolbarAction('col-after')}
      >
        <TableGridIcon variant="col-after" />
      </ToolbarAction>
      <ToolbarAction
        type="button"
        $danger
        title="מחק עמודה"
        aria-label="מחק עמודה"
        onClick={onDeleteColumn}
        data-testid={SECTION_TABLE_VIEW_IDS.toolbarAction('col-delete')}
      >
        <TableGridIcon variant="col-delete" />
      </ToolbarAction>

      <ToolbarDivider />

      <ToolbarAction type="button" title="מזג תאים" aria-label="מזג תאים">
        <TableCellsMerge size={ICON_SIZE} aria-hidden="true" />
      </ToolbarAction>
      <ToolbarAction type="button" title="פצל תא" aria-label="פצל תא">
        <TableCellsSplit size={ICON_SIZE} aria-hidden="true" />
      </ToolbarAction>
      <ToolbarAction type="button" title="פצל תא אנכית" aria-label="פצל תא אנכית">
        <SplitSquareVertical size={ICON_SIZE} aria-hidden="true" />
      </ToolbarAction>
      <ToolbarAction type="button" title="פצל תא אופקית" aria-label="פצל תא אופקית">
        <SplitSquareHorizontal size={ICON_SIZE} aria-hidden="true" />
      </ToolbarAction>

      <ToolbarDivider />

      <ToolbarAction type="button" title="שבירת מילים בטבלה" aria-label="שבירת מילים בטבלה">
        <WrapText size={ICON_SIZE} aria-hidden="true" />
      </ToolbarAction>
      <ToolbarAction
        type="button"
        title="מאפייני תא"
        aria-label="מאפייני תא"
        onClick={onOpenCellProps}
        data-testid={SECTION_TABLE_VIEW_IDS.toolbarAction('cell-props')}
      >
        <Settings size={ICON_SIZE} aria-hidden="true" />
      </ToolbarAction>
      <ToolbarAction
        type="button"
        title="מאפייני טבלה"
        aria-label="מאפייני טבלה"
        onClick={onOpenTableProps}
        data-testid={SECTION_TABLE_VIEW_IDS.toolbarAction('table-props')}
      >
        <Settings2 size={ICON_SIZE} aria-hidden="true" />
      </ToolbarAction>

      <ToolbarDivider />

      <ToolbarAction
        type="button"
        $danger
        title="מחק טבלה"
        aria-label="מחק טבלה"
        onClick={onDeleteTable}
        data-testid={SECTION_TABLE_VIEW_IDS.toolbarAction('table-delete')}
      >
        <Trash2 size={ICON_SIZE} aria-hidden="true" />
      </ToolbarAction>
    </ToolbarRoot>
  );
};
