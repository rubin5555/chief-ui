import { Plus, X } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { Select } from '@/components/ui/Select';
import type { CellStyle } from '@/lib/json-table';
import type { StyleRule } from '@/modals/DataImportModal/DataImportModal.constants';
import {
  RULE_OPERATOR_FROM_LABEL,
  RULE_OPERATOR_LABELS,
} from '@/modals/DataImportModal/utils/tableDesignOptions';
import { TextInput } from '../../TableDesignModal.styles';
import { CellStyleFields } from '../CellStyleFields';
import {
  AddRuleBtn,
  Block,
  BlockHeader,
  ConditionRow,
  ListWrap,
  RemoveBtn,
} from './StyleRuleList.styles';
import { STYLE_RULE_LIST_IDS } from './StyleRuleList.testids';

interface StyleRuleListProps {
  columns: string[];
  value: StyleRule[];
  onChange: (next: StyleRule[]) => void;
}

const OPERATOR_LABELS = Object.values(RULE_OPERATOR_LABELS);

export const StyleRuleList = ({ columns, value, onChange }: StyleRuleListProps) => {
  const handleAdd = () => {
    if (columns.length === 0) return;
    const rule: StyleRule = {
      id: `rule-${self.crypto.randomUUID()}`,
      column: columns[0],
      operator: 'eq',
      value: '',
      style: {},
    };
    onChange([...value, rule]);
  };
  const handleRemove = (id: string) => () => onChange(value.filter((rule) => rule.id !== id));
  const patchRule = (id: string, patch: Partial<StyleRule>) =>
    onChange(value.map((rule) => (rule.id === id ? { ...rule, ...patch } : rule)));

  const handleColumnChange = (id: string) => (column: string) => patchRule(id, { column });
  const handleOperatorChange = (id: string) => (label: string) =>
    patchRule(id, { operator: RULE_OPERATOR_FROM_LABEL[label] ?? 'eq' });
  const handleValueChange = (id: string) => (e: ChangeEvent<HTMLInputElement>) =>
    patchRule(id, { value: e.target.value });
  const handleStyleChange = (id: string) => (style: CellStyle) => patchRule(id, { style });

  return (
    <ListWrap>
      {value.map((rule) => (
        <Block key={rule.id} data-testid={STYLE_RULE_LIST_IDS.row(rule.id)}>
          <BlockHeader>
            <ConditionRow>
              <Select
                options={columns}
                value={rule.column}
                onChange={handleColumnChange(rule.id)}
                data-testid={STYLE_RULE_LIST_IDS.columnSelect(rule.id)}
              />
              <Select
                options={OPERATOR_LABELS}
                value={RULE_OPERATOR_LABELS[rule.operator]}
                onChange={handleOperatorChange(rule.id)}
                data-testid={STYLE_RULE_LIST_IDS.operatorSelect(rule.id)}
              />
              <TextInput
                value={rule.value}
                onChange={handleValueChange(rule.id)}
                placeholder="ערך"
                data-testid={STYLE_RULE_LIST_IDS.valueInput(rule.id)}
              />
            </ConditionRow>
            <RemoveBtn
              type="button"
              onClick={handleRemove(rule.id)}
              aria-label="הסרת כלל עיצוב"
              data-testid={STYLE_RULE_LIST_IDS.removeBtn(rule.id)}
            >
              <X size={12} />
            </RemoveBtn>
          </BlockHeader>
          <CellStyleFields
            idPrefix={`rule-${rule.id}`}
            value={rule.style}
            onChange={handleStyleChange(rule.id)}
          />
        </Block>
      ))}
      <AddRuleBtn
        type="button"
        onClick={handleAdd}
        disabled={columns.length === 0}
        data-testid={STYLE_RULE_LIST_IDS.addBtn}
      >
        <Plus size={14} />
        הוספת כלל עיצוב
      </AddRuleBtn>
    </ListWrap>
  );
};
