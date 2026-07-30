import { readZip } from './readZip';

const WORKSHEET_PART = /^xl\/worksheets\/sheet\d+\.xml$/;
const SHARED_STRINGS_PART = 'xl/sharedStrings.xml';

const parseXml = (xml: string): Document => {
  const doc = new DOMParser().parseFromString(xml, 'application/xml');

  if (doc.getElementsByTagName('parsererror').length > 0) {
    throw new Error('malformed spreadsheet xml');
  }
  return doc;
};

const textOf = (element: Element): string =>
  Array.from(element.getElementsByTagName('t'))
    .map((node) => node.textContent ?? '')
    .join('');

const readSharedStrings = (xml: string): string[] =>
  Array.from(parseXml(xml).getElementsByTagName('si')).map(textOf);

const cellValue = (cell: Element, sharedStrings: string[]): string => {
  const type = cell.getAttribute('t');

  if (type === 'inlineStr') return textOf(cell);
  const raw = cell.getElementsByTagName('v')[0]?.textContent ?? '';
  if (type === 's') return sharedStrings[Number(raw)] ?? '';
  return raw;
};

const columnCells = (xml: string, column: string, sharedStrings: string[]): string[] => {
  const inColumn = new RegExp(`^${column}\\d+$`);
  return Array.from(parseXml(xml).getElementsByTagName('c'))
    .filter((cell) => inColumn.test(cell.getAttribute('r') ?? ''))
    .map((cell) => cellValue(cell, sharedStrings).trim())
    .filter((value) => value !== '');
};

export const parseXlsxColumn = async (file: File, column = 'A'): Promise<string[]> => {
  const parts = readZip(await file.arrayBuffer());

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
