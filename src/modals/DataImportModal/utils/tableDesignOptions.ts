import type {
  FieldStyle,
  JsonPrimitive,
  JsonValue,
  RenderOptions,
  StyleWhen,
  TableStyles,
} from '@/lib/json-table';
import { mergeStyles } from '@/lib/json-table';
import { colors, gray } from '@/styles/theme';
import type {
  RuleOperator,
  StyleRule,
  StyleTarget,
  TableDesignOptions,
} from '../DataImportModal.constants';

// Swatch presets for background/text color — kept to theme tokens (not a freeform
// color picker) so table design stays dark-mode safe like the rest of the app.
export const BACKGROUND_PRESETS: Record<string, string> = {
  'ברירת מחדל': '',
  ראשי: colors.primaryLight,
  הדגשה: colors.accent,
  אזהרה: colors.warningLight,
  סכנה: colors.dangerLight,
  אפור: gray[100],
};

export const TEXT_COLOR_PRESETS: Record<string, string> = {
  'ברירת מחדל': '',
  ראשי: colors.primary,
  כהה: gray[900],
  לבן: colors.surface,
  אדום: colors.danger,
};

export const CELL_ALIGN_OPTIONS: Record<string, 'left' | 'center' | 'right'> = {
  ימין: 'right',
  מרכז: 'center',
  שמאל: 'left',
};

export const STYLE_TARGET_LABELS: Record<StyleTarget, string> = {
  header: 'כותרת',
  subheader: 'כותרת משנה',
  key: 'תווית שורה',
  cell: 'תא נתונים',
  caption: 'כיתוב',
};

export const RULE_OPERATOR_LABELS: Record<RuleOperator, string> = {
  eq: 'שווה ל',
  neq: 'שונה מ',
  gt: 'גדול מ',
  gte: 'גדול או שווה ל',
  lt: 'קטן מ',
  lte: 'קטן או שווה ל',
  contains: 'מכיל',
};

// Builds the value→key reverse of a label map once, so a Select bound to a typed enum
// (StyleTarget, RuleOperator, align direction) can resolve its picked label back to the
// enum value with an O(1) lookup instead of an Object.entries().find() on every call.
const invertRecord = <K extends string, V extends string>(record: Record<K, V>): Record<V, K> => {
  const inverted = {} as Record<V, K>;
  for (const key of Object.keys(record) as K[]) inverted[record[key]] = key;
  return inverted;
};

export const ALIGN_LABEL_BY_VALUE = invertRecord(CELL_ALIGN_OPTIONS);
export const STYLE_TARGET_FROM_LABEL = invertRecord(STYLE_TARGET_LABELS);
export const RULE_OPERATOR_FROM_LABEL = invertRecord(RULE_OPERATOR_LABELS);

// Column keys for a table-shape field's sample value (union of keys across records,
// first-seen order) — what a user picks from for aggregate/row-title/labels/rules.
export const tableColumnsOf = (value: JsonValue): string[] => {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  for (const row of value) {
    if (typeof row !== 'object' || row === null || Array.isArray(row)) continue;
    for (const key of Object.keys(row)) seen.add(key);
  }
  return [...seen];
};

// Evaluates one rule's condition against a cell's raw value. Numeric operators coerce
// both sides to numbers (so "5" and 5 compare equal); 'contains' always compares as
// case-insensitive strings.
const compareRule = (
  raw: JsonPrimitive | undefined,
  operator: RuleOperator,
  ruleValue: string,
): boolean => {
  if (raw === undefined || raw === null) return false;
  if (operator === 'contains') return String(raw).toLowerCase().includes(ruleValue.toLowerCase());

  const rawNum = typeof raw === 'boolean' ? Number.NaN : Number(raw);
  const ruleNum = Number(ruleValue);
  const numeric = !Number.isNaN(rawNum) && !Number.isNaN(ruleNum);
  switch (operator) {
    case 'eq':
      return numeric ? rawNum === ruleNum : String(raw) === ruleValue;
    case 'neq':
      return numeric ? rawNum !== ruleNum : String(raw) !== ruleValue;
    case 'gt':
      return numeric && rawNum > ruleNum;
    case 'gte':
      return numeric && rawNum >= ruleNum;
    case 'lt':
      return numeric && rawNum < ruleNum;
    case 'lte':
      return numeric && rawNum <= ruleNum;
    default:
      return false;
  }
};

// Compiles every rule targeting one column into a single StyleWhen: every matching
// rule's style is merged (later rule in the list wins on conflicting properties).
const buildWhen = (rules: StyleRule[]): StyleWhen => {
  return (value) => {
    const matched = rules
      .filter((rule) => compareRule(value, rule.operator, rule.value))
      .map((rule) => rule.style);
    return matched.length ? mergeStyles(...matched) : undefined;
  };
};

const groupRulesByColumn = (rules: StyleRule[]): Record<string, StyleRule[]> => {
  const grouped: Record<string, StyleRule[]> = {};
  for (const rule of rules) {
    if (!grouped[rule.column]) grouped[rule.column] = [];
    grouped[rule.column].push(rule);
  }
  return grouped;
};

// Maps our flat form-friendly TableDesignOptions onto json-table's real RenderOptions —
// this is the only place that translates "what the user picked" into "what json-table
// understands," so buildFieldTableHtml stays a thin caller.
//
// supportsFieldStyles must be true for genuine matrix tables (array-of-objects) only:
// per-field styling (columnStyles/rules) keys off a cell's dotted path, and json-table's
// listTable() never threads one through (see render.ts's listTable — emitCell/res.key are
// called with no path), so those rules would silently no-op there. TableDesignModal's UI
// already gates the controls that populate columnStyles/rules to table-shape fields, but
// this second check means stale/mistaken data on a non-table draft is dropped here too,
// rather than relying solely on the UI never producing it.
export const toRenderOptions = (
  design: TableDesignOptions | undefined,
  fallbackCaption: string,
  supportsFieldStyles: boolean,
): RenderOptions => {
  if (!design) return { caption: fallbackCaption, totals: true };

  const fields: Record<string, FieldStyle> = {};
  if (supportsFieldStyles) {
    for (const [column, style] of Object.entries(design.columnStyles ?? {})) {
      fields[column] = { ...fields[column], ...style };
    }
    for (const [column, rules] of Object.entries(groupRulesByColumn(design.rules ?? []))) {
      fields[column] = { ...fields[column], when: buildWhen(rules) };
    }
  }

  const hasTargetStyles = Boolean(
    design.targetStyles && Object.values(design.targetStyles).some(Boolean),
  );
  const styles: TableStyles | undefined =
    hasTargetStyles || Object.keys(fields).length
      ? {
          header: design.targetStyles?.header,
          subheader: design.targetStyles?.subheader,
          key: design.targetStyles?.key,
          cell: design.targetStyles?.cell,
          caption: design.targetStyles?.caption,
          fields: Object.keys(fields).length ? fields : undefined,
        }
      : undefined;

  return {
    caption: design.caption || fallbackCaption,
    totals: design.totals ?? true,
    aggregate: design.aggregate?.length ? design.aggregate : undefined,
    rowTitles: design.rowTitleField || undefined,
    labels: design.labels && Object.keys(design.labels).length ? design.labels : undefined,
    styles,
  };
};
