/**
 * @module styles
 * Declarative styling for rendered tables.
 *
 * A {@link TableStyles} sheet targets four levels:
 * - `header`     — top-row `<thead>` cells
 * - `subheader`  — deeper `<thead>` rows (nested key groups)
 * - `key`        — side titles: kv-table key cells and list index cells
 * - `cell`       — every data cell
 * - `caption`    — the table title
 * plus per-field rules (`fields`) matched by dotted path or leaf key name,
 * each optionally carrying a `header` override and a `when` predicate for
 * conditional formatting of individual cells.
 *
 * Merge precedence (later wins, `className`/`css` concatenate):
 * `cell` → `fields[path]` → `fields[path].when(value, ctx)`.
 */

import type { JsonPrimitive } from './types';

/** Visual properties applicable to any table cell. */
export interface CellStyle {
  bold?: boolean;
  italic?: boolean;
  /** Text color — any CSS color value. */
  color?: string;
  /** Cell background — any CSS color value. */
  background?: string;
  align?: 'left' | 'center' | 'right';
  /** Extra class name(s) appended to the cell's class list. */
  className?: string;
  /** Raw CSS declarations appended verbatim (escaped), e.g. `'border-left:3px solid teal'`. */
  css?: string;
}

/** Context handed to {@link FieldStyle.when} predicates. */
export interface CellContext {
  /** Dotted field path, e.g. `'contact.email'`. */
  path: string;
  /** Zero-based record index (row of the source array, not the HTML row). */
  row: number;
}

/**
 * Conditional style for individual cells. Return a {@link CellStyle} to apply,
 * or `null`/`undefined`/`false` to leave the cell as-is.
 */
export type StyleWhen = (
  value: JsonPrimitive | undefined,
  ctx: CellContext,
) => CellStyle | null | undefined | false;

/** Per-field rule: base cell style + optional header override + conditional. */
export interface FieldStyle extends CellStyle {
  /** Styles the field's header cell (matrix `<thead>`) or key cell (kv table). */
  header?: CellStyle;
  /** Conditional formatting evaluated per individual cell. */
  when?: StyleWhen;
}

/** A full style sheet for one table. */
export interface TableStyles {
  /** Top-level `<thead>` cells. */
  header?: CellStyle;
  /** Nested `<thead>` rows (depth > 0). */
  subheader?: CellStyle;
  /** Side titles: kv key cells and list index cells. */
  key?: CellStyle;
  /** Every data cell. */
  cell?: CellStyle;
  /** The table `<caption>` (when {@link RenderOptions.caption} is set). */
  caption?: CellStyle;
  /**
   * Per-field rules keyed by dotted path (`'contact.email'`) or bare leaf
   * name (`'email'` matches any path ending in `.email`). Exact path wins.
   */
  fields?: Record<string, FieldStyle>;
}

/* ------------------------------------------------------------------ */
/* merging & emission                                                  */
/* ------------------------------------------------------------------ */

/**
 * Merge style layers left→right. Scalar properties are overridden by later
 * layers; `className` and `css` are concatenated so layers compose.
 */
export function mergeStyles(
  ...layers: Array<CellStyle | null | undefined | false>
): CellStyle | undefined {
  let out: CellStyle | undefined;
  for (const l of layers) {
    if (!l) continue;
    if (!out) {
      out = { ...l };
      continue;
    }
    const { className, css, ...rest } = l;
    Object.assign(out, rest);
    if (className) out.className = out.className ? `${out.className} ${className}` : className;
    if (css) out.css = out.css ? `${out.css};${css}` : css;
  }
  return out;
}

const ESC_RE = /[&<>"']/g;
const ESC_MAP: Readonly<Record<string, string>> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};
const esc = (s: string): string => (ESC_RE.test(s) ? s.replace(ESC_RE, (ch) => ESC_MAP[ch]) : s);

/**
 * Build the `class="…" style="…"` attribute string for a cell.
 * All user-provided fragments are HTML-escaped, so a malicious style sheet
 * or class name cannot break out of the attribute.
 *
 * @param baseClass - Semantic class from the cell kind (may be empty).
 * @param style - Resolved style, if any.
 */
export function styleAttrs(baseClass: string, style?: CellStyle): string {
  const classes = [baseClass, style?.className].filter(Boolean).join(' ');
  let out = classes ? ` class="${esc(classes)}"` : '';

  if (style) {
    const decls: string[] = [];
    if (style.bold) decls.push('font-weight:700');
    if (style.italic) decls.push('font-style:italic');
    if (style.color) decls.push(`color:${style.color}`);
    if (style.background) decls.push(`background:${style.background}`);
    if (style.align) decls.push(`text-align:${style.align}`);
    if (style.css) decls.push(style.css);
    if (decls.length) out += ` style="${esc(decls.join(';'))}"`;
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* resolver                                                            */
/* ------------------------------------------------------------------ */

/** Pre-indexed lookup over one {@link TableStyles} sheet. */
export interface StyleResolver {
  /** Resolve a data cell: `cell` + field rule + `when` conditional. */
  data(
    path: string | undefined,
    value: JsonPrimitive | undefined,
    row: number,
  ): CellStyle | undefined;
  /** Resolve a `<thead>` cell at `depth` (0 = header, >0 = subheader). */
  header(path: string, depth: number): CellStyle | undefined;
  /** Resolve a side-title cell (kv key / list index); kv keys also get their field's `header` rule. */
  key(path?: string): CellStyle | undefined;
  /** Resolve the table caption. */
  caption(): CellStyle | undefined;
}

const NOOP: StyleResolver = {
  data: () => undefined,
  header: () => undefined,
  key: () => undefined,
  caption: () => undefined,
};

/**
 * Compile a {@link TableStyles} sheet into a fast {@link StyleResolver}.
 * Field lookup is O(1): exact dotted paths win over bare leaf-name matches.
 */
export function createResolver(styles?: TableStyles): StyleResolver {
  if (!styles) return NOOP;
  const fields = new Map(Object.entries(styles.fields ?? {}));

  const fieldOf = (path: string | undefined): FieldStyle | undefined => {
    if (path === undefined) return undefined;
    const exact = fields.get(path);
    if (exact) return exact;
    const leaf = path.slice(path.lastIndexOf('.') + 1);
    return leaf === path ? undefined : fields.get(leaf);
  };

  return {
    data(path, value, row) {
      const f = fieldOf(path);
      const { header: _h, when, ...base } = f ?? {};
      const cond = when && path !== undefined ? when(value, { path, row }) : undefined;
      return mergeStyles(styles.cell, f && base, cond);
    },
    header(path, depth) {
      return mergeStyles(depth === 0 ? styles.header : styles.subheader, fieldOf(path)?.header);
    },
    key(path) {
      return mergeStyles(styles.key, fieldOf(path)?.header);
    },
    caption() {
      return styles.caption ? { ...styles.caption } : undefined;
    },
  };
}
