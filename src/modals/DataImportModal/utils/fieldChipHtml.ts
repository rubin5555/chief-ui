import { renderListHtml as renderJsonList, render as renderJsonTable } from '@/lib/json-table';
import { colors } from '@/styles/theme';
import type { DynamicField, FieldShape } from '../DataImportModal.constants';
import { toRenderOptions } from './tableDesignOptions';

// Inline SVG database glyph — stroke follows the chip's text color via currentColor.
const DB_ICON_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;display:inline-block;vertical-align:middle;margin-left:2px"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/></svg>';

// Every color below is a var(--token) reference from the theme, so chips stored inside
// field HTML keep following the palette (including dark mode) wherever they render.
const CHIP_STYLE = [
  'display:inline-flex',
  'align-items:center',
  'gap:3px',
  'padding:3px 8px 3px 6px',
  `background:${colors.primaryLight}`,
  `border:1px solid color-mix(in srgb, ${colors.primary} 25%, transparent)`,
  'border-radius:8px',
  'font-size:11px',
  `color:${colors.primary}`,
  'font-weight:600',
  'cursor:grab',
  'white-space:nowrap',
  'user-select:none',
  'line-height:1.5',
  `box-shadow:0 1px 2px color-mix(in srgb, ${colors.primary} 8%, transparent)`,
  'vertical-align:middle',
].join(';');

const META_STYLE = 'font-weight:400;opacity:0.5;font-size:9.5px';

const REMOVE_BTN_STYLE =
  'margin-right:5px;opacity:0.4;cursor:pointer;background:none;border:none;color:inherit;padding:0;line-height:1;font-size:13px;font-family:inherit';

const TOGGLE_BTN_STYLE =
  'margin-right:5px;opacity:0.55;cursor:pointer;background:none;border:none;color:inherit;padding:0;line-height:1;font-size:11px;font-family:inherit';

// Block container for the list/table shapes — same palette as the inline chip, but
// laid out as a block since a table or a multi-item list can't stay inline like text.
const BLOCK_STYLE = [
  'display:block',
  'margin:6px 0',
  'padding:6px 10px 8px',
  `background:${colors.primaryLight}`,
  `border:1px solid color-mix(in srgb, ${colors.primary} 25%, transparent)`,
  'border-radius:8px',
  'cursor:grab',
  `box-shadow:0 1px 2px color-mix(in srgb, ${colors.primary} 8%, transparent)`,
].join(';');

const BLOCK_HEADER_STYLE = [
  'display:flex',
  'align-items:center',
  'gap:3px',
  'font-size:11px',
  `color:${colors.primary}`,
  'font-weight:600',
  'user-select:none',
  'margin-bottom:4px',
].join(';');

// The data-chip-* attributes shared by every shape — this is what a backend resolver
// (or the remove/toggle click handlers in useTinyMceSetup) uses to identify the field.
const chipAttrs = (field: DynamicField, shape: FieldShape): string =>
  `data-chip-id="${field.id}"` +
  ` data-chip-field="${encodeURIComponent(field.fieldName)}"` +
  ` data-chip-op="${field.operationId}"` +
  ` data-chip-op-name="${encodeURIComponent(field.operationName)}"` +
  ` data-chip-system="${field.systemId}"` +
  ` data-chip-system-name="${encodeURIComponent(field.systemName)}"` +
  ` data-chip-instance="${encodeURIComponent(field.instanceName)}"` +
  ` data-chip-shape="${shape}"`;

const chipHeaderHtml = (field: DynamicField, extraButtons: string): string =>
  `<div style="${BLOCK_HEADER_STYLE}">` +
  `${DB_ICON_SVG} ${field.fieldName}` +
  `<span style="${META_STYLE}"> · ${field.instanceName} · ${field.operationName}</span>` +
  extraButtons +
  '</div>';

const removeButtonHtml = (field: DynamicField): string =>
  `<button type="button" data-chip-remove="${field.id}" contenteditable="false" style="${REMOVE_BTN_STYLE}">×</button>`;

// Serializes a plain-value field into the chip markup dropped into ContentEditor fields.
// contenteditable="false" makes TinyMCE treat the chip as an atomic, non-editable island.
export const buildFieldChipHtml = (field: DynamicField): string =>
  `<span ${chipAttrs(field, 'text')}` +
  ' contenteditable="false" draggable="true"' +
  ` style="${CHIP_STYLE}">` +
  `${DB_ICON_SVG} ${field.fieldName}` +
  `<span style="${META_STYLE}"> · ${field.instanceName} · ${field.operationName}</span>` +
  removeButtonHtml(field) +
  '</span>';

// json-table's renderListHtml always emits a single outer <ul class="jt-ul">…</ul> (any
// nesting from object/array items lands strictly *inside* that wrapper), so swapping just
// the anchored outer tag is enough to honor the user's ordered/unordered choice.
const toOrderedList = (html: string, ordered: boolean): string =>
  ordered ? html.replace(/^<ul/, '<ol').replace(/<\/ul>$/, '</ol>') : html;

// Array-of-primitives fields become a real <ul>/<ol> (via json-table's renderListHtml) so
// the section renders an actual list; the ↕ button lets the user flip ordered/unordered
// after the drop (see useTinyMceSetup's data-chip-list-toggle handling). renderListHtml has
// no styling hooks of its own — a field with renderAsTable set skips this entirely and goes
// through buildFieldTableHtml instead, where json-table's real design options apply.
export const buildFieldListHtml = (field: DynamicField): string => {
  const toggleBtn =
    `<button type="button" data-chip-list-toggle="${field.id}" contenteditable="false"` +
    ` style="${TOGGLE_BTN_STYLE}" title="הפיכה לרשימה ${field.ordered ? 'לא ' : ''}ממוספרת">↕</button>`;
  const listHtml = toOrderedList(renderJsonList(field.value), Boolean(field.ordered));
  return (
    `<div ${chipAttrs(field, 'list')} data-chip-ordered="${Boolean(field.ordered)}"` +
    ` contenteditable="false" draggable="true" style="${BLOCK_STYLE}">` +
    chipHeaderHtml(field, toggleBtn + removeButtonHtml(field)) +
    listHtml +
    '</div>'
  );
};

// Array-of-objects fields (and list fields with renderAsTable) become a real <table>
// rendered by json-table: automatic colspan/rowspan for nested keys, aggregation,
// row titles, per-field labels, and header/cell styling — all driven by the user's
// TableDesignModal choices (see utils/tableDesignOptions.ts), not hardcoded here.
export const buildFieldTableHtml = (field: DynamicField): string => {
  const shape = field.shape === 'list' ? 'list' : 'table';
  const tableHtml = renderJsonTable(
    field.value,
    toRenderOptions(field.tableDesign, field.fieldName, field.shape === 'table'),
  );
  return (
    `<div ${chipAttrs(field, shape)} contenteditable="false" draggable="true" style="${BLOCK_STYLE}">` +
    chipHeaderHtml(field, removeButtonHtml(field)) +
    tableHtml +
    '</div>'
  );
};

// Single entry point for drag sources: picks the right markup for the field's shape.
export const buildFieldContentHtml = (field: DynamicField): string => {
  if (field.shape === 'table') return buildFieldTableHtml(field);
  if (field.shape === 'list')
    return field.renderAsTable ? buildFieldTableHtml(field) : buildFieldListHtml(field);
  return buildFieldChipHtml(field);
};
