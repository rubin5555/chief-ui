import { useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { ModalHandle } from '@/components/ui/Modal';
import { Modal } from '@/components/ui/Modal';
import { SECTION_TABLE_VIEW_IDS } from '../../SectionTableView.testids';
import type { CellProps, PropsPanelKind, TableProps } from '../../sectionTableView.types';
import { CellPropsFields } from './components/CellPropsFields';
import { TablePropsFields } from './components/TablePropsFields';
import { FieldStack } from './TablePropsPanel.styles';

export interface TablePropsPanelProps {
  kind: PropsPanelKind;
  cellProps: CellProps;
  tableProps: TableProps;
  onSaveCell: (props: CellProps) => void;
  onSaveTable: (props: TableProps) => void;
  onClose: () => void;
}

export const TablePropsPanel = ({
  kind,
  cellProps,
  tableProps,
  onSaveCell,
  onSaveTable,
  onClose,
}: TablePropsPanelProps) => {
  const modalRef = useRef<ModalHandle>(null);
  const [cellDraft, setCellDraft] = useState(cellProps);
  const [tableDraft, setTableDraft] = useState(tableProps);

  const handleSave = () => {
    if (kind === 'cell') onSaveCell(cellDraft);
    else onSaveTable(tableDraft);
    modalRef.current?.requestClose();
  };

  const handleCancel = () => modalRef.current?.requestClose();

  return (
    <Modal
      ref={modalRef}
      title={kind === 'cell' ? 'מאפייני תא' : 'מאפייני טבלה'}
      width={380}
      footerAlign="between"
      onClose={onClose}
      data-testid={SECTION_TABLE_VIEW_IDS.propsPanel}
      footer={
        <>
          <Button type="button" variant="ghost" size="sm" onClick={handleCancel}>
            ביטול
          </Button>
          <Button type="button" size="sm" onClick={handleSave}>
            שמור
          </Button>
        </>
      }
    >
      <FieldStack>
        {kind === 'cell' ? (
          <CellPropsFields draft={cellDraft} onChange={setCellDraft} />
        ) : (
          <TablePropsFields draft={tableDraft} onChange={setTableDraft} />
        )}
      </FieldStack>
    </Modal>
  );
};
