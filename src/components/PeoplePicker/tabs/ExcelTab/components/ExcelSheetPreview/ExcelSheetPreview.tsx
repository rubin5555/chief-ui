import { SHEET_COLUMNS, SHEET_ROWS, TARGET_COLUMN } from '../../ExcelTab.constants';
import {
  ColumnHeaderCell,
  DataCell,
  GutterCell,
  PreviewArea,
  PreviewCaption,
  SheetFrame,
  SheetRow,
} from './ExcelSheetPreview.styles';

const EMPTY_COLUMNS = SHEET_COLUMNS.slice(1);
const LAST_COLUMN_INDEX = SHEET_COLUMNS.length - 1;

export const ExcelSheetPreview = () => (
  <PreviewArea>
    <PreviewCaption>לדוגמא:</PreviewCaption>

    <SheetFrame aria-hidden="true">
      <SheetRow>
        <GutterCell />
        {SHEET_COLUMNS.map((column, index) => (
          <ColumnHeaderCell
            key={column}
            $isTarget={column === TARGET_COLUMN}
            $isLast={index === LAST_COLUMN_INDEX}
          >
            {column}
          </ColumnHeaderCell>
        ))}
      </SheetRow>

      {SHEET_ROWS.map((row, index) => (
        <SheetRow key={row.id} $zebra={index % 2 === 1}>
          <GutterCell>{index + 1}</GutterCell>
          <DataCell $isActive={index === 0}>{row.value}</DataCell>
          {EMPTY_COLUMNS.map((column, columnIndex) => (
            <DataCell key={column} $isLast={columnIndex === EMPTY_COLUMNS.length - 1} />
          ))}
        </SheetRow>
      ))}
    </SheetFrame>
  </PreviewArea>
);
