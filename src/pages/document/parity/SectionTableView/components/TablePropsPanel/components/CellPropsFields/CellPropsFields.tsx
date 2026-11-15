import type { ChangeEvent } from 'react';
import { Select } from '@/components/ui/Select';
import { SECTION_TABLE_VIEW_IDS } from '../../../../SectionTableView.testids';
import type { CellProps } from '../../../../sectionTableView.types';
import {
  CELL_TYPE_OPTIONS,
  H_ALIGN_OPTIONS,
  PX_PLACEHOLDER,
  SCOPE_OPTIONS,
  SIZE_PLACEHOLDER,
  V_ALIGN_OPTIONS,
} from '../../TablePropsPanel.constants';
import { FieldInput, PropsFieldRow } from '../PropsFieldRow';

export interface CellPropsFieldsProps {
  draft: CellProps;
  onChange: (draft: CellProps) => void;
}

export const CellPropsFields = ({ draft, onChange }: CellPropsFieldsProps) => {
  const handleText = (key: keyof CellProps) => (event: ChangeEvent<HTMLInputElement>) =>
    onChange({ ...draft, [key]: event.target.value });

  const handleSelect = (key: keyof CellProps) => (value: string) =>
    onChange({ ...draft, [key]: value });

  return (
    <>
      <PropsFieldRow label="רוחב" htmlFor="cell-width">
        <FieldInput
          id="cell-width"
          value={draft.width}
          placeholder={SIZE_PLACEHOLDER}
          onChange={handleText('width')}
          data-testid={SECTION_TABLE_VIEW_IDS.propsField('cell-width')}
        />
      </PropsFieldRow>

      <PropsFieldRow label="גובה" htmlFor="cell-height">
        <FieldInput
          id="cell-height"
          value={draft.height}
          placeholder={PX_PLACEHOLDER}
          onChange={handleText('height')}
          data-testid={SECTION_TABLE_VIEW_IDS.propsField('cell-height')}
        />
      </PropsFieldRow>

      <PropsFieldRow label="סוג תא" htmlFor="cell-type">
        <Select
          id="cell-type"
          options={CELL_TYPE_OPTIONS}
          value={draft.type}
          onChange={handleSelect('type')}
        />
      </PropsFieldRow>

      <PropsFieldRow label="היקף" htmlFor="cell-scope">
        <Select
          id="cell-scope"
          options={SCOPE_OPTIONS}
          value={draft.scope}
          onChange={handleSelect('scope')}
        />
      </PropsFieldRow>

      <PropsFieldRow label="יישור אופקי" htmlFor="cell-h-align">
        <Select
          id="cell-h-align"
          options={H_ALIGN_OPTIONS}
          value={draft.hAlign}
          onChange={handleSelect('hAlign')}
        />
      </PropsFieldRow>

      <PropsFieldRow label="יישור אנכי" htmlFor="cell-v-align">
        <Select
          id="cell-v-align"
          options={V_ALIGN_OPTIONS}
          value={draft.vAlign}
          onChange={handleSelect('vAlign')}
        />
      </PropsFieldRow>
    </>
  );
};
