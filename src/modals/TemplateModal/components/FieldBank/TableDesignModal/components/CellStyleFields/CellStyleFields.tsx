import { Select } from '@/components/ui/Select';
import { Toggle } from '@/components/ui/Toggle';
import type { CellStyle } from '@/lib/json-table';
import {
  ALIGN_LABEL_BY_VALUE,
  BACKGROUND_PRESETS,
  CELL_ALIGN_OPTIONS,
  TEXT_COLOR_PRESETS,
} from '@/modals/DataImportModal/utils/tableDesignOptions';
import {
  FieldLabel,
  FieldRow,
  SwatchBtn,
  SwatchRow,
  ToggleRow,
} from '../../TableDesignModal.shared.styles';
import { CELL_STYLE_FIELDS_IDS } from './CellStyleFields.testids';

interface CellStyleFieldsProps {
  idPrefix: string;
  value: CellStyle;
  onChange: (next: CellStyle) => void;
}

export const CellStyleFields = ({ idPrefix, value, onChange }: CellStyleFieldsProps) => {
  const pickBackground = (background: string) => () =>
    onChange({ ...value, background: background || undefined });
  const pickColor = (color: string) => () => onChange({ ...value, color: color || undefined });
  const handleBoldChange = (bold: boolean) => onChange({ ...value, bold });
  const handleItalicChange = (italic: boolean) => onChange({ ...value, italic });
  const handleAlignChange = (label: string) =>
    onChange({ ...value, align: CELL_ALIGN_OPTIONS[label] });

  const alignLabel = value.align ? ALIGN_LABEL_BY_VALUE[value.align] : undefined;

  return (
    <>
      <FieldRow>
        <FieldLabel>רקע</FieldLabel>
        <SwatchRow>
          {Object.entries(BACKGROUND_PRESETS).map(([name, preset]) => (
            <SwatchBtn
              key={name}
              type="button"
              $color={preset}
              $active={(value.background ?? '') === preset}
              onClick={pickBackground(preset)}
              title={name}
              aria-label={name}
              data-testid={CELL_STYLE_FIELDS_IDS.backgroundSwatch(idPrefix, name)}
            />
          ))}
        </SwatchRow>
      </FieldRow>

      <FieldRow>
        <FieldLabel>צבע טקסט</FieldLabel>
        <SwatchRow>
          {Object.entries(TEXT_COLOR_PRESETS).map(([name, preset]) => (
            <SwatchBtn
              key={name}
              type="button"
              $color={preset}
              $active={(value.color ?? '') === preset}
              onClick={pickColor(preset)}
              title={name}
              aria-label={name}
              data-testid={CELL_STYLE_FIELDS_IDS.colorSwatch(idPrefix, name)}
            />
          ))}
        </SwatchRow>
      </FieldRow>

      <ToggleRow>
        <FieldLabel>מודגש</FieldLabel>
        <Toggle
          checked={value.bold ?? false}
          onChange={handleBoldChange}
          aria-label="מודגש"
          data-testid={CELL_STYLE_FIELDS_IDS.boldToggle(idPrefix)}
        />
      </ToggleRow>

      <ToggleRow>
        <FieldLabel>נטוי</FieldLabel>
        <Toggle
          checked={value.italic ?? false}
          onChange={handleItalicChange}
          aria-label="נטוי"
          data-testid={CELL_STYLE_FIELDS_IDS.italicToggle(idPrefix)}
        />
      </ToggleRow>

      <FieldRow>
        <FieldLabel>יישור</FieldLabel>
        <Select
          options={Object.keys(CELL_ALIGN_OPTIONS)}
          value={alignLabel}
          onChange={handleAlignChange}
          placeholder="ברירת מחדל"
          data-testid={CELL_STYLE_FIELDS_IDS.alignSelect(idPrefix)}
        />
      </FieldRow>
    </>
  );
};
