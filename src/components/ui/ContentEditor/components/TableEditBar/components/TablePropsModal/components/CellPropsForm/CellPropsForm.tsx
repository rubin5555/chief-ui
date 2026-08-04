import {
  CELL_TYPE_OPTIONS,
  H_ALIGN_OPTIONS,
  PX_PLACEHOLDER,
  SCOPE_OPTIONS,
  SIZE_PLACEHOLDER,
  V_ALIGN_OPTIONS,
} from '../../TablePropsModal.constants';
import { FieldList } from '../../TablePropsModal.styles';
import { TABLE_PROPS_MODAL_IDS } from '../../TablePropsModal.testids';
import type { CellPropsDraft } from '../../TablePropsModal.types';
import { PropsSelectField } from '../PropsSelectField';
import { PropsTextField } from '../PropsTextField';

export interface CellPropsFormProps {
  draft: CellPropsDraft;
  onChange: (draft: CellPropsDraft) => void;
}

export const CellPropsForm = ({ draft, onChange }: CellPropsFormProps) => {
  const handleWidth = (width: string) => onChange({ ...draft, width });
  const handleHeight = (height: string) => onChange({ ...draft, height });
  const handleType = (type: string) => onChange({ ...draft, type: type === 'th' ? 'th' : 'td' });
  const handleScope = (scope: string) => onChange({ ...draft, scope });
  const handleHAlign = (hAlign: string) => onChange({ ...draft, hAlign });
  const handleVAlign = (vAlign: string) => onChange({ ...draft, vAlign });

  return (
    <FieldList>
      <PropsTextField
        label="רוחב"
        value={draft.width}
        placeholder={SIZE_PLACEHOLDER}
        onChange={handleWidth}
        data-testid={TABLE_PROPS_MODAL_IDS.field('cell-width')}
      />
      <PropsTextField
        label="גובה"
        value={draft.height}
        placeholder={PX_PLACEHOLDER}
        onChange={handleHeight}
        data-testid={TABLE_PROPS_MODAL_IDS.field('cell-height')}
      />
      <PropsSelectField
        label="סוג תא"
        options={CELL_TYPE_OPTIONS}
        value={draft.type}
        onChange={handleType}
        data-testid={TABLE_PROPS_MODAL_IDS.field('cell-type')}
      />
      <PropsSelectField
        label="היקף"
        options={SCOPE_OPTIONS}
        value={draft.scope}
        onChange={handleScope}
        data-testid={TABLE_PROPS_MODAL_IDS.field('cell-scope')}
      />
      <PropsSelectField
        label="יישור אופקי"
        options={H_ALIGN_OPTIONS}
        value={draft.hAlign}
        onChange={handleHAlign}
        data-testid={TABLE_PROPS_MODAL_IDS.field('cell-h-align')}
      />
      <PropsSelectField
        label="יישור אנכי"
        options={V_ALIGN_OPTIONS}
        value={draft.vAlign}
        onChange={handleVAlign}
        data-testid={TABLE_PROPS_MODAL_IDS.field('cell-v-align')}
      />
    </FieldList>
  );
};
