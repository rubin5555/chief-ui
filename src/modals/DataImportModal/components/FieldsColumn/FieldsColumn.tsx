import { Check, ChevronDown, List, Plus, Table, Type, X } from 'lucide-react';
import { FIELD_CHILDREN_FALLBACK, useFieldChildren } from '@/api/fieldChildren';
import type { FieldShape } from '../../DataImportModal.constants';
import { DATA_IMPORT_IDS } from '../../DataImportModal.testids';
import type { DataImportPicker } from '../../hooks/useDataImportPicker';
import { inferFieldShape } from '../../utils/inferFieldShape';
import { ColumnEmptyState, ColumnHeading, ColumnPane } from '../columns.shared.styles';
import {
  FieldChevron,
  FieldLabel,
  FieldRow,
  GhostIcon,
  HideOnHover,
  OptionalHint,
  ShapeIcon,
  ShowOnHover,
  SubFieldContent,
  SubFieldGlyph,
  SubFieldLabel,
  SubFieldRow,
  SubFieldsBlock,
} from './FieldsColumn.styles';

const SHAPE_LABELS: Record<FieldShape, string> = {
  table: 'טבלה',
  list: 'רשימה',
  text: 'טקסט',
};

const SHAPE_ICONS: Record<FieldShape, typeof Table> = {
  table: Table,
  list: List,
  text: Type,
};

const ShapeGlyph = ({ shape }: { shape: FieldShape }) => {
  const Icon = SHAPE_ICONS[shape];
  return <Icon size={11} />;
};

interface FieldsColumnProps {
  picker: DataImportPicker;
  onFieldToggled: (fieldName: string, result: { added: number; removed: number }) => void;
}

interface LinkToggleIconsProps {
  isLinked: boolean;
  size: number;
}

// Linked rows swap a ✓ for an ✕ on hover; unlinked rows reveal a + on hover.
const LinkToggleIcons = ({ isLinked, size }: LinkToggleIconsProps) =>
  isLinked ? (
    <>
      <HideOnHover>
        <Check size={size} />
      </HideOnHover>
      <ShowOnHover>
        <X size={size} />
      </ShowOnHover>
    </>
  ) : (
    <GhostIcon>
      <Plus size={size} />
    </GhostIcon>
  );

export const FieldsColumn = ({ picker, onFieldToggled }: FieldsColumnProps) => {
  const hasSelection = picker.selectedInstances.length > 0 && picker.selectedOperation !== null;

  const { data } = useFieldChildren();
  const fieldChildren = data ?? FIELD_CHILDREN_FALLBACK.fieldChildren;

  const handleFieldClick = (fieldName: string, hasChildren: boolean) => () => {
    if (hasChildren) {
      picker.setExpandedField(picker.expandedField === fieldName ? null : fieldName);
      return;
    }
    onFieldToggled(fieldName, picker.toggleField(fieldName));
  };
  const handleSubFieldToggle = (fieldName: string) => () =>
    onFieldToggled(fieldName, picker.toggleField(fieldName));

  return (
    <ColumnPane data-testid={DATA_IMPORT_IDS.fieldsColumn}>
      <ColumnHeading>שדה מידע</ColumnHeading>
      {hasSelection && picker.selectedOperation ? (
        picker.selectedOperation.fields.map((field) => {
          const fieldName = field.name;
          const shape = inferFieldShape(field.value);
          const isLinked = picker.isFieldLinked(fieldName);
          const subFields = fieldChildren[fieldName];
          const isExpanded = picker.expandedField === fieldName;
          return (
            <div key={fieldName}>
              <FieldRow
                type="button"
                $isExpanded={isExpanded}
                onClick={handleFieldClick(fieldName, Boolean(subFields))}
                data-testid={DATA_IMPORT_IDS.fieldRow(fieldName)}
              >
                <FieldLabel $weight={isExpanded ? 600 : isLinked ? 500 : 400}>
                  {fieldName}
                </FieldLabel>
                {!subFields && (
                  <ShapeIcon title={SHAPE_LABELS[shape]}>
                    <ShapeGlyph shape={shape} />
                  </ShapeIcon>
                )}
                {subFields ? (
                  <FieldChevron $isExpanded={isExpanded}>
                    <ChevronDown size={12} />
                  </FieldChevron>
                ) : (
                  <LinkToggleIcons isLinked={isLinked} size={14} />
                )}
              </FieldRow>
              {subFields && isExpanded && (
                <SubFieldsBlock>
                  {subFields.map((subFieldName) => {
                    const isSubLinked = picker.isFieldLinked(subFieldName);
                    return (
                      <SubFieldRow
                        key={subFieldName}
                        type="button"
                        $isLinked={isSubLinked}
                        onClick={handleSubFieldToggle(subFieldName)}
                        data-testid={DATA_IMPORT_IDS.subFieldRow(subFieldName)}
                      >
                        <SubFieldContent>
                          <SubFieldGlyph>└</SubFieldGlyph>
                          <SubFieldLabel $isLinked={isSubLinked}>{subFieldName}</SubFieldLabel>
                          {isSubLinked && <OptionalHint>אופציונלי</OptionalHint>}
                        </SubFieldContent>
                        <LinkToggleIcons isLinked={isSubLinked} size={12} />
                      </SubFieldRow>
                    );
                  })}
                </SubFieldsBlock>
              )}
            </div>
          );
        })
      ) : (
        <ColumnEmptyState>
          <p>{!picker.selectedOperation ? 'בחר פעולה' : 'בחר ישות'}</p>
        </ColumnEmptyState>
      )}
    </ColumnPane>
  );
};
