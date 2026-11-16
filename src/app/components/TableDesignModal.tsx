// Table / list display design for source-system fields.
// Ported from the refactored codebase (TemplateModal/components/FieldBank/TableDesignModal).
import { Table2, X, Plus, Check, List } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { CustomSelect } from './CustomSelect';

// ── Types ───────────────────────────────────────────────────────────
export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
export type FieldShape = 'table' | 'list' | 'text';

export interface CellStyle {
  background?: string;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  align?: 'left' | 'center' | 'right';
}

export type StyleTarget = 'header' | 'subheader' | 'key' | 'cell' | 'caption';
export type RuleOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains';

export interface StyleRule {
  id: string;
  column: string;
  operator: RuleOperator;
  value: string;
  style: CellStyle;
}

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

export interface FieldDesign {
  design: TableDesignOptions;
  renderAsTable: boolean;
}

// ── Sample values returned by source systems (only non-text fields) ──
export const FIELD_SAMPLE_VALUES: Record<string, JsonValue> = {
  'כוח זמין': [45, 30, 25],
  'כמות כלי רכב': [
    { סוג: "ג'יפ", כמות: 5 },
    { סוג: 'משאית', כמות: 3 },
    { סוג: 'נגמ"ש', כמות: 2 },
  ],
  'מלאי תחמושת': [4000, 1200, 300],
};

const isPlainObject = (v: JsonValue): v is { [key: string]: JsonValue } =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

export const inferFieldShape = (value: JsonValue | undefined): FieldShape => {
  if (!Array.isArray(value)) return 'text';
  return value.length > 0 && value.every(isPlainObject) ? 'table' : 'list';
};

export const fieldShapeOf = (fieldName: string): FieldShape => inferFieldShape(FIELD_SAMPLE_VALUES[fieldName]);

const tableColumnsOf = (value: JsonValue | undefined): string[] => {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  for (const row of value) if (isPlainObject(row)) Object.keys(row).forEach(k => seen.add(k));
  return [...seen];
};

// ── Option tables ───────────────────────────────────────────────────
const BACKGROUND_PRESETS: Record<string, string> = {
  'ברירת מחדל': '',
  ראשי: '#EEF4FF',
  הדגשה: '#2D9B8A',
  אזהרה: '#FFFBEB',
  סכנה: '#FBEAE9',
  אפור: '#F3F4F6',
};

const TEXT_COLOR_PRESETS: Record<string, string> = {
  'ברירת מחדל': '',
  ראשי: '#1B3A6B',
  כהה: '#111827',
  לבן: '#FFFFFF',
  אדום: '#C4342B',
};

const CELL_ALIGN_OPTIONS: Record<string, 'left' | 'center' | 'right'> = { ימין: 'right', מרכז: 'center', שמאל: 'left' };
const ALIGN_LABEL_BY_VALUE: Record<string, string> = { right: 'ימין', center: 'מרכז', left: 'שמאל' };

const STYLE_TARGET_LABELS: Record<StyleTarget, string> = {
  header: 'כותרת',
  subheader: 'כותרת משנה',
  key: 'תווית שורה',
  cell: 'תא נתונים',
  caption: 'כיתוב',
};
const STYLE_TARGETS = Object.keys(STYLE_TARGET_LABELS) as StyleTarget[];

const RULE_OPERATOR_LABELS: Record<RuleOperator, string> = {
  eq: 'שווה ל',
  neq: 'שונה מ',
  gt: 'גדול מ',
  gte: 'גדול או שווה ל',
  lt: 'קטן מ',
  lte: 'קטן או שווה ל',
  contains: 'מכיל',
};
const RULE_OPERATOR_FROM_LABEL = Object.fromEntries(
  Object.entries(RULE_OPERATOR_LABELS).map(([k, v]) => [v, k]),
) as Record<string, RuleOperator>;

const NO_ROW_TITLE = 'ללא';

// ── Small building blocks ───────────────────────────────────────────
function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" dir="ltr" aria-label={label} onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors duration-200 ${checked ? 'bg-[#1B3A6B]' : 'bg-gray-300'}`}>
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-4' : 'translate-x-0.5'}`} />
    </button>
  );
}

const FieldLabel = ({ children }: { children: ReactNode }) => (
  <span className="block text-xs font-medium text-gray-500 text-right">{children}</span>
);

const FieldRow = ({ children }: { children: ReactNode }) => <div className="flex flex-col gap-1.5">{children}</div>;

const ToggleRow = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
  <div className="flex items-center justify-between gap-3">
    <FieldLabel>{label}</FieldLabel>
    <Toggle checked={checked} onChange={onChange} label={label} />
  </div>
);

const SectionDivider = () => <div className="h-px bg-gray-100 my-1" />;

const textInputCls = 'w-full px-3 py-2 border border-gray-200 rounded-xl text-sm text-right bg-white focus:outline-none focus:border-[#1B3A6B] transition-colors';

function SwatchRow({ presets, value, onPick }: { presets: Record<string, string>; value: string; onPick: (v: string) => void }) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {Object.entries(presets).map(([name, preset]) => {
        const active = value === preset;
        return (
          <button key={name} type="button" title={name} aria-label={name} onClick={() => onPick(preset)}
            className={`relative w-6 h-6 rounded-full border transition-all ${active ? 'ring-2 ring-offset-1 ring-[#1B3A6B] border-transparent' : 'border-gray-200 hover:scale-110'}`}
            style={{ background: preset || '#FFFFFF' }}>
            {!preset && <span className="absolute inset-0 m-auto w-[2px] h-5 bg-red-400 rotate-45 rounded" />}
          </button>
        );
      })}
    </div>
  );
}

function CellStyleFields({ value, onChange }: { value: CellStyle; onChange: (next: CellStyle) => void }) {
  return (
    <div className="flex flex-col gap-3">
      <FieldRow>
        <FieldLabel>רקע</FieldLabel>
        <SwatchRow presets={BACKGROUND_PRESETS} value={value.background ?? ''} onPick={v => onChange({ ...value, background: v || undefined })} />
      </FieldRow>
      <FieldRow>
        <FieldLabel>צבע טקסט</FieldLabel>
        <SwatchRow presets={TEXT_COLOR_PRESETS} value={value.color ?? ''} onPick={v => onChange({ ...value, color: v || undefined })} />
      </FieldRow>
      <ToggleRow label="מודגש" checked={value.bold ?? false} onChange={bold => onChange({ ...value, bold })} />
      <ToggleRow label="נטוי" checked={value.italic ?? false} onChange={italic => onChange({ ...value, italic })} />
      <FieldRow>
        <FieldLabel>יישור</FieldLabel>
        <CustomSelect
          options={Object.keys(CELL_ALIGN_OPTIONS)}
          value={value.align ? ALIGN_LABEL_BY_VALUE[value.align] : undefined}
          onChange={label => onChange({ ...value, align: CELL_ALIGN_OPTIONS[label] })}
          placeholder="ברירת מחדל"
        />
      </FieldRow>
    </div>
  );
}

function ColumnStyleList({ columns, value, onChange }: {
  columns: string[]; value: Record<string, CellStyle>; onChange: (next: Record<string, CellStyle>) => void;
}) {
  const styled = Object.keys(value);
  const available = columns.filter(c => !styled.includes(c));
  return (
    <div className="flex flex-col gap-2">
      {styled.map(column => (
        <div key={column} className="border border-gray-100 rounded-xl p-3 bg-gray-50/60">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold text-[#1B3A6B]">{column}</span>
            <button type="button" aria-label={`הסרת עיצוב לעמודת ${column}`}
              onClick={() => { const next = { ...value }; delete next[column]; onChange(next); }}
              className="p-1 rounded-lg text-gray-400 hover:text-[#1B3A6B] hover:bg-white transition-colors">
              <X className="w-3 h-3" />
            </button>
          </div>
          <CellStyleFields value={value[column]} onChange={s => onChange({ ...value, [column]: s })} />
        </div>
      ))}
      {available.length > 0 && (
        <CustomSelect key={available.join('|')} options={available} placeholder="הוספת עיצוב לעמודה..."
          onChange={c => c && onChange({ ...value, [c]: {} })} />
      )}
    </div>
  );
}

function StyleRuleList({ columns, value, onChange }: {
  columns: string[]; value: StyleRule[]; onChange: (next: StyleRule[]) => void;
}) {
  const patchRule = (id: string, patch: Partial<StyleRule>) =>
    onChange(value.map(r => (r.id === id ? { ...r, ...patch } : r)));
  const add = () => {
    if (!columns.length) return;
    onChange([...value, { id: `rule-${Date.now()}`, column: columns[0], operator: 'eq', value: '', style: {} }]);
  };
  return (
    <div className="flex flex-col gap-2">
      {value.map(rule => (
        <div key={rule.id} className="border border-gray-100 rounded-xl p-3 bg-gray-50/60">
          <div className="flex items-start gap-2 mb-3">
            <div className="flex-1 grid grid-cols-3 gap-1.5">
              <CustomSelect options={columns} value={rule.column} onChange={column => patchRule(rule.id, { column })} />
              <CustomSelect options={Object.values(RULE_OPERATOR_LABELS)} value={RULE_OPERATOR_LABELS[rule.operator]}
                onChange={l => patchRule(rule.id, { operator: RULE_OPERATOR_FROM_LABEL[l] ?? 'eq' })} />
              <input value={rule.value} onChange={e => patchRule(rule.id, { value: e.target.value })} placeholder="ערך" className={textInputCls} />
            </div>
            <button type="button" aria-label="הסרת כלל עיצוב" onClick={() => onChange(value.filter(r => r.id !== rule.id))}
              className="mt-2 p-1 rounded-lg text-gray-400 hover:text-[#1B3A6B] hover:bg-white transition-colors">
              <X className="w-3 h-3" />
            </button>
          </div>
          <CellStyleFields value={rule.style} onChange={style => patchRule(rule.id, { style })} />
        </div>
      ))}
      <button type="button" onClick={add} disabled={!columns.length}
        className="flex items-center justify-center gap-1.5 w-full px-3 py-2 text-xs font-semibold text-[#1B3A6B] border border-dashed border-[#1B3A6B]/30 hover:border-[#1B3A6B]/60 hover:bg-[#EEF4FF]/50 rounded-xl transition-colors disabled:opacity-40">
        <Plus className="w-3.5 h-3.5" />
        הוספת כלל עיצוב
      </button>
    </div>
  );
}

// ── Modal ───────────────────────────────────────────────────────────
export function TableDesignModal({ fieldName, initial, onSave, onClose }: {
  fieldName: string;
  initial?: FieldDesign;
  onSave: (design: FieldDesign) => void;
  onClose: () => void;
}) {
  const value = FIELD_SAMPLE_VALUES[fieldName];
  const isTableSchema = inferFieldShape(value) === 'table';
  const [renderAsTable, setRenderAsTable] = useState(Boolean(initial?.renderAsTable));
  const [draft, setDraft] = useState<TableDesignOptions>(initial?.design ?? {});
  const [styleTarget, setStyleTarget] = useState<StyleTarget>('header');

  const showTableFields = isTableSchema || renderAsTable;
  const columns = isTableSchema ? tableColumnsOf(value) : ['#', 'value'];
  const patch = (next: Partial<TableDesignOptions>) => setDraft(prev => ({ ...prev, ...next }));
  const aggregate = draft.aggregate ?? [];

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
      onClick={onClose}>
      <div dir="rtl" className="bg-white rounded-2xl border border-gray-200 w-[480px] max-w-[94vw] max-h-[86vh] flex flex-col overflow-hidden"
        style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.04)' }}
        onClick={e => e.stopPropagation()} onMouseDown={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-[#EEF4FF]">
          <div className="flex items-center gap-2 min-w-0">
            <Table2 className="w-4 h-4 text-[#1B3A6B] flex-shrink-0" />
            <span className="text-sm font-semibold text-[#1B3A6B]">עיצוב תצוגה</span>
            <span className="text-xs text-[#1B3A6B]/50 truncate">· {fieldName}</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#1B3A6B]/10 transition-colors text-[#1B3A6B]/60 hover:text-[#1B3A6B]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
          {!isTableSchema && (
            <ToggleRow label="הצג כטבלה מעוצבת" checked={renderAsTable} onChange={setRenderAsTable} />
          )}

          {!showTableFields && (
            <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-gray-50 text-xs text-gray-500 leading-relaxed">
              <List className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              הרשימה תוצג כרשימה רגילה — הפעל/י את המתג כדי לעצב אותה כטבלה.
            </div>
          )}

          {showTableFields && (
            <>
              <FieldRow>
                <FieldLabel>כותרת</FieldLabel>
                <input value={draft.caption ?? ''} onChange={e => patch({ caption: e.target.value })} placeholder={fieldName} className={textInputCls} />
              </FieldRow>

              {isTableSchema && (
                <ToggleRow label='שורת סה"כ (Σ)' checked={draft.totals ?? true} onChange={totals => patch({ totals })} />
              )}

              {isTableSchema && columns.length > 0 && (
                <FieldRow>
                  <FieldLabel>איחוד שורות (Aggregate)</FieldLabel>
                  <div className="flex flex-wrap gap-1.5">
                    {columns.map(c => {
                      const on = aggregate.includes(c);
                      return (
                        <button key={c} type="button"
                          onClick={() => patch({ aggregate: on ? aggregate.filter(x => x !== c) : [...aggregate, c] })}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${on ? 'bg-[#1B3A6B] text-white border-[#1B3A6B]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#1B3A6B] hover:text-[#1B3A6B]'}`}>
                          {on && <Check className="w-3 h-3" strokeWidth={3} />}
                          {c}
                        </button>
                      );
                    })}
                    {!aggregate.length && <span className="text-[11px] text-gray-400 self-center mr-1">ללא איחוד</span>}
                  </div>
                </FieldRow>
              )}

              {isTableSchema && columns.length > 0 && (
                <FieldRow>
                  <FieldLabel>עמודת כותרת שורה</FieldLabel>
                  <CustomSelect options={[NO_ROW_TITLE, ...columns]} value={draft.rowTitleField ?? NO_ROW_TITLE}
                    onChange={v => patch({ rowTitleField: v === NO_ROW_TITLE ? undefined : v })} />
                </FieldRow>
              )}

              <SectionDivider />

              {columns.length > 0 && (
                <FieldRow>
                  <FieldLabel>תוויות עמודות</FieldLabel>
                  <div className="flex flex-col gap-1.5">
                    {columns.map(column => (
                      <div key={column} className="flex items-center gap-2">
                        <span className="w-20 flex-shrink-0 text-xs text-gray-500 truncate">{column}</span>
                        <input value={draft.labels?.[column] ?? ''} placeholder={column}
                          onChange={e => patch({ labels: { ...draft.labels, [column]: e.target.value } })}
                          className={textInputCls} />
                      </div>
                    ))}
                  </div>
                </FieldRow>
              )}

              <SectionDivider />

              <FieldRow>
                <FieldLabel>עיצוב לפי מיקום</FieldLabel>
                <div className="flex flex-wrap gap-1">
                  {STYLE_TARGETS.map(t => (
                    <button key={t} type="button" onClick={() => setStyleTarget(t)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${styleTarget === t ? 'bg-[#EEF4FF] text-[#1B3A6B] border-[#1B3A6B]/30' : 'text-gray-500 border-transparent hover:bg-gray-50'}`}>
                      {STYLE_TARGET_LABELS[t]}
                    </button>
                  ))}
                </div>
              </FieldRow>
              <CellStyleFields key={styleTarget} value={draft.targetStyles?.[styleTarget] ?? {}}
                onChange={style => patch({ targetStyles: { ...draft.targetStyles, [styleTarget]: style } })} />

              {isTableSchema && (
                <>
                  <SectionDivider />
                  <FieldRow>
                    <FieldLabel>עיצוב לפי עמודה</FieldLabel>
                    <ColumnStyleList columns={columns} value={draft.columnStyles ?? {}} onChange={columnStyles => patch({ columnStyles })} />
                  </FieldRow>

                  <SectionDivider />
                  <FieldRow>
                    <FieldLabel>כללי עיצוב מותנים</FieldLabel>
                    <StyleRuleList columns={columns} value={draft.rules ?? []} onChange={rules => patch({ rules })} />
                  </FieldRow>
                </>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 py-3.5 border-t border-gray-100">
          <button onClick={onClose}
            className="px-5 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">
            ביטול
          </button>
          <button onClick={() => { onSave({ design: draft, renderAsTable }); onClose(); }}
            className="px-5 py-2 bg-[#1B3A6B] text-white rounded-xl text-sm font-medium hover:bg-[#152e54] transition-colors">
            שמירה
          </button>
        </div>
      </div>
    </div>
  );
}
