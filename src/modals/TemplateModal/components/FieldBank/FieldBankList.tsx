import { GripVertical, List, ListOrdered, Plus, Settings2, X } from 'lucide-react';
import type { DragEvent, MouseEvent } from 'react';
import { useState } from 'react';
import { CONTENT_CHIP_HTML_MIME, CONTENT_CHIP_MIME } from '@/components/ui/ContentEditor';
import {
  type DynamicField,
  ENABLE_TABLE_DESIGN,
  type TableDesignOptions,
} from '@/modals/DataImportModal/DataImportModal.constants';

import { buildFieldContentHtml } from '@/modals/DataImportModal/utils/fieldChipHtml';
import {
  AddMoreBtn,
  BankList,
  ChipDesignBtn,
  ChipGrip,
  ChipInfo,
  ChipMeta,
  ChipName,
  ChipOrderToggleBtn,
  ChipRemoveBtn,
  ChipRow,
  DragHint,
} from './FieldBank.styles';
import { FIELD_BANK_IDS } from './FieldBank.testids';
import { TableDesignModal } from './TableDesignModal';

interface FieldBankListProps {
  fields: DynamicField[];
  onRemoveField: (id: string) => void;
  onToggleOrdered: (id: string) => void;
  onSaveTableDesign: (id: string, design: TableDesignOptions, renderAsTable: boolean) => void;
  onOpenPicker: () => void;
  onFieldDragStart: (fieldName: string) => void;
}

export const FieldBankList = ({
  fields,
  onRemoveField,
  onToggleOrdered,
  onSaveTableDesign,
  onOpenPicker,
  onFieldDragStart,
}: FieldBankListProps) => {
  const [designFieldId, setDesignFieldId] = useState<string | null>(null);
  const designField = fields.find((f) => f.id === designFieldId) ?? null;

  const handleDragStart = (field: DynamicField) => (e: DragEvent<HTMLDivElement>) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData(CONTENT_CHIP_MIME, field.id);
    e.dataTransfer.setData(CONTENT_CHIP_HTML_MIME, buildFieldContentHtml(field));
    onFieldDragStart(field.fieldName);
  };
  const handleRemoveMouseDown = (e: MouseEvent) => e.stopPropagation();
  const handleRemove = (id: string) => () => onRemoveField(id);
  const handleToggleOrderedMouseDown = (e: MouseEvent) => e.stopPropagation();
  const handleToggleOrdered = (id: string) => () => onToggleOrdered(id);
  const handleDesignMouseDown = (e: MouseEvent) => e.stopPropagation();
  const handleOpenDesign = (id: string) => () => setDesignFieldId(id);
  const handleCloseDesign = () => setDesignFieldId(null);

  return (
    <BankList data-testid={FIELD_BANK_IDS.list}>
      <DragHint>גרור שדה לתוך הסעיף הרצוי</DragHint>
      {fields.map((field) => (
        <ChipRow
          key={field.id}
          draggable
          onDragStart={handleDragStart(field)}
          data-testid={FIELD_BANK_IDS.chip(field.id)}
        >
          <ChipGrip>
            <GripVertical size={14} />
          </ChipGrip>
          <ChipInfo>
            <ChipName>{field.fieldName}</ChipName>
            <ChipMeta>
              {field.operationName}
              {field.instanceName ? ` · ${field.instanceName}` : ''} · {field.systemName}
            </ChipMeta>
          </ChipInfo>
          {field.shape === 'list' && (
            <ChipOrderToggleBtn
              type="button"
              $active={Boolean(field.ordered)}
              onMouseDown={handleToggleOrderedMouseDown}
              onClick={handleToggleOrdered(field.id)}
              aria-label={field.ordered ? 'הפיכה לרשימה לא ממוספרת' : 'הפיכה לרשימה ממוספרת'}
              title={field.ordered ? 'רשימה ממוספרת' : 'רשימה לא ממוספרת'}
              data-testid={FIELD_BANK_IDS.chipOrderToggleBtn(field.id)}
            >
              {field.ordered ? <ListOrdered size={12} /> : <List size={12} />}
            </ChipOrderToggleBtn>
          )}
          {ENABLE_TABLE_DESIGN && (field.shape === 'table' || field.shape === 'list') && (
            <ChipDesignBtn
              type="button"
              onMouseDown={handleDesignMouseDown}
              onClick={handleOpenDesign(field.id)}
              aria-label={`עיצוב תצוגת ${field.fieldName}`}
              title="עיצוב תצוגה"
              data-testid={FIELD_BANK_IDS.chipDesignBtn(field.id)}
            >
              <Settings2 size={12} />
            </ChipDesignBtn>
          )}
          <ChipRemoveBtn
            type="button"
            onMouseDown={handleRemoveMouseDown}
            onClick={handleRemove(field.id)}
            aria-label={`הסרת ${field.fieldName}`}
            data-testid={FIELD_BANK_IDS.chipRemoveBtn(field.id)}
          >
            <X size={12} />
          </ChipRemoveBtn>
        </ChipRow>
      ))}
      <AddMoreBtn type="button" onClick={onOpenPicker} data-testid={FIELD_BANK_IDS.addMoreBtn}>
        <Plus size={14} />
        הוסף שדות נוספים
      </AddMoreBtn>
      {ENABLE_TABLE_DESIGN && designField && (
        <TableDesignModal
          field={designField}
          onSave={onSaveTableDesign}
          onClose={handleCloseDesign}
        />
      )}
    </BankList>
  );
};
