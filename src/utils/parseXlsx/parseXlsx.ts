import { readZip } from './readZip';

// Reading one column out of an .xlsx, which is a ZIP holding the sheet as XML
// and — because Excel stores every distinct string once — a separate table of
// the strings its cells point at.

const WORKSHEET_PART = /^xl\/worksheets\/sheet\d+\.xml$/;
const SHARED_STRINGS_PART = 'xl/sharedStrings.xml';

const parseXml = (xml: string): Document => {
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  // DOMParser reports a malformed document by *returning* one, with the error
  // as an element, rather than by throwing.
  if (doc.getElementsByTagName('parsererror').length > 0) {
    throw new Error('malformed spreadsheet xml');
  }
  return doc;
};

const textOf = (element: Element): string =>
  Array.from(element.getElementsByTagName('t'))
    .map((node) => node.textContent ?? '')
    .join('');

/** One entry per distinct string in the workbook; cells refer to these by index. */
const readSharedStrings = (xml: string): string[] =>
  Array.from(parseXml(xml).getElementsByTagName('si')).map(textOf);

const cellValue = (cell: Element, sharedStrings: string[]): string => {
  const type = cell.getAttribute('t');
  // A string written into the cell itself rather than the shared table.
  if (type === 'inlineStr') return textOf(cell);
  const raw = cell.getElementsByTagName('v')[0]?.textContent ?? '';
  if (type === 's') return sharedStrings[Number(raw)] ?? '';
  return raw;
};

const columnCells = (xml: string, column: string, sharedStrings: string[]): string[] => {
  // A cell's `r` is its spreadsheet reference — "A7" is column A, row 7.
  const inColumn = new RegExp(`^${column}\\d+$`);
  return Array.from(parseXml(xml).getElementsByTagName('c'))
    .filter((cell) => inColumn.test(cell.getAttribute('r') ?? ''))
    .map((cell) => cellValue(cell, sharedStrings).trim())
    .filter((value) => value !== '');
};

/**
 * Every non-empty value in one column of the workbook's first sheet, in row
 * order. Blank cells are dropped rather than returned as empty strings — a
 * spreadsheet's trailing rows are an artefact of how it was saved, not data.
 *
 * Throws if the file isn't a readable .xlsx; the caller decides what to say.
 */
export const parseXlsxColumn = async (file: File, column = 'A'): Promise<string[]> => {
  const parts = readZip(await file.arrayBuffer());

  // Sheets are numbered, so the lowest-numbered part is the first tab. (The
  // strictly correct route is workbook.xml → its relationships → the target
  // part, which is three more files read to reach the same answer in every
  // spreadsheet anyone will upload here.)
  const [sheet] = parts
    .filter((part) => WORKSHEET_PART.test(part.name))
    .sort((a, b) => a.name.localeCompare(b.name));
  if (!sheet) throw new Error('no worksheet in file');

  const sharedStringsPart = parts.find((part) => part.name === SHARED_STRINGS_PART);
  const sharedStrings = sharedStringsPart
    ? readSharedStrings(await sharedStringsPart.readText())
    : [];

  return columnCells(await sheet.readText(), column, sharedStrings);
};
