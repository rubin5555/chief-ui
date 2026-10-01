import { useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { ModalHandle } from '@/components/ui/Modal';
import { Modal } from '@/components/ui/Modal';
import { RIBBON_MARKER_ATTR } from '../../../EditorRibbon/EditorRibbon.constants';
import { CellPropsForm } from './components/CellPropsForm';
import { TablePropsForm } from './components/TablePropsForm';
import { CELL_PROPS_DEFAULT, MODAL_WIDTH } from './TablePropsModal.constants';
import { TABLE_PROPS_MODAL_IDS } from './TablePropsModal.testids';
import type { CellPropsDraft, TablePropsDraft, TablePropsTarget } from './TablePropsModal.types';
import {
  applyCellProps,
  applyTableProps,
  readCellProps,
  readTableProps,
} from './TablePropsModal.utils';

export interface TablePropsModalProps {
  target: TablePropsTarget;
  table: HTMLTableElement;
  cell: HTMLTableCellElement | null;
  onSaved: () => void;
  onClose: () => void;
}

export const TablePropsModal = ({
  target,
  table,
  cell,
  onSaved,
  onClose,
}: TablePropsModalProps) => {
  const modalRef = useRef<ModalHandle>(null);
  const [cellDraft, setCellDraft] = useState<CellPropsDraft>(() =>
    cell ? readCellProps(cell) : CELL_PROPS_DEFAULT,
  );
  const [tableDraft, setTableDraft] = useState<TablePropsDraft>(() => readTableProps(table));

  const handleCancel = () => modalRef.current?.requestClose();

  const handleSave = () => {
    if (target === 'cell') {
      if (cell) applyCellProps(cell, cellDraft);
    } else {
      applyTableProps(table, tableDraft);
    }
    onSaved();
    modalRef.current?.requestClose();
  };

  return (
    <Modal
      ref={modalRef}
      title={target === 'cell' ? 'מאפייני תא' : 'מאפייני טבלה'}
      width={MODAL_WIDTH}
      onClose={onClose}
      // The dialog belongs to the editor's toolbar, and the section must not
      // hand its lock back the moment focus lands in here.
      overlayAttrs={{ [RIBBON_MARKER_ATTR]: '' }}
      footerAlign="between"
      footer={
        <>
          <Button
            type="button"
            variant="ghost"
            onClick={handleCancel}
            data-testid={TABLE_PROPS_MODAL_IDS.cancelBtn}
          >
            ביטול
          </Button>
          <Button type="button" onClick={handleSave} data-testid={TABLE_PROPS_MODAL_IDS.saveBtn}>
            שמור
          </Button>
        </>
      }
      data-testid={TABLE_PROPS_MODAL_IDS.root}
    >
      {target === 'cell' ? (
        <CellPropsForm draft={cellDraft} onChange={setCellDraft} />
      ) : (
        <TablePropsForm draft={tableDraft} onChange={setTableDraft} />
      )}
    </Modal>
  );
};
