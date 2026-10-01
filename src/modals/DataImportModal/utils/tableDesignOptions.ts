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

const invertRecord = <K extends string, V extends string>(record: Record<K, V>): Record<V, K> => {
  const inverted = {} as Record<V, K>;
  for (const key of Object.keys(record) as K[]) inverted[record[key]] = key;
  return inverted;
};

export const ALIGN_LABEL_BY_VALUE = invertRecord(CELL_ALIGN_OPTIONS);
export const STYLE_TARGET_FROM_LABEL = invertRecord(STYLE_TARGET_LABELS);
export const RULE_OPERATOR_FROM_LABEL = invertRecord(RULE_OPERATOR_LABELS);

export const tableColumnsOf = (value: JsonValue): string[] => {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  for (const row of value) {
    if (typeof row !== 'object' || row === null || Array.isArray(row)) continue;
    for (const key of Object.keys(row)) seen.add(key);
  }
  return [...seen];
};

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
