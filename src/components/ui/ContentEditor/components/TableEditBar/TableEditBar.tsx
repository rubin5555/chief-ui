import { Settings, Settings2, TableCellsMerge, TableCellsSplit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ModalPortal } from '@/components/ui/ModalPortal';
import type { TinyMceEditor } from '../../ContentEditor.types';
import { keepSelection } from '../../utils/keepSelection';
import { RIBBON_MARKER_ATTR } from '../EditorRibbon/EditorRibbon.constants';
import { TableGridIcon } from './components/TableGridIcon';
import type { TablePropsTarget } from './components/TablePropsModal';
import { TablePropsModal } from './components/TablePropsModal';
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

interface PropsDialog {
  target: TablePropsTarget;
  table: HTMLElement;
  cell: HTMLTableCellElement | null;
}

export const TableEditBar = ({ editor }: TableEditBarProps) => {
  const table = useActiveTable(editor);
  const [bar, setBar] = useState<HTMLDivElement | null>(null);
  const [dialog, setDialog] = useState<PropsDialog | null>(null);
  // Whatever was being described is preserved while the dialog is open so
  // it never unmounts prematurely when focus moves into the modal inputs.
  const activeTable = table ?? dialog?.table ?? null;
  const anchor = useTableAnchor(activeTable, bar);
  const openDialog = dialog && activeTable && dialog.table === activeTable ? dialog : null;

  if (!editor || !activeTable) return null;

  const run = (command: string) => () => editor.execCommand(command);

  const openProps = (target: TablePropsTarget) => () => {
    const node = editor.selection.getNode();
    const cell = (editor.dom.getParent(node, 'td,th') ||
      activeTable.querySelector('td,th')) as HTMLTableCellElement | null;
    setDialog({
      target,
      table: activeTable,
      cell,
    });
  };

  const closeProps = () => setDialog(null);

  // The properties are written straight onto the elements, which is a change
  // TinyMCE only learns about when it is told to take a snapshot.
  const handleSaved = () => {
    editor.undoManager.add();
    editor.nodeChanged();
  };

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
        ref={setBar}
        $top={anchor?.top ?? 0}
        $left={anchor?.left ?? 0}
        $ready={anchor !== null}
        {...{ [RIBBON_MARKER_ATTR]: '' }}
        data-testid={TABLE_EDIT_BAR_IDS.root}
      >
        <BarArrow $flipped={anchor?.flipped ?? false} />

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
          onClick={openProps('cell')}
          data-testid={TABLE_EDIT_BAR_IDS.action('cell-props')}
        >
          <Settings size={ICON_SIZE} aria-hidden="true" />
        </BarAction>
        <BarAction
          type="button"
          title="מאפייני טבלה"
          aria-label="מאפייני טבלה"
          onMouseDown={keepSelection}
          onClick={openProps('table')}
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

      {openDialog && (
        <TablePropsModal
          target={openDialog.target}
          table={activeTable as HTMLTableElement}
          cell={openDialog.cell}
          onSaved={handleSaved}
          onClose={closeProps}
        />
      )}
    </ModalPortal>
  );
};
