import { CAPTION_TEXT, TABLE_PROPS_DEFAULT } from './TablePropsModal.constants';
import type { CellPropsDraft, CellType, TablePropsDraft } from './TablePropsModal.types';

// A bare number is the unit the field asks for; anything else is taken as
// written, so `50%` and `2em` survive a round trip.
const toCssSize = (raw: string): string => {
  const value = raw.trim();
  if (!value) return '';
  return /^\d+(\.\d+)?$/.test(value) ? `${value}px` : value;
};

const setStyle = (el: HTMLElement, name: string, value: string) => {
  if (value) el.style.setProperty(name, value);
  else el.style.removeProperty(name);
};

const renameCell = (cell: HTMLTableCellElement, type: CellType): HTMLTableCellElement => {
  const replacement = cell.ownerDocument.createElement(type);
  for (const attribute of Array.from(cell.attributes)) {
    replacement.setAttribute(attribute.name, attribute.value);
  }
  replacement.append(...Array.from(cell.childNodes));
  cell.replaceWith(replacement);
  return replacement;
};

// [margin-right, margin-left] — an auto margin is what pushes the table off
// the opposite edge.
const ALIGN_MARGINS: Record<string, [string, string]> = {
  right: ['0', 'auto'],
  left: ['auto', '0'],
  center: ['auto', 'auto'],
};

const readAlign = (table: HTMLTableElement): string => {
  const { marginRight, marginLeft } = table.style;
  if (marginRight === 'auto' && marginLeft === 'auto') return 'center';
  if (marginLeft === 'auto') return 'right';
  if (marginRight === 'auto') return 'left';
  return '';
};

const applyAlign = (table: HTMLTableElement, align: string) => {
  const margins = ALIGN_MARGINS[align];
  setStyle(table, 'margin-right', margins?.[0] ?? '');
  setStyle(table, 'margin-left', margins?.[1] ?? '');
};

const applyCaption = (table: HTMLTableElement, show: boolean) => {
  if (!show) {
    table.deleteCaption();
    return;
  }
  if (table.caption) return;
  table.createCaption().textContent = CAPTION_TEXT;
};

export const readCellProps = (cell: HTMLTableCellElement): CellPropsDraft => ({
  width: cell.style.width,
  height: cell.style.height,
  type: cell.tagName.toLowerCase() === 'th' ? 'th' : 'td',
  scope: cell.getAttribute('scope') ?? '',
  hAlign: cell.style.textAlign,
  vAlign: cell.style.verticalAlign,
});

export const applyCellProps = (
  cell: HTMLTableCellElement,
  draft: CellPropsDraft,
): HTMLTableCellElement => {
  const target = cell.tagName.toLowerCase() === draft.type ? cell : renameCell(cell, draft.type);

  setStyle(target, 'width', toCssSize(draft.width));
  setStyle(target, 'height', toCssSize(draft.height));
  setStyle(target, 'text-align', draft.hAlign);
  setStyle(target, 'vertical-align', draft.vAlign);

  if (draft.scope) target.setAttribute('scope', draft.scope);
  else target.removeAttribute('scope');

  return target;
};

export const readTableProps = (table: HTMLTableElement): TablePropsDraft => {
  const cell = table.querySelector<HTMLTableCellElement>('td, th');

  return {
    width: table.style.width,
    height: table.style.height,
    cellSpacing: table.style.borderSpacing || TABLE_PROPS_DEFAULT.cellSpacing,
    cellPadding: cell?.style.padding || TABLE_PROPS_DEFAULT.cellPadding,
    borderWidth: table.style.borderWidth || TABLE_PROPS_DEFAULT.borderWidth,
    showCaption: table.caption !== null,
    align: readAlign(table),
  };
};

export const applyTableProps = (table: HTMLTableElement, draft: TablePropsDraft) => {
  setStyle(table, 'width', toCssSize(draft.width));
  setStyle(table, 'height', toCssSize(draft.height));

  // The presentational attributes and the styles below say the same thing, and
  // the ones left behind would win over what was just typed.
  table.removeAttribute('cellspacing');
  table.removeAttribute('cellpadding');
  table.removeAttribute('border');

  const spacing = toCssSize(draft.cellSpacing);
  setStyle(table, 'border-spacing', spacing);
  setStyle(table, 'border-collapse', spacing && spacing !== '0px' ? 'separate' : 'collapse');

  const padding = toCssSize(draft.cellPadding);
  const border = toCssSize(draft.borderWidth);

  setStyle(table, 'border-width', border);
  setStyle(table, 'border-style', border ? 'solid' : '');

  for (const cell of Array.from(table.querySelectorAll<HTMLTableCellElement>('td, th'))) {
    setStyle(cell, 'padding', padding);
    setStyle(cell, 'border-width', border);
    setStyle(cell, 'border-style', border ? 'solid' : '');
  }

  applyCaption(table, draft.showCaption);
  applyAlign(table, draft.align);
};
