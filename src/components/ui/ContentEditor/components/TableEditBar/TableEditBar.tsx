import { Settings, Settings2, TableCellsMerge, TableCellsSplit, Trash2 } from 'lucide-react';
import type { MouseEvent } from 'react';
import { ModalPortal } from '@/components/ui/ModalPortal';
import type { TinyMceEditor } from '../../ContentEditor.types';
import { RIBBON_MARKER_ATTR } from '../EditorRibbon/EditorRibbon.constants';
import { TableGridIcon } from './components/TableGridIcon';
import {
  COLUMN_ACTIONS,
  ICON_SIZE,
  ROW_ACTIONS,
  type TableBarAction,
} from './TableEditBar.constants';
import { BarAction, BarArrow, BarDivider, BarRoot } from './TableEditBar.styles';
import { TABLE_EDIT_BAR_IDS } from './TableEditBar.testids';
import { useActiveTable } from './useActiveTable';
import { useTableAnchor } from './useTableAnchor';

export interface TableEditBarProps {
  editor: TinyMceEditor | null;
}

const keepSelection = (event: MouseEvent) => event.preventDefault();

export const TableEditBar = ({ editor }: TableEditBarProps) => {
  const table = useActiveTable(editor);
  const anchor = useTableAnchor(table);

  if (!editor || !anchor) return null;

  const run = (command: string) => () => editor.execCommand(command);

  const renderAction = ({ id, title, command, glyph, danger }: TableBarAction) => (
    <BarAction
      key={id}
      type="button"
      $danger={danger}
      title={title}
      aria-label={title}
      onMouseDown={keepSelection}
      onClick={run(command)}
      data-testid={TABLE_EDIT_BAR_IDS.action(id)}
    >
      {glyph && <TableGridIcon variant={glyph} />}
    </BarAction>
  );

  return (
    <ModalPortal>
      <BarRoot
        style={{ top: anchor.top, left: anchor.left, width: anchor.width }}
        {...{ [RIBBON_MARKER_ATTR]: '' }}
        data-testid={TABLE_EDIT_BAR_IDS.root}
      >
        <BarArrow />

        {ROW_ACTIONS.map(renderAction)}
        <BarDivider />
        {COLUMN_ACTIONS.map(renderAction)}
        <BarDivider />

        <BarAction
          type="button"
          title="מזג תאים"
          aria-label="מזג תאים"
          onMouseDown={keepSelection}
          onClick={run('mceTableMergeCells')}
          data-testid={TABLE_EDIT_BAR_IDS.action('merge')}
        >
          <TableCellsMerge size={ICON_SIZE} aria-hidden="true" />
        </BarAction>
        <BarAction
          type="button"
          title="פצל תא"
          aria-label="פצל תא"
          onMouseDown={keepSelection}
          onClick={run('mceTableSplitCells')}
          data-testid={TABLE_EDIT_BAR_IDS.action('split')}
        >
          <TableCellsSplit size={ICON_SIZE} aria-hidden="true" />
        </BarAction>

        <BarDivider />

        <BarAction
          type="button"
          title="מאפייני תא"
          aria-label="מאפייני תא"
          onMouseDown={keepSelection}
          onClick={run('mceTableCellProps')}
          data-testid={TABLE_EDIT_BAR_IDS.action('cell-props')}
        >
          <Settings size={ICON_SIZE} aria-hidden="true" />
        </BarAction>
        <BarAction
          type="button"
          title="מאפייני טבלה"
          aria-label="מאפייני טבלה"
          onMouseDown={keepSelection}
          onClick={run('mceTableProps')}
          data-testid={TABLE_EDIT_BAR_IDS.action('table-props')}
        >
          <Settings2 size={ICON_SIZE} aria-hidden="true" />
        </BarAction>

        <BarDivider />

        <BarAction
          type="button"
          $danger
          title="מחק טבלה"
          aria-label="מחק טבלה"
          onMouseDown={keepSelection}
          onClick={run('mceTableDelete')}
          data-testid={TABLE_EDIT_BAR_IDS.action('table-delete')}
        >
          <Trash2 size={ICON_SIZE} aria-hidden="true" />
        </BarAction>
      </BarRoot>
    </ModalPortal>
  );
};
