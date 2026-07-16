/**
 * @module types
 * Shared type definitions for json-table.
 */

import type { TableStyles } from './styles';

/** Any JSON primitive. */
export type JsonPrimitive = string | number | boolean | null;

/** Any valid JSON value (recursive union — no `any` anywhere in the package). */
export type JsonValue = JsonPrimitive | JsonValue[] | JsonObject;

/** A JSON object node. */
export interface JsonObject {
  [key: string]: JsonValue;
}

/** Semantic kind of a cell, mapped to a CSS class at render time. */
export type CellKind = 'text' | 'num' | 'true' | 'false' | 'null' | 'nested';

/**
 * A single cell in the pure grid model. Geometry (rowspan/colspan) is
 * computed entirely on this model before any HTML is produced, which is
 * what lets us unit-test rectangularity without a DOM.
 */
export interface Cell {
  /** Rendered text (mutually exclusive with {@link Cell.nested}). */
  text?: string;
  /** A JSON value to render as a nested mini-table (fallback for mixed shapes). */
  nested?: JsonValue;
  kind: CellKind;
  rowspan: number;
  colspan: number;
  /** Set by aggregation when this cell was merged into an earlier one. */
  skip?: boolean;
  /** Dotted field path (`'contact.email'`) — targeting handle for styling. */
  path?: string;
  /** Raw primitive value, handed to conditional style predicates. */
  raw?: JsonPrimitive;
}

/** A rectangular group of cells: `rows` high, grid[i] holds the cells that START on row i. */
export interface Block {
  rows: number;
  grid: Cell[][];
}

/** A node in the recursive header tree built from the union of record keys. */
export interface HeaderNode {
  key: string;
  children?: HeaderNode[];
  /** Memoised leaf count (== colspan of this header). */
  leaves: number;
  /**
   * True when every object value under this key is index-keyed
   * (`{"0": …, "1": …}`) — a destructured tuple. With
   * {@link RenderOptions.splitIndexed} (the default), the column splits
   * into sub-columns without a numeric subheader row.
   */
  indexed?: boolean;
}

/** Rendering options. */
export interface RenderOptions {
  /**
   * Top-level leaf columns to merge with rowspan when consecutive records
   * share a value. Merging is hierarchical: keys later in the array only
   * merge within runs of the earlier keys (e.g. `['region', 'dept']`).
   */
  aggregate?: readonly string[];
  /** Append a Σ footer summing every top-level all-numeric column. */
  totals?: boolean;
  /** Extra class added to the root `<table>` (default none). */
  tableClass?: string;
  /**
   * Declarative style sheet: targets headers, subheaders, side titles
   * (`key`), all data cells, per-field rules, and conditional per-cell
   * rules. See {@link TableStyles}.
   */
  styles?: TableStyles;
  /** Table title, rendered as a `<caption class="jt-caption">`. */
  caption?: string;
  /**
   * Custom display labels for headers and side titles, keyed by dotted
   * path or bare leaf name (exact path wins). Also renames the built-in
   * `'field'` / `'value'` / `'#'` headers of kv and list tables.
   */
  labels?: Record<string, string>;
  /**
   * Side titles for matrix tables. A **string** promotes that top-level
   * field to a leading row-title column rendered as `<th>` cells (styled
   * via the `key` target, compatible with aggregation). A **string array**
   * prepends a synthetic title column, one entry per record, each spanning
   * the record's full height.
   */
  rowTitles?: string | readonly string[];
  /**
   * Split columns whose values are index-keyed objects (`{"0": …, "1": …}`)
   * into sub-columns **without** rendering the numeric indices as
   * subheaders: the parent header spans across, values sit side by side
   * beneath it. Default `true`; set `false` to show the index subheaders.
   */
  splitIndexed?: boolean;
}
