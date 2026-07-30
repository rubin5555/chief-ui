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

// Pressing the strip must not blur the cell it is acting on — the bar would
// unmount under the pointer before the click landed. Same rule as the ribbon's.
const keepSelection = (event: MouseEvent) => event.preventDefault();

/**
 * The strip that appears under a table while the caret is in one.
 *
 * TinyMCE has a table context toolbar of its own, and it is switched off
 * (`table_toolbar: ''`, see ContentEditor.constants) — it is skin chrome in the
 * middle of a document whose every other control is drawn by this app. This is
 * main's strip (Edit.tsx:984-1073) in its place, running the same table commands
 * TinyMCE's own buttons would have run.
 *
 * It renders nothing at all when the caret is elsewhere. There is no "disabled"
 * state to design, because a table bar with no table is not a thing anyone should
 * be looking at.
 */
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

        {/* These two open TinyMCE's own dialogs, which are the only editor chrome
            left on screen. They are worth keeping: each is a full properties form
            — borders, widths, alignment, cell type — and main's equivalent was a
            hand-rolled card whose fields wrote nowhere. */}
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
