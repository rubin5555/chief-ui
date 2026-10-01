import type { CellPropsDraft, PropsOption, TablePropsDraft } from './TablePropsModal.types';

export const MODAL_WIDTH = 380;

export const CELL_PROPS_DEFAULT: CellPropsDraft = {
  width: '',
  height: '',
  type: 'td',
  scope: '',
  hAlign: '',
  vAlign: '',
};

export const TABLE_PROPS_DEFAULT: TablePropsDraft = {
  width: '',
  height: '',
  cellSpacing: '0',
  cellPadding: '4',
  borderWidth: '1',
  showCaption: false,
  align: '',
};

export const CELL_TYPE_OPTIONS: PropsOption[] = [
  { value: 'td', label: 'תא' },
  { value: 'th', label: 'כותרת לתא' },
];

export const SCOPE_OPTIONS: PropsOption[] = [
  { value: '', label: 'ללא' },
  { value: 'row', label: 'שורה' },
  { value: 'col', label: 'עמודה' },
  { value: 'rowgroup', label: 'קיבוץ שורות' },
  { value: 'colgroup', label: 'קיבוץ עמודות' },
];

export const H_ALIGN_OPTIONS: PropsOption[] = [
  { value: '', label: 'ללא' },
  { value: 'right', label: 'ימין' },
  { value: 'left', label: 'שמאל' },
  { value: 'center', label: 'מרכז' },
];

export const V_ALIGN_OPTIONS: PropsOption[] = [
  { value: '', label: 'ללא' },
  { value: 'top', label: 'עליון' },
  { value: 'middle', label: 'אמצע' },
  { value: 'bottom', label: 'תחתון' },
];

export const CAPTION_TEXT = 'כותרת טבלה';

export const SIZE_PLACEHOLDER = 'px או %';

export const PX_PLACEHOLDER = 'px';
