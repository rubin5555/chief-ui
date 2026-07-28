import type { ChangeEvent } from 'react';
import { SECTION_TABLE_VIEW_IDS } from '../../SectionTableView.testids';
import { CellField } from './TableCellInput.styles';

export interface TableCellInputProps {
  row: number;
  col: number;
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
}

/** Height is cleared before measuring, or a shrinking cell keeps the height it grew to. */
const fitToContent = (element: HTMLTextAreaElement | null) => {
  if (!element) return;
  element.style.height = 'auto';
  element.style.height = `${element.scrollHeight}px`;
};

// A cell that grows downward as it fills, so a long entry pushes the row taller
// rather than scrolling inside a box the reader can't see the bottom of.
export const TableCellInput = ({ row, col, value, onChange, onFocus }: TableCellInputProps) => {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
    fitToContent(event.currentTarget);
  };

  return (
    <CellField
      ref={fitToContent}
      rows={1}
      value={value}
      aria-label={`שורה ${row + 1}, עמודה ${col + 1}`}
      data-testid={SECTION_TABLE_VIEW_IDS.cell(row, col)}
      onChange={handleChange}
      onFocus={onFocus}
    />
  );
};
