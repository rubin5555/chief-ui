/**
 * @module grid
 * Pure, DOM-free geometry engine. Turns arbitrary JSON into a rectangular
 * cell grid with correct rowspan/colspan, plus hierarchical aggregation.
 *
 * Invariant maintained throughout: every {@link Block} is a perfect
 * rectangle — the sum of (colspan × rowspan) coverage over its grid fills
 * `rows × width` exactly, with no overlaps and no holes.
 */

import type { Block, Cell, HeaderNode, JsonObject, JsonValue } from './types';

/* ------------------------------------------------------------------ */
/* type guards                                                         */
/* ------------------------------------------------------------------ */

/** Narrow to a plain JSON object (not `null`, not an array). */
export const isObj = (v: JsonValue | undefined): v is JsonObject =>
  v !== null && typeof v === 'object' && !Array.isArray(v);

/** Narrow to a JSON array. */
export const isArr = (v: JsonValue | undefined): v is JsonValue[] => Array.isArray(v);

/** True when the array contains at least one plain object (⇒ matrix shape). */
export const hasObj = (v: JsonValue[]): boolean => v.some(isObj);

/* ------------------------------------------------------------------ */
/* cell construction                                                   */
/* ------------------------------------------------------------------ */

/**
 * Build a typed data cell for a leaf value.
 *
 * @param v - The JSON value (`undefined` means "key missing on this record").
 * @param colspan - Width to occupy (> 1 when a scalar sits under a header group).
 */
export function valueCell(v: JsonValue | undefined, colspan = 1, path?: string): Cell {
  if (v === undefined || v === null)
    return { text: '∅', kind: 'null', rowspan: 1, colspan, path, raw: v ?? null };
  switch (typeof v) {
    case 'number':
      return { text: String(v), kind: 'num', rowspan: 1, colspan, path, raw: v };
    case 'boolean':
      return { text: String(v), kind: v ? 'true' : 'false', rowspan: 1, colspan, path, raw: v };
    case 'string':
      return { text: v, kind: 'text', rowspan: 1, colspan, path, raw: v };
    default: // object | array under a leaf header → nested mini-table fallback
      return { nested: v, kind: 'nested', rowspan: 1, colspan, path };
  }
}

const emptyMarker = (text: string, colspan: number): Cell => ({
  text,
  kind: 'null',
  rowspan: 1,
  colspan,
});

/* ------------------------------------------------------------------ */
/* 1 · header tree                                                     */
/* ------------------------------------------------------------------ */

/**
 * Build the recursive header tree for an array of records.
 *
 * The tree is the **union** of keys across all records, preserving first-seen
 * order. A key becomes a group node (rendered with `colspan`) when any of its
 * values is a plain object or an array containing objects; those objects are
 * pooled and recursed to build the child headers.
 *
 * Complexity: O(total keys) — each value is visited exactly once, and leaf
 * counts are memoised on the nodes.
 *
 * @param records - Rows of the future table (non-objects contribute no keys).
 * @returns Ordered header forest with memoised `leaves`.
 */
export function headerTree(records: readonly JsonValue[]): HeaderNode[] {
  const order: string[] = [];
  const bucket = new Map<string, JsonValue[]>();

  for (const r of records) {
    if (!isObj(r)) continue;
    for (const k of Object.keys(r)) {
      let vals = bucket.get(k);
      if (!vals) {
        vals = [];
        bucket.set(k, vals);
        order.push(k);
      }
      vals.push(r[k] as JsonValue);
    }
  }

  return order.map((key) => {
    const sub: JsonObject[] = [];
    let onlyIndexObjects = true;
    // biome-ignore lint/style/noNonNullAssertion: key was just pushed from this same bucket
    for (const v of bucket.get(key)!) {
      if (isObj(v)) {
        sub.push(v);
        if (!Object.keys(v).every((k) => NUMERIC_KEY.test(k))) onlyIndexObjects = false;
      } else if (isArr(v)) {
        for (const it of v) if (isObj(it)) sub.push(it);
        onlyIndexObjects = false; // pooled array items are records, not tuple slots
      }
    }
    if (sub.length === 0) return { key, leaves: 1 };
    const children = headerTree(sub);
    if (children.length === 0) return { key, leaves: 1 }; // e.g. only empty objects
    const node: HeaderNode = { key, children, leaves: children.reduce((s, c) => s + c.leaves, 0) };
    if (onlyIndexObjects) node.indexed = true;
    return node;
  });
}

/** Keys that look like array indices: "0", "1", "2", … (no leading zeros). */
const NUMERIC_KEY = /^(0|[1-9]\d*)$/;

/**
 * True for an indexed group whose children are all leaves — the whole
 * numeric level can collapse: the parent header spans down and across,
 * and no subheader row is emitted for the indices.
 */
export const isCollapsedIndexed = (n: HeaderNode): boolean =>
  n.indexed === true && n.children !== undefined && n.children.every((c) => !c.children);

/**
 * Depth (in header rows) of a header forest.
 * @param collapseIndexed - When true, an indexed group whose children are
 * all leaves counts as a single header row (its numeric level is hidden).
 */
export const treeDepth = (nodes: readonly HeaderNode[], collapseIndexed = false): number => {
  const open = (n: HeaderNode): n is HeaderNode & { children: HeaderNode[] } =>
    n.children !== undefined && !(collapseIndexed && isCollapsedIndexed(n));
  return nodes.some(open)
    ? 1 +
        treeDepth(
          nodes.filter(open).flatMap((n) => n.children),
          collapseIndexed,
        )
    : 1;
};

/* ------------------------------------------------------------------ */
/* 2 · block algebra                                                   */
/* ------------------------------------------------------------------ */

/** Wrap cells as a one-row block. */
const oneRow = (...cells: Cell[]): Block => ({ rows: 1, grid: [cells] });

/**
 * Grow a block to `rows` rows **in place** by extending the rowspan of every
 * cell whose span ends on the block's current last row. This is the single
 * rule that keeps composed grids rectangular.
 */
export function stretch(block: Block, rows: number): Block {
  if (block.rows >= rows) return block;
  const extra = rows - block.rows;
  block.grid.forEach((row, i) => {
    for (const c of row) if (i + c.rowspan === block.rows) c.rowspan += extra;
  });
  while (block.grid.length < rows) block.grid.push([]);
  block.rows = rows;
  return block;
}

/** Place blocks side by side, stretching shorter ones to the tallest. */
export function combineH(blocks: readonly Block[]): Block {
  let rows = 1;
  for (const b of blocks) if (b.rows > rows) rows = b.rows;
  const grid: Cell[][] = Array.from({ length: rows }, () => []);
  for (const b of blocks) {
    stretch(b, rows);
    b.grid.forEach((row, i) => {
      grid[i].push(...row);
    });
  }
  return { rows, grid };
}

/** Stack blocks vertically (arrays of objects → one sub-record per block). */
export const stackV = (blocks: readonly Block[]): Block => ({
  rows: blocks.reduce((s, b) => s + b.rows, 0),
  grid: blocks.flatMap((b) => b.grid),
});

/**
 * Convert one value under one header node into a {@link Block}.
 *
 * Shape rules:
 * - leaf + primitive          → 1×1 cell
 * - leaf + primitive array    → N sub-rows (siblings gain rowspan)
 * - group + object            → children combined horizontally
 * - group + array of objects  → child records stacked vertically
 * - group + primitive         → one cell spanning the group's width
 * - missing / null / empty    → typed placeholder spanning the width
 *
 * @param value - The record's value for this column (undefined if absent).
 * @param node  - The header node describing the column.
 */
export function block(value: JsonValue | undefined, node: HeaderNode, parentPath = ''): Block {
  const width = node.leaves;
  const path = parentPath ? `${parentPath}.${node.key}` : node.key;

  if (!node.children) {
    if (isArr(value)) {
      if (value.length === 0) return oneRow({ ...emptyMarker('[ ]', width), path });
      return { rows: value.length, grid: value.map((v) => [valueCell(v, width, path)]) };
    }
    return oneRow(valueCell(value, width, path));
  }

  if (value === undefined || value === null) return oneRow({ ...emptyMarker('∅', width), path });

  if (isObj(value)) return combineH(node.children.map((c) => block(value[c.key], c, path)));

  if (isArr(value)) {
    if (value.length === 0) return oneRow({ ...emptyMarker('[ ]', width), path });
    return stackV(
      value.map((item) =>
        isObj(item)
          ? // biome-ignore lint/style/noNonNullAssertion: node.children checked above
            combineH(node.children!.map((c) => block(item[c.key], c, path)))
          : oneRow(valueCell(item, width, path)),
      ),
    );
  }

  return oneRow(valueCell(value, width, path)); // scalar under a group
}

/* ------------------------------------------------------------------ */
/* 3 · record assembly + aggregation                                   */
/* ------------------------------------------------------------------ */

/** One fully-assembled record, ready for aggregation and rendering. */
export interface RecordGrid {
  raw: JsonValue;
  rows: number;
  grid: Cell[][];
  /** Cell references for aggregatable (single-cell, single-row) columns. */
  aggCells: Map<string, Cell>;
}

/**
 * Build the grid for every record and capture aggregation cell references.
 *
 * @param records - Table rows.
 * @param tree - Header forest from {@link headerTree}.
 * @param aggKeys - Keys requested for aggregation (non-leaf keys are ignored).
 */
export function buildRecords(
  records: readonly JsonValue[],
  tree: readonly HeaderNode[],
  aggKeys: readonly string[],
): RecordGrid[] {
  const aggSet = new Set(aggKeys.filter((k) => tree.some((n) => n.key === k && !n.children)));
  return records.map((raw) => {
    const blocks = tree.map((n) => block(isObj(raw) ? raw[n.key] : undefined, n));
    const aggCells = new Map<string, Cell>();
    tree.forEach((n, i) => {
      const b = blocks[i];
      if (aggSet.has(n.key) && b.rows === 1 && b.grid[0].length === 1)
        aggCells.set(n.key, b.grid[0][0]);
    });
    const { rows, grid } = combineH(blocks);
    return { raw, rows, grid, aggCells };
  });
}

/**
 * Hierarchical rowspan merge over consecutive records.
 *
 * For each aggregate key (in order), consecutive records whose values match
 * — **and** whose values for every earlier key also match — share one cell:
 * the first cell's rowspan absorbs the run, later cells are flagged `skip`.
 *
 * @example region ▸ dept: `dept` never merges across a `region` boundary.
 */
export function aggregate(recs: readonly RecordGrid[], keys: readonly string[]): void {
  for (let ki = 0; ki < keys.length; ki++) {
    const prefix = keys.slice(0, ki + 1);
    // Serializing the whole prefix as one JSON array (rather than joining per-key
    // strings with a separator) sidesteps any risk of a separator character
    // colliding with a value's own text.
    const sig = (r: RecordGrid): string =>
      JSON.stringify(prefix.map((k) => (isObj(r.raw) ? r.raw[k] : undefined)));

    let run: { sig: string; cell: Cell } | null = null;
    for (const r of recs) {
      const cell = r.aggCells.get(keys[ki]);
      if (run && cell && run.sig === sig(r)) {
        run.cell.rowspan += r.rows;
        cell.skip = true;
      } else {
        run = cell ? { sig: sig(r), cell } : null;
      }
    }
  }
}
