import { colors } from '@/styles/theme';
import type { DynamicField } from '../DataImportModal.constants';

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

// Serializes an imported field into the chip markup dropped into ContentEditor fields.
// contenteditable="false" makes TinyMCE treat the chip as an atomic, non-editable island.
export const buildFieldChipHtml = (field: DynamicField): string =>
  `<span data-chip-id="${field.id}"` +
  ` data-chip-field="${encodeURIComponent(field.fieldName)}"` +
  ` data-chip-op="${field.operationId}"` +
  ` data-chip-op-name="${encodeURIComponent(field.operationName)}"` +
  ` data-chip-system="${field.systemId}"` +
  ` data-chip-system-name="${encodeURIComponent(field.systemName)}"` +
  ` data-chip-instance="${encodeURIComponent(field.instanceName)}"` +
  ' contenteditable="false" draggable="true"' +
  ` style="${CHIP_STYLE}">` +
  `${DB_ICON_SVG} ${field.fieldName}` +
  `<span style="${META_STYLE}"> · ${field.instanceName} · ${field.operationName}</span>` +
  `<button type="button" data-chip-remove="${field.id}" contenteditable="false" style="${REMOVE_BTN_STYLE}">×</button>` +
  '</span>';
