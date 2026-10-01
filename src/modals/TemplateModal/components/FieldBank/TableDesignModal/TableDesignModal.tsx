import { Table2 } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { MultiSelectDropdown } from '@/components/ui/MultiSelectDropdown';
import { Select } from '@/components/ui/Select';
import { Toggle } from '@/components/ui/Toggle';
import type { CellStyle } from '@/lib/json-table';
import type {
  DynamicField,
  StyleTarget,
  TableDesignOptions,
} from '@/modals/DataImportModal/DataImportModal.constants';
import {
  STYLE_TARGET_FROM_LABEL,
  STYLE_TARGET_LABELS,
  tableColumnsOf,
} from '@/modals/DataImportModal/utils/tableDesignOptions';
import { CellStyleFields } from './components/CellStyleFields';
import { ColumnStyleList } from './components/ColumnStyleList';
import { StyleRuleList } from './components/StyleRuleList';
import { FieldLabel, FieldRow, TextInput, ToggleRow } from './TableDesignModal.shared.styles';
import {
  Body,
  HintText,
  LabelColumnName,
  LabelRow,
  LabelsList,
  SectionDivider,
} from './TableDesignModal.styles';
import { TABLE_DESIGN_MODAL_IDS } from './TableDesignModal.testids';

const NO_ROW_TITLE = 'ללא';
const STYLE_TARGETS: StyleTarget[] = ['header', 'subheader', 'key', 'cell', 'caption'];
const STYLE_TARGET_OPTIONS = STYLE_TARGETS.map((target) => STYLE_TARGET_LABELS[target]);

interface TableDesignModalProps {
  field: DynamicField;
  onSave: (id: string, design: TableDesignOptions, renderAsTable: boolean) => void;
  onClose: () => void;
}

export const TableDesignModal = ({ field, onSave, onClose }: TableDesignModalProps) => {
  const isTableSchema = field.shape === 'table';
  const [renderAsTable, setRenderAsTable] = useState(Boolean(field.renderAsTable));
  const [draft, setDraft] = useState<TableDesignOptions>(field.tableDesign ?? {});
  const [styleTarget, setStyleTarget] = useState<StyleTarget>('header');

  const showTableFields = isTableSchema || renderAsTable;
  const columns = isTableSchema ? tableColumnsOf(field.value) : ['#', 'value'];

  const patch = (next: Partial<TableDesignOptions>) => setDraft((prev) => ({ ...prev, ...next }));
  const patchField =
    <K extends keyof TableDesignOptions>(key: K) =>
    (value: TableDesignOptions[K]) =>
      patch({ [key]: value });

  const handleCaptionChange = (e: ChangeEvent<HTMLInputElement>) =>
    patch({ caption: e.target.value });
  const handleTotalsChange = patchField('totals');
  const handleAggregateChange = patchField('aggregate');
  const handleRowTitleChange = (value: string) =>
    patch({ rowTitleField: value === NO_ROW_TITLE ? undefined : value });
  const handleLabelChange = (column: string) => (e: ChangeEvent<HTMLInputElement>) =>
    patch({ labels: { ...draft.labels, [column]: e.target.value } });
  const handleStyleTargetChange = (label: string) =>
    setStyleTarget(STYLE_TARGET_FROM_LABEL[label] ?? 'header');
  const handleTargetStyleChange = (style: CellStyle) =>
    patch({ targetStyles: { ...draft.targetStyles, [styleTarget]: style } });
  const handleColumnStylesChange = patchField('columnStyles');
  const handleRulesChange = patchField('rules');

  const handleSave = () => {
    onSave(field.id, draft, renderAsTable);
    onClose();
  };

  return (
    <Modal
      title="עיצוב תצוגה"
      icon={<Table2 size={16} />}
      onClose={onClose}
      width={480}
      footer={
        <>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            data-testid={TABLE_DESIGN_MODAL_IDS.cancelBtn}
          >
            ביטול
          </Button>
          <Button type="button" onClick={handleSave} data-testid={TABLE_DESIGN_MODAL_IDS.saveBtn}>
            שמירה
          </Button>
        </>
      }
      data-testid={TABLE_DESIGN_MODAL_IDS.root}
    >
      <Body>
        {!isTableSchema && (
          <ToggleRow>
            <FieldLabel>הצג כטבלה מעוצבת</FieldLabel>
            <Toggle
              checked={renderAsTable}
              onChange={setRenderAsTable}
              aria-label="הצג כטבלה מעוצבת"
              data-testid={TABLE_DESIGN_MODAL_IDS.renderAsTableToggle}
            />
          </ToggleRow>
        )}

        {!showTableFields && (
          <HintText>הרשימה תוצג כ־ul/ol רגיל — הפעל/י את המתג כדי לעצב אותה כטבלה.</HintText>
        )}

        {showTableFields && (
          <>
            <FieldRow>
              <FieldLabel>כותרת</FieldLabel>
              <TextInput
                value={draft.caption ?? ''}
                onChange={handleCaptionChange}
                placeholder={field.fieldName}
                data-testid={TABLE_DESIGN_MODAL_IDS.captionInput}
              />
            </FieldRow>

            {isTableSchema && (
              <ToggleRow>
                <FieldLabel>שורת סה"כ (Σ)</FieldLabel>
                <Toggle
                  checked={draft.totals ?? true}
                  onChange={handleTotalsChange}
                  aria-label="שורת סה״כ"
                  data-testid={TABLE_DESIGN_MODAL_IDS.totalsToggle}
                />
              </ToggleRow>
            )}

            {isTableSchema && columns.length > 0 && (
              <FieldRow>
                <FieldLabel>איחוד שורות (Aggregate)</FieldLabel>
                <MultiSelectDropdown
                  options={columns}
                  selected={draft.aggregate ?? []}
                  onChange={handleAggregateChange}
                  placeholder="ללא איחוד"
                  data-testid={TABLE_DESIGN_MODAL_IDS.aggregateSelect}
                />
              </FieldRow>
            )}

            {isTableSchema && columns.length > 0 && (
              <FieldRow>
                <FieldLabel>עמודת כותרת שורה</FieldLabel>
                <Select
                  options={[NO_ROW_TITLE, ...columns]}
                  value={draft.rowTitleField ?? NO_ROW_TITLE}
                  onChange={handleRowTitleChange}
                  data-testid={TABLE_DESIGN_MODAL_IDS.rowTitleSelect}
                />
              </FieldRow>
            )}

            <SectionDivider />

            {columns.length > 0 && (
              <FieldRow>
                <FieldLabel>תוויות עמודות</FieldLabel>
                <LabelsList>
                  {columns.map((column) => (
                    <LabelRow key={column}>
                      <LabelColumnName>{column}</LabelColumnName>
                      <TextInput
                        value={draft.labels?.[column] ?? ''}
                        onChange={handleLabelChange(column)}
                        placeholder={column}
                        data-testid={TABLE_DESIGN_MODAL_IDS.labelInput(column)}
                      />
                    </LabelRow>
                  ))}
                </LabelsList>
              </FieldRow>
            )}

            <SectionDivider />

            <FieldRow>
              <FieldLabel>עיצוב לפי מיקום</FieldLabel>
              <Select
                options={STYLE_TARGET_OPTIONS}
                value={STYLE_TARGET_LABELS[styleTarget]}
                onChange={handleStyleTargetChange}
                data-testid={TABLE_DESIGN_MODAL_IDS.styleTargetSelect}
              />
            </FieldRow>
            <CellStyleFields
              idPrefix={`target-${styleTarget}`}
              value={draft.targetStyles?.[styleTarget] ?? {}}
              onChange={handleTargetStyleChange}
            />

            {isTableSchema && (
              <>
                <SectionDivider />
                <FieldRow>
                  <FieldLabel>עיצוב לפי עמודה</FieldLabel>
                  <ColumnStyleList
                    columns={columns}
                    value={draft.columnStyles ?? {}}
                    onChange={handleColumnStylesChange}
                  />
                </FieldRow>

                <SectionDivider />
                <FieldRow>
                  <FieldLabel>כללי עיצוב מותנים</FieldLabel>
                  <StyleRuleList
                    columns={columns}
                    value={draft.rules ?? []}
                    onChange={handleRulesChange}
                  />
                </FieldRow>
              </>
            )}
          </>
        )}
      </Body>
    </Modal>
  );
};
