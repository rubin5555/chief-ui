import { GripVertical, Plus, X } from 'lucide-react';
import type { DragEvent, MouseEvent } from 'react';
import { CONTENT_CHIP_HTML_MIME, CONTENT_CHIP_MIME } from '@/components/ui/ContentEditor';
import type { DynamicField } from '@/modals/DataImportModal/DataImportModal.constants';
// Deep import keeps the DataImportModal component itself out of this chunk — the modal
// is lazy-loaded by TemplateModal, and pulling its barrel here would defeat that split.
import { buildFieldChipHtml } from '@/modals/DataImportModal/utils/fieldChipHtml';
import {
  AddMoreBtn,
  BankList,
  ChipGrip,
  ChipInfo,
  ChipMeta,
  ChipName,
  ChipRemoveBtn,
  ChipRow,
  DragHint,
} from './FieldBank.styles';
import { FIELD_BANK_IDS } from './FieldBank.testids';

interface FieldBankListProps {
  fields: DynamicField[];
  onRemoveField: (id: string) => void;
  onOpenPicker: () => void;
  onFieldDragStart: (fieldName: string) => void;
}

export const FieldBankList = ({
  fields,
  onRemoveField,
  onOpenPicker,
  onFieldDragStart,
}: FieldBankListProps) => {
  const handleDragStart = (field: DynamicField) => (e: DragEvent<HTMLDivElement>) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData(CONTENT_CHIP_MIME, field.id);
    e.dataTransfer.setData(CONTENT_CHIP_HTML_MIME, buildFieldChipHtml(field));
    onFieldDragStart(field.fieldName);
  };
  const handleRemoveMouseDown = (e: MouseEvent) => e.stopPropagation();
  const handleRemove = (id: string) => () => onRemoveField(id);

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
    </BankList>
  );
};
