import { CellProperties, RowProperties, TableProperties } from '../types';
import { createTableCell, ensureCellEditor } from './gridMatrix';
import { toggleTableCaption } from './tableUtils';

/**
 * Helper to convert `rgb(r, g, b)` to `#rrggbb` for color inputs.
 */
export function rgbToHex(color: string): string {
  if (!color) return '';
  const trimmed = color.trim();
  if (trimmed.startsWith('#')) {
    if (trimmed.length === 4) {
      return `#${trimmed[1]}${trimmed[1]}${trimmed[2]}${trimmed[2]}${trimmed[3]}${trimmed[3]}`;
    }
    return trimmed;
  }
  const match = trimmed.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (!match) return '';
  const r = parseInt(match[1], 10).toString(16).padStart(2, '0');
  const g = parseInt(match[2], 10).toString(16).padStart(2, '0');
  const b = parseInt(match[3], 10).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

/**
 * Applies a quick border preset to the entire table.
 */
export function applyTableBorderPreset(
  table: HTMLTableElement,
  preset: 'grid' | 'horizontal' | 'outer' | 'none',
  borderColor = '#cbd5e1',
  borderWidth = '1px'
): void {
  const cells = Array.from(table.querySelectorAll('td, th')) as HTMLTableCellElement[];
  table.dataset.borderPreset = preset;

  if (preset === 'grid') {
    table.style.border = `${borderWidth} solid ${borderColor}`;
    cells.forEach((c) => {
      c.style.border = `${borderWidth} solid ${borderColor}`;
    });
  } else if (preset === 'horizontal') {
    table.style.borderTop = `${borderWidth} solid ${borderColor}`;
    table.style.borderBottom = `${borderWidth} solid ${borderColor}`;
    table.style.borderLeft = 'none';
    table.style.borderRight = 'none';
    cells.forEach((c) => {
      c.style.borderTop = `${borderWidth} solid ${borderColor}`;
      c.style.borderBottom = `${borderWidth} solid ${borderColor}`;
      c.style.borderLeft = 'none';
      c.style.borderRight = 'none';
    });
  } else if (preset === 'outer') {
    table.style.border = `${borderWidth} solid ${borderColor}`;
    cells.forEach((c) => {
      c.style.border = 'none';
    });
  } else if (preset === 'none') {
    table.style.border = 'none';
    cells.forEach((c) => {
      c.style.border = 'none';
    });
  }
}

/**
 * Reads TableProperties from an HTMLTableElement for the Table Properties Dialog.
 */
export function readTableProperties(table: HTMLTableElement): TableProperties {
  const caption = table.querySelector(':scope > caption');
  const firstCell = table.querySelector('td, th') as HTMLElement | null;
  let align: TableProperties['align'] = 'none';
  if (table.style.marginLeft === 'auto' && table.style.marginRight === 'auto') {
    align = 'center';
  } else if (table.style.marginLeft === 'auto') {
    align = 'right';
  } else if (table.style.marginRight === 'auto') {
    align = 'left';
  }

  return {
    width: table.style.width || '100%',
    height: table.style.height || '',
    align,
    cellPadding: firstCell?.style.padding || '10px 12px',
    borderWidth: table.dataset.borderWidth || '1px',
    borderStyle: (table.dataset.borderStyle as TableProperties['borderStyle']) || 'solid',
    borderColor: rgbToHex(table.dataset.borderColor || table.style.borderColor || '#cbd5e1'),
    backgroundColor: rgbToHex(table.style.backgroundColor || ''),
    borderCollapse: (table.style.borderCollapse as 'collapse' | 'separate') || 'collapse',
    borderSpacing: table.style.borderSpacing || '0px',
    hasCaption: Boolean(caption),
    captionText: caption?.textContent || '',
    stripedRows: table.classList.contains('ql-tiny-table-striped'),
    hoverHighlight: table.classList.contains('ql-tiny-table-hover'),
  };
}

/**
 * Writes TableProperties to an HTMLTableElement.
 */
export function writeTableProperties(table: HTMLTableElement, props: TableProperties): void {
  table.style.width = props.width || '100%';
  table.style.height = props.height || '';
  table.style.borderCollapse = props.borderCollapse;
  table.style.borderSpacing =
    props.borderCollapse === 'separate' ? props.borderSpacing || '4px' : '0px';
  table.style.backgroundColor = props.backgroundColor || '';

  if (props.align === 'center') {
    table.style.marginLeft = 'auto';
    table.style.marginRight = 'auto';
  } else if (props.align === 'right') {
    table.style.marginLeft = 'auto';
    table.style.marginRight = '0';
  } else if (props.align === 'left') {
    table.style.marginLeft = '0';
    table.style.marginRight = 'auto';
  } else {
    table.style.marginLeft = '';
    table.style.marginRight = '';
  }

  table.dataset.borderWidth = props.borderWidth;
  table.dataset.borderStyle = props.borderStyle;
  table.dataset.borderColor = props.borderColor;

  const borderVal =
    props.borderStyle === 'none' || props.borderWidth === '0px' || props.borderWidth === '0'
      ? 'none'
      : `${props.borderWidth || '1px'} ${props.borderStyle || 'solid'} ${props.borderColor || '#cbd5e1'}`;

  table.style.border = borderVal;
  Array.from(table.querySelectorAll('td, th')).forEach((cell) => {
    const el = cell as HTMLElement;
    el.style.border = borderVal;
    if (props.cellPadding) {
      el.style.padding = props.cellPadding;
    }
  });

  if (props.hasCaption) {
    toggleTableCaption(table, props.captionText || 'Table Caption');
  } else {
    const cap = table.querySelector(':scope > caption');
    cap?.remove();
  }

  table.classList.toggle('ql-tiny-table-striped', props.stripedRows);
  table.classList.toggle('ql-tiny-table-hover', props.hoverHighlight);
}

/**
 * Reads CellProperties from a reference cell.
 */
export function readCellProperties(cell: HTMLTableCellElement): CellProperties {
  return {
    width: cell.style.width || '',
    height: cell.style.height || '',
    cellType: cell.tagName.toLowerCase() === 'th' ? 'th' : 'td',
    scope: (cell.getAttribute('scope') as CellProperties['scope']) || '',
    hAlign: (cell.style.textAlign as CellProperties['hAlign']) || '',
    vAlign: (cell.style.verticalAlign as CellProperties['vAlign']) || 'top',
    backgroundColor: rgbToHex(cell.style.backgroundColor || ''),
    borderWidth: cell.dataset.borderWidth || '1px',
    borderStyle: (cell.dataset.borderStyle as CellProperties['borderStyle']) || 'solid',
    borderColor: rgbToHex(cell.dataset.borderColor || cell.style.borderColor || '#cbd5e1'),
    padding: cell.style.padding || '10px 12px',
    whiteSpace: cell.style.whiteSpace === 'nowrap' ? 'nowrap' : 'normal',
  };
}

/**
 * Writes CellProperties to one or more selected cells.
 */
export function writeCellProperties(
  _table: HTMLTableElement,
  cells: HTMLTableCellElement[],
  props: CellProperties
): HTMLTableCellElement[] {
  return cells.map((cell) => {
    let target = cell;
    const currentTag = cell.tagName.toLowerCase();
    if (props.cellType && currentTag !== props.cellType) {
      const replacement = createTableCell(
        props.cellType,
        cell,
        ensureCellEditor(cell).innerHTML
      );
      if (cell.rowSpan > 1) replacement.rowSpan = cell.rowSpan;
      if (cell.colSpan > 1) replacement.colSpan = cell.colSpan;
      cell.parentElement?.replaceChild(replacement, cell);
      target = replacement;
    }

    target.style.width = props.width || '';
    target.style.height = props.height || '';
    if (props.scope) {
      target.setAttribute('scope', props.scope);
    } else {
      target.removeAttribute('scope');
    }
    target.style.textAlign = props.hAlign || '';
    target.style.verticalAlign = props.vAlign || '';
    target.style.backgroundColor = props.backgroundColor || '';
    target.style.padding = props.padding || '';
    target.style.whiteSpace = props.whiteSpace === 'nowrap' ? 'nowrap' : '';

    if (props.borderStyle) {
      target.dataset.borderWidth = props.borderWidth;
      target.dataset.borderStyle = props.borderStyle;
      target.dataset.borderColor = props.borderColor;
      if (props.borderStyle === 'none' || props.borderWidth === '0px') {
        target.style.border = 'none';
      } else {
        target.style.border = `${props.borderWidth || '1px'} ${props.borderStyle} ${props.borderColor || '#cbd5e1'}`;
      }
    }

    return target;
  });
}

/**
 * Reads RowProperties from a `<tr>` element.
 */
export function readRowProperties(tr: HTMLTableRowElement): RowProperties {
  const parentTag = tr.parentElement?.tagName.toLowerCase();
  const rowType: RowProperties['rowType'] =
    parentTag === 'thead' ? 'thead' : parentTag === 'tfoot' ? 'tfoot' : 'tbody';

  return {
    rowType,
    height: tr.style.height || '',
    hAlign: (tr.style.textAlign as RowProperties['hAlign']) || '',
    vAlign: (tr.style.verticalAlign as RowProperties['vAlign']) || '',
    backgroundColor: rgbToHex(tr.style.backgroundColor || ''),
    borderBottomColor: rgbToHex(tr.dataset.borderBottomColor || '#cbd5e1'),
    borderBottomWidth: tr.dataset.borderBottomWidth || '',
    borderBottomStyle: (tr.dataset.borderBottomStyle as RowProperties['borderBottomStyle']) || '',
  };
}

/**
 * Writes RowProperties to a `<tr>` element.
 */
export function writeRowProperties(
  table: HTMLTableElement,
  tr: HTMLTableRowElement,
  props: RowProperties
): void {
  tr.style.height = props.height || '';
  tr.style.textAlign = props.hAlign || '';
  tr.style.verticalAlign = props.vAlign || '';
  tr.style.backgroundColor = props.backgroundColor || '';

  Array.from(tr.cells).forEach((cell) => {
    if (props.backgroundColor) cell.style.backgroundColor = props.backgroundColor;
    if (props.hAlign) cell.style.textAlign = props.hAlign;
    if (props.vAlign) cell.style.verticalAlign = props.vAlign;
    if (props.borderBottomStyle) {
      tr.dataset.borderBottomStyle = props.borderBottomStyle;
      tr.dataset.borderBottomWidth = props.borderBottomWidth || '1px';
      tr.dataset.borderBottomColor = props.borderBottomColor || '#cbd5e1';
      cell.style.borderBottom =
        props.borderBottomStyle === 'none'
          ? 'none'
          : `${props.borderBottomWidth || '1px'} ${props.borderBottomStyle} ${props.borderBottomColor || '#cbd5e1'}`;
    }
  });

  const currentSection = tr.parentElement?.tagName.toLowerCase();
  if (currentSection !== props.rowType) {
    if (props.rowType === 'thead') {
      const thead = table.tHead || table.createTHead();
      thead.appendChild(tr);
    } else if (props.rowType === 'tfoot') {
      const tfoot = table.tFoot || table.createTFoot();
      tfoot.appendChild(tr);
    } else {
      const tbody = table.tBodies[0] || table.createTBody();
      tbody.appendChild(tr);
    }
  }
}
