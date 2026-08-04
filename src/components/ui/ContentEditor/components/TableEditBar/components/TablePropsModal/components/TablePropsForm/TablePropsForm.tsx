import { Toggle } from '@/components/ui/Toggle';
import { H_ALIGN_OPTIONS, PX_PLACEHOLDER, SIZE_PLACEHOLDER } from '../../TablePropsModal.constants';
import { CaptionRow, CaptionState, FieldList } from '../../TablePropsModal.styles';
import { TABLE_PROPS_MODAL_IDS } from '../../TablePropsModal.testids';
import type { TablePropsDraft } from '../../TablePropsModal.types';
import { PropsField } from '../PropsField';
import { PropsSelectField } from '../PropsSelectField';
import { PropsTextField } from '../PropsTextField';

export interface TablePropsFormProps {
  draft: TablePropsDraft;
  onChange: (draft: TablePropsDraft) => void;
}

export const TablePropsForm = ({ draft, onChange }: TablePropsFormProps) => {
  const handleWidth = (width: string) => onChange({ ...draft, width });
  const handleHeight = (height: string) => onChange({ ...draft, height });
  const handleCellSpacing = (cellSpacing: string) => onChange({ ...draft, cellSpacing });
  const handleCellPadding = (cellPadding: string) => onChange({ ...draft, cellPadding });
  const handleBorderWidth = (borderWidth: string) => onChange({ ...draft, borderWidth });
  const handleShowCaption = (showCaption: boolean) => onChange({ ...draft, showCaption });
  const handleAlign = (align: string) => onChange({ ...draft, align });

  return (
    <FieldList>
      <PropsTextField
        label="רוחב"
        value={draft.width}
        placeholder={SIZE_PLACEHOLDER}
        onChange={handleWidth}
        data-testid={TABLE_PROPS_MODAL_IDS.field('table-width')}
      />
      <PropsTextField
        label="גובה"
        value={draft.height}
        placeholder={PX_PLACEHOLDER}
        onChange={handleHeight}
        data-testid={TABLE_PROPS_MODAL_IDS.field('table-height')}
      />
      <PropsTextField
        label="שוליים חיצוניים לתא"
        value={draft.cellSpacing}
        placeholder={PX_PLACEHOLDER}
        onChange={handleCellSpacing}
        data-testid={TABLE_PROPS_MODAL_IDS.field('cell-spacing')}
      />
      <PropsTextField
        label="שוליים פנימיים לתא"
        value={draft.cellPadding}
        placeholder={PX_PLACEHOLDER}
        onChange={handleCellPadding}
        data-testid={TABLE_PROPS_MODAL_IDS.field('cell-padding')}
      />
      <PropsTextField
        label="רוחב גבול"
        value={draft.borderWidth}
        placeholder={PX_PLACEHOLDER}
        onChange={handleBorderWidth}
        data-testid={TABLE_PROPS_MODAL_IDS.field('border-width')}
      />
      <PropsField label="הצג כתוביות">
        <CaptionRow>
          <Toggle
            checked={draft.showCaption}
            aria-label="הצג כתוביות"
            onChange={handleShowCaption}
            data-testid={TABLE_PROPS_MODAL_IDS.captionToggle}
          />
          <CaptionState>{draft.showCaption ? 'מופעל' : 'כבוי'}</CaptionState>
        </CaptionRow>
      </PropsField>
      <PropsSelectField
        label="יישור"
        options={H_ALIGN_OPTIONS}
        value={draft.align}
        onChange={handleAlign}
        data-testid={TABLE_PROPS_MODAL_IDS.field('table-align')}
      />
    </FieldList>
  );
};
