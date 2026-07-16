// Vendored from json-table (zero-dependency, DOM-free JSON→HTML table renderer).
// Only the pieces chief-ui actually calls are re-exported — the placeholder/injection
// layer (`<json-table>`/`<jt-slot>` HTML scanning) isn't needed since fields are
// rendered straight into TinyMCE content, not templated whole documents.
export { escapeHtml, render } from './render';
export { renderListHtml, renderTextHtml } from './slots';
export type {
  CellContext,
  CellStyle,
  FieldStyle,
  StyleResolver,
  StyleWhen,
  TableStyles,
} from './styles';
export { createResolver, mergeStyles, styleAttrs } from './styles';
export type { JsonObject, JsonPrimitive, JsonValue, RenderOptions } from './types';
