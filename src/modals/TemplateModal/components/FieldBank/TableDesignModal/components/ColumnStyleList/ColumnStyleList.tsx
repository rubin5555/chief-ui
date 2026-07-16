import { X } from 'lucide-react';
import { Select } from '@/components/ui/Select';
import type { CellStyle } from '@/lib/json-table';
import { CellStyleFields } from '../CellStyleFields';
import { Block, BlockHeader, BlockName, ListWrap, RemoveBtn } from './ColumnStyleList.styles';
import { COLUMN_STYLE_LIST_IDS } from './ColumnStyleList.testids';

interface ColumnStyleListProps {
  columns: string[];
  value: Record<string, CellStyle>;
  onChange: (next: Record<string, CellStyle>) => void;
}

// Per-column base style (json-table's styles.fields[column]) — only meaningful for
// matrix tables, where every cell carries a real dotted path (see TableDesignModal's
// isTableSchema gating; listTable never threads a path to its '#'/'value' cells).
export const ColumnStyleList = ({ columns, value, onChange }: ColumnStyleListProps) => {
  const styledColumns = Object.keys(value);
  const availableColumns = columns.filter((column) => !styledColumns.includes(column));

  const handleAdd = (column: string) => {
    if (!column) return;
    onChange({ ...value, [column]: {} });
  };
  const handleRemove = (column: string) => () => {
    const next = { ...value };
    delete next[column];
    onChange(next);
  };
  const handleColumnStyleChange = (column: string) => (style: CellStyle) =>
    onChange({ ...value, [column]: style });

  return (
    <ListWrap>
      {styledColumns.map((column) => (
        <Block key={column} data-testid={COLUMN_STYLE_LIST_IDS.row(column)}>
          <BlockHeader>
            <BlockName>{column}</BlockName>
            <RemoveBtn
              type="button"
              onClick={handleRemove(column)}
              aria-label={`הסרת עיצוב לעמודת ${column}`}
              data-testid={COLUMN_STYLE_LIST_IDS.removeBtn(column)}
            >
              <X size={12} />
            </RemoveBtn>
          </BlockHeader>
          <CellStyleFields
            idPrefix={`column-${column}`}
            value={value[column]}
            onChange={handleColumnStyleChange(column)}
          />
        </Block>
      ))}
      {availableColumns.length > 0 && (
        <Select
          key={availableColumns.join('|')}
          options={availableColumns}
          onChange={handleAdd}
          placeholder="הוספת עיצוב לעמודה..."
          data-testid={COLUMN_STYLE_LIST_IDS.addSelect}
        />
      )}
    </ListWrap>
  );
};
