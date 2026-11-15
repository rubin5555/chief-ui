'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Table, Settings2, Rows, Code2, Sparkles, Check } from 'lucide-react';
import {
  ActiveModalType,
  CellProperties,
  RowProperties,
  TableProperties,
} from './types';
import { EditorTranslations, defaultTranslations } from './i18n';
import { TablePropsDialog } from './modals/TablePropsDialog';
import { CellPropsDialog } from './modals/CellPropsDialog';
import { RowPropsDialog } from './modals/RowPropsDialog';
import { CustomTableDialog } from './modals/CustomTableDialog';
import { HtmlSourceDialog, formatHTMLPretty } from './modals/HtmlSourceDialog';

interface TablePropertiesModalProps {
  activeModal: ActiveModalType;
  selectedCellCount: number;
  translations?: EditorTranslations;
  initialTableProps: TableProperties | null;
  initialCellProps: CellProperties | null;
  initialRowProps: RowProperties | null;
  initialSourceHTML: string;
  onClose: () => void;
  onSaveTableProps: (props: TableProperties) => void;
  onSaveCellProps: (props: CellProperties) => void;
  onSaveRowProps: (props: RowProperties) => void;
  onSaveSourceHTML: (html: string) => void;
  onInsertCustomTable: (
    rows: number,
    cols: number,
    options: {
      withHeader: boolean;
      striped: boolean;
      width?: string;
      height?: string;
    }
  ) => void;
}

export const TablePropertiesModal: React.FC<TablePropertiesModalProps> = ({
  activeModal,
  selectedCellCount,
  translations = defaultTranslations,
  initialTableProps,
  initialCellProps,
  initialRowProps,
  initialSourceHTML,
  onClose,
  onSaveTableProps,
  onSaveCellProps,
  onSaveRowProps,
  onSaveSourceHTML,
  onInsertCustomTable,
}) => {
  const tMod = translations.modals;
  const tCommon = translations.common;
  const [tab, setTab] = useState<'general' | 'advanced'>('general');

  const [tableForm, setTableForm] = useState<TableProperties>({
    width: '100%',
    height: '',
    align: 'none',
    cellPadding: '10px 12px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#cbd5e1',
    backgroundColor: '',
    borderCollapse: 'collapse',
    borderSpacing: '0px',
    hasCaption: false,
    captionText: '',
    stripedRows: false,
    hoverHighlight: true,
  });

  const [cellForm, setCellForm] = useState<CellProperties>({
    width: '',
    height: '',
    cellType: 'td',
    scope: '',
    hAlign: '',
    vAlign: 'top',
    backgroundColor: '',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#cbd5e1',
    padding: '10px 12px',
    whiteSpace: 'normal',
  });

  const [rowForm, setRowForm] = useState<RowProperties>({
    rowType: 'tbody',
    height: '',
    hAlign: '',
    vAlign: '',
    backgroundColor: '',
    borderBottomColor: '#cbd5e1',
    borderBottomWidth: '',
    borderBottomStyle: '',
  });

  const [customRows, setCustomRows] = useState(4);
  const [customCols, setCustomCols] = useState(4);
  const [customWidth, setCustomWidth] = useState('100%');
  const [customHeight, setCustomHeight] = useState('');
  const [customWithHeader, setCustomWithHeader] = useState(true);
  const [customStriped, setCustomStriped] = useState(true);
  const [sourceCode, setSourceCode] = useState('');

  useEffect(() => {
    setTab('general');
    if (activeModal === 'table' && initialTableProps) {
      setTableForm(initialTableProps);
    } else if (activeModal === 'cell' && initialCellProps) {
      setCellForm(initialCellProps);
    } else if (activeModal === 'row' && initialRowProps) {
      setRowForm(initialRowProps);
    } else if (activeModal === 'source') {
      setSourceCode(formatHTMLPretty(initialSourceHTML));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeModal]);

  if (!activeModal || typeof document === 'undefined') return null;

  return createPortal(
    <div
      dir="rtl"
      data-editor-ribbon=""
      data-modal-container="true"
      data-testid="table-props-modal"
      style={{ zIndex: 99999 }}
      onMouseDown={(e) => {
        if ((e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'SELECT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
          e.stopPropagation();
        }
      }}
      className="tiny-quill-root fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs"
    >
      <div className="w-[520px] max-w-[95vw] max-h-[90vh] flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            {activeModal === 'table' && <Table className="h-5 w-5 text-blue-600" />}
            {activeModal === 'cell' && <Settings2 className="h-5 w-5 text-indigo-600" />}
            {activeModal === 'row' && <Rows className="h-5 w-5 text-emerald-600" />}
            {activeModal === 'source' && <Code2 className="h-5 w-5 text-slate-700" />}
            {activeModal === 'insert-custom-table' && (
              <Sparkles className="h-5 w-5 text-blue-600" />
            )}

            <h3 className="text-sm font-bold text-slate-800">
              {activeModal === 'table' && tMod.tablePropertiesTitle}
              {activeModal === 'cell' &&
                `${tMod.cellPropertiesTitle} (${selectedCellCount || 1})`}
              {activeModal === 'row' && tMod.rowPropertiesTitle}
              {activeModal === 'source' && tMod.htmlSourceTitle}
              {activeModal === 'insert-custom-table' && tMod.insertCustomTableTitle}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* General / Advanced Tabs for Table & Cell Modals */}
        {(activeModal === 'table' || activeModal === 'cell') && (
          <div className="flex border-b border-slate-200 bg-slate-50/50 px-5">
            <button
              type="button"
              onClick={() => setTab('general')}
              className={`border-b-2 px-4 py-2.5 text-xs font-semibold transition ${
                tab === 'general'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tMod.generalTab}
            </button>
            <button
              type="button"
              onClick={() => setTab('advanced')}
              className={`border-b-2 px-4 py-2.5 text-xs font-semibold transition ${
                tab === 'advanced'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tMod.advancedTab}
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="max-h-[70vh] overflow-y-auto p-5 text-xs text-slate-700">
          {activeModal === 'table' && (
            <TablePropsDialog
              tab={tab}
              form={tableForm}
              translations={translations}
              onChange={setTableForm}
            />
          )}

          {activeModal === 'cell' && (
            <CellPropsDialog
              tab={tab}
              form={cellForm}
              translations={translations}
              onChange={setCellForm}
            />
          )}

          {activeModal === 'row' && (
            <RowPropsDialog
              form={rowForm}
              translations={translations}
              onChange={setRowForm}
            />
          )}

          {activeModal === 'insert-custom-table' && (
            <CustomTableDialog
              rows={customRows}
              cols={customCols}
              width={customWidth}
              height={customHeight}
              withHeader={customWithHeader}
              striped={customStriped}
              translations={translations}
              onChangeRows={setCustomRows}
              onChangeCols={setCustomCols}
              onChangeWidth={setCustomWidth}
              onChangeHeight={setCustomHeight}
              onChangeWithHeader={setCustomWithHeader}
              onChangeStriped={setCustomStriped}
            />
          )}

          {activeModal === 'source' && (
            <HtmlSourceDialog sourceCode={sourceCode} onChange={setSourceCode} />
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3">
          <button
            type="button"
            data-testid="table-props-modal-cancel"
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            {tCommon.cancel}
          </button>
          <button
            type="button"
            data-testid="table-props-modal-save"
            onClick={() => {
              if (activeModal === 'table') onSaveTableProps(tableForm);
              else if (activeModal === 'cell') onSaveCellProps(cellForm);
              else if (activeModal === 'row') onSaveRowProps(rowForm);
              else if (activeModal === 'source') onSaveSourceHTML(sourceCode);
              else if (activeModal === 'insert-custom-table') {
                onInsertCustomTable(customRows, customCols, {
                  withHeader: customWithHeader,
                  striped: customStriped,
                  width: customWidth,
                  height: customHeight,
                });
              }
              onClose();
            }}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            <Check className="h-3.5 w-3.5" />
            <span>
              {activeModal === 'insert-custom-table' ? tMod.insertTableBtn : tMod.saveAndApply}
            </span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
