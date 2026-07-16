import type { CellStyle, JsonValue } from '@/lib/json-table';

// No feature-flag system exists in this repo yet — this is a plain constant standing in
// for one. Gates the ⚙ "עיצוב תצוגה" button in FieldBankList and its TableDesignModal
// (caption/totals/aggregate/row-titles/per-target+per-column styling/conditional rules).
// Off by default while the feature is validated; flip to true to re-enable it — no other
// code changes needed, the whole surface (types, mapping layer, components) stays intact.
export const ENABLE_TABLE_DESIGN = false;

// How a linked field renders once dropped into a section: an array of objects becomes a
// table, an array of primitives becomes a list, anything else is plain text.
export type FieldShape = 'table' | 'list' | 'text';

// Backed by json-table's own JsonValue so a field's sample value can be handed straight
// to the renderer with no reshaping.
export type SourceFieldValue = JsonValue;

export interface SourceField {
  name: string;
  value: SourceFieldValue;
}

export interface SourceOperation {
  id: string;
  name: string;
  instances: string[];
  fields: SourceField[];
}

export interface SourceSystem {
  id: string;
  name: string;
  operations: SourceOperation[];
}

// The five surfaces json-table's TableStyles can independently style — see
// utils/tableDesignOptions.ts's STYLE_TARGET_LABELS for their Hebrew labels.
export type StyleTarget = 'header' | 'subheader' | 'key' | 'cell' | 'caption';

// Comparison used by a StyleRule's condition; 'contains' is string-only, the rest
// coerce both sides to numbers when possible (see utils/tableDesignOptions.ts's compareRule).
export type RuleOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains';

// One conditional-formatting rule: "if <column> <operator> <value>, apply <style>".
// Compiled into json-table's FieldStyle.when predicate per column at render time —
// this is the form-friendly, serializable stand-in for a JS predicate function.
export interface StyleRule {
  id: string;
  column: string;
  operator: RuleOperator;
  value: string;
  style: CellStyle;
}

// User-configurable subset of json-table's RenderOptions/TableStyles, exposed through
// TableDesignModal and mapped to real RenderOptions by utils/tableDesignOptions.ts.
// columnStyles and rules rely on per-cell dotted paths, which json-table only threads
// through for matrix tables (array-of-objects) — TableDesignModal gates both sections
// to table-shape fields for that reason (see its isTableSchema check).
export interface TableDesignOptions {
  caption?: string;
  totals?: boolean;
  aggregate?: string[];
  rowTitleField?: string;
  labels?: Record<string, string>;
  targetStyles?: Partial<Record<StyleTarget, CellStyle>>;
  columnStyles?: Record<string, CellStyle>;
  rules?: StyleRule[];
}

// A field the user linked from a source system into the template.
export interface DynamicField {
  id: string;
  systemId: string;
  systemName: string;
  operationId: string;
  operationName: string;
  instanceName: string;
  fieldName: string;
  shape: FieldShape;
  value: SourceFieldValue;
  // Only meaningful when shape === 'list'; defaults to false (bullet list) on link.
  ordered?: boolean;
  // List shape only: render through json-table's styled table renderer (with
  // tableDesign below) instead of a plain <ul>/<ol> — renderListHtml has no styling
  // hooks of its own, so this is how a list field reaches json-table's design abilities.
  renderAsTable?: boolean;
  // Table shape, or list shape with renderAsTable — user-chosen json-table presentation.
  tableDesign?: TableDesignOptions;
}

export interface OperationParamValues {
  name: string;
  date: string;
  quantity: string;
  question: boolean;
}

export const EMPTY_OPERATION_PARAMS: OperationParamValues = {
  name: '',
  date: '',
  quantity: '',
  question: false,
};

export const MODAL_TITLE = 'ייבוא ממערכת מקור';
