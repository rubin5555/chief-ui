import type { ChangeEvent } from 'react';
import { Select } from '@/components/ui/Select';
import { Toggle } from '@/components/ui/Toggle';
import { SECTION_TABLE_VIEW_IDS } from '../../../../SectionTableView.testids';
import type { TableProps } from '../../../../sectionTableView.types';
import {
  PX_PLACEHOLDER,
  SIZE_PLACEHOLDER,
  TABLE_ALIGN_OPTIONS,
} from '../../TablePropsPanel.constants';
import { FieldInput, PropsFieldRow } from '../PropsFieldRow';
import { ToggleRow, ToggleState } from './TablePropsFields.styles';

export interface TablePropsFieldsProps {
  draft: TableProps;
  onChange: (draft: TableProps) => void;
}

export const TablePropsFields = ({ draft, onChange }: TablePropsFieldsProps) => {
  const handleText = (key: keyof TableProps) => (event: ChangeEvent<HTMLInputElement>) =>
    onChange({ ...draft, [key]: event.target.value });

  const handleAlign = (align: string) => onChange({ ...draft, align });
  const handleCaption = (showCaption: boolean) => onChange({ ...draft, showCaption });

  return (
    <>
      <PropsFieldRow label="רוחב" htmlFor="table-width">
        <FieldInput
          id="table-width"
          value={draft.width}
          placeholder={SIZE_PLACEHOLDER}
          onChange={handleText('width')}
          data-testid={SECTION_TABLE_VIEW_IDS.propsField('table-width')}
        />
      </PropsFieldRow>

      <PropsFieldRow label="גובה" htmlFor="table-height">
        <FieldInput
          id="table-height"
          value={draft.height}
          placeholder={PX_PLACEHOLDER}
          onChange={handleText('height')}
        />
      </PropsFieldRow>

      <PropsFieldRow label="שוליים חיצוניים לתא" htmlFor="table-cell-spacing">
        <FieldInput
          id="table-cell-spacing"
          value={draft.cellSpacing}
          placeholder={PX_PLACEHOLDER}
          onChange={handleText('cellSpacing')}
        />
      </PropsFieldRow>

      <PropsFieldRow label="שוליים פנימיים לתא" htmlFor="table-cell-padding">
        <FieldInput
          id="table-cell-padding"
          value={draft.cellPadding}
          placeholder={PX_PLACEHOLDER}
          onChange={handleText('cellPadding')}
        />
      </PropsFieldRow>

      <PropsFieldRow label="רוחב גבול" htmlFor="table-border-width">
        <FieldInput
          id="table-border-width"
          value={draft.borderWidth}
          placeholder={PX_PLACEHOLDER}
          onChange={handleText('borderWidth')}
        />
      </PropsFieldRow>

      <PropsFieldRow label="הצג כתוביות" htmlFor="table-caption">
        <ToggleRow>
          <Toggle
            id="table-caption"
            checked={draft.showCaption}
            aria-label="הצג כתוביות"
            onChange={handleCaption}
            data-testid={SECTION_TABLE_VIEW_IDS.propsField('table-caption')}
          />
          <ToggleState>{draft.showCaption ? 'מופעל' : 'כבוי'}</ToggleState>
        </ToggleRow>
      </PropsFieldRow>

      <PropsFieldRow label="יישור" htmlFor="table-align">
        <Select
          id="table-align"
          options={TABLE_ALIGN_OPTIONS}
          value={draft.align}
          onChange={handleAlign}
        />
      </PropsFieldRow>
    </>
  );
};
