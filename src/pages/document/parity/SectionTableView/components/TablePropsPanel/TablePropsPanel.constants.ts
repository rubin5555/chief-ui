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

// main's `<select>`s carry an HTML value beside each label ('td'/'th', 'row'/'col')
// (Edit.tsx:818-847). ui/Select is label-only, and nothing here is ever applied to
// a real table — main's save handler just copies the draft into a sibling state —
// so the visible Hebrew *is* the value.
export const NONE_OPTION = 'ללא';

export const CELL_TYPE_OPTIONS = ['תא', 'כותרת לתא'];
export const SCOPE_OPTIONS = [NONE_OPTION, 'שורה', 'עמודה', 'קיבוץ שורות', 'קיבוץ עמודות'];
export const H_ALIGN_OPTIONS = [NONE_OPTION, 'ימין', 'שמאל', 'מרכז'];
export const V_ALIGN_OPTIONS = [NONE_OPTION, 'עליון', 'אמצע', 'תחתון'];
export const TABLE_ALIGN_OPTIONS = H_ALIGN_OPTIONS;

export const SIZE_PLACEHOLDER = 'px או %';
export const PX_PLACEHOLDER = 'px';
