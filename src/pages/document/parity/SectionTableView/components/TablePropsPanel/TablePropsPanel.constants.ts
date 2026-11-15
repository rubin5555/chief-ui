import type { CellProps, TableProps } from '../../sectionTableView.types';

export const CELL_PROPS_DEFAULT: CellProps = {
  width: '',
  height: '',
  type: 'תא',
  scope: '',
  hAlign: '',
  vAlign: '',
};

export const TABLE_PROPS_DEFAULT: TableProps = {
  width: '',
  height: '',
  cellSpacing: '0',
  cellPadding: '4',
  borderWidth: '1',
  showCaption: false,
  align: '',
};

export const NONE_OPTION = 'ללא';

export const CELL_TYPE_OPTIONS = ['תא', 'כותרת לתא'];
export const SCOPE_OPTIONS = [NONE_OPTION, 'שורה', 'עמודה', 'קיבוץ שורות', 'קיבוץ עמודות'];
export const H_ALIGN_OPTIONS = [NONE_OPTION, 'ימין', 'שמאל', 'מרכז'];
export const V_ALIGN_OPTIONS = [NONE_OPTION, 'עליון', 'אמצע', 'תחתון'];
export const TABLE_ALIGN_OPTIONS = H_ALIGN_OPTIONS;

export const SIZE_PLACEHOLDER = 'px או %';
export const PX_PLACEHOLDER = 'px';
