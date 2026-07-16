/**
 * @module render
 * HTML string renderer over the pure grid model. Server-side friendly:
 * no DOM, output built as a flat string buffer joined once (O(n)).
 * Every payload- or style-derived string passes through {@link escapeHtml}
 * / the style attribute escaper, so untrusted input cannot inject markup.
 */

import {
  aggregate,
  buildRecords,
  hasObj,
  headerTree,
  isArr,
  isCollapsedIndexed,
  isObj,
  treeDepth,
  valueCell,
} from './grid';
import type { StyleResolver } from './styles';
import { createResolver, mergeStyles, styleAttrs } from './styles';
import type { Cell, HeaderNode, JsonObject, JsonValue, RenderOptions } from './types';

/* ------------------------------------------------------------------ */
/* escaping                                                            */
/* ------------------------------------------------------------------ */

const ESC_RE = /[&<>"']/g;
const ESC_MAP: Readonly<Record<string, string>> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/**
 * Escape a string for safe interpolation into HTML text or attributes.
 * @param s - Raw string (possibly attacker-controlled payload data).
 */
export const escapeHtml = (s: string): string =>
  ESC_RE.test(s) ? s.replace(ESC_RE, (ch) => ESC_MAP[ch]) : s;

/* ------------------------------------------------------------------ */
/* low-level emit helpers                                              */
/* ------------------------------------------------------------------ */

type Buf = string[];

/** Semantic class per cell kind (merged with any resolved style classes). */
const KIND_CLASS: Readonly<Record<Cell['kind'], string>> = {
  text: '',
  num: 'jt-num',
  true: 'jt-true',
  false: 'jt-false',
  null: 'jt-null',
  nested: 'jt-nested',
};

const span = (c: { rowspan?: number; colspan?: number }): string =>
  (c.rowspan && c.rowspan > 1 ? ` rowspan="${c.rowspan}"` : '') +
  (c.colspan && c.colspan > 1 ? ` colspan="${c.colspan}"` : '');

/**
 * Emit one data cell, applying the resolved style for its field path and
 * record row (recursing into `render` for nested fallbacks).
 */
function emitCell(
  buf: Buf,
  c: Cell,
  res: StyleResolver,
  row: number,
  tag: 'td' | 'span' = 'td',
): void {
  const style = res.data(c.path, c.raw, row);
  buf.push('<', tag, styleAttrs(KIND_CLASS[c.kind], style), span(c), '>');
  if (c.nested !== undefined) buf.push(render(c.nested));
  else buf.push(escapeHtml(c.text ?? ''));
  buf.push('</', tag, '>');
}

const tableOpen = (extra: string, opts: RenderOptions): string =>
  `<table class="jt${extra}${opts.tableClass ? ` ${escapeHtml(opts.tableClass)}` : ''}">`;

/** Display label for a path: exact dotted match, then bare leaf name, then the key itself. */
function labelFor(path: string, labels?: Record<string, string>): string {
  if (!labels) return path.slice(path.lastIndexOf('.') + 1);
  const exact = labels[path];
  if (exact !== undefined) return exact;
  const leaf = path.slice(path.lastIndexOf('.') + 1);
  return labels[leaf] ?? leaf;
}

/** Emit the `<caption>` when {@link RenderOptions.caption} is set. */
function emitCaption(buf: Buf, opts: RenderOptions, res: StyleResolver): void {
  if (opts.caption === undefined) return;
  buf.push(
    `<caption${styleAttrs('jt-caption', res.caption())}>`,
    escapeHtml(opts.caption),
    '</caption>',
  );
}

/* ------------------------------------------------------------------ */
/* matrix table: array of objects                                      */
/* ------------------------------------------------------------------ */

function emitThead(
  buf: Buf,
  tree: readonly HeaderNode[],
  depth: number,
  res: StyleResolver,
  labels?: Record<string, string>,
  leadTitle?: string, // header cell of a synthetic side-title column
  splitIndexed = true,
): void {
  const rows: string[][] = Array.from({ length: depth }, () => []);
  if (leadTitle !== undefined)
    rows[0].push(
      `<th${depth > 1 ? ` rowspan="${depth}"` : ''}${styleAttrs('', res.header('title', 0))}>${escapeHtml(leadTitle)}</th>`,
    );
  const walk = (nodes: readonly HeaderNode[], d: number, parent: string, silent: boolean): void => {
    for (const n of nodes) {
      const path = parent ? `${parent}.${n.key}` : n.key;
      const attrs = styleAttrs('', res.header(path, d));
      // silent level (children of a split indexed group): no label unless an
      // exact-path entry in `labels` explicitly names this slot.
      const label = escapeHtml(silent ? (labels?.[path] ?? '') : labelFor(path, labels));
      if (n.children && !(splitIndexed && isCollapsedIndexed(n))) {
        rows[d].push(`<th colspan="${n.leaves}"${attrs}>${label}</th>`);
        walk(n.children, d + 1, path, splitIndexed && n.indexed === true);
      } else {
        // leaf — or a collapsed indexed group behaving like a wide leaf:
        // spans down all remaining header rows AND across its sub-columns.
        const rs = depth - d;
        const cs = n.leaves > 1 ? ` colspan="${n.leaves}"` : '';
        rows[d].push(`<th${rs > 1 ? ` rowspan="${rs}"` : ''}${cs}${attrs}>${label}</th>`);
      }
    }
  };
  walk(tree, 0, '', false);
  buf.push('<thead>');
  for (const r of rows) buf.push('<tr>', ...r, '</tr>');
  buf.push('</thead>');
}

function matrixTable(records: readonly JsonValue[], opts: RenderOptions): string {
  const tree = headerTree(records);
  const res = createResolver(opts.styles);

  // rowTitles: string → promote that top-level leaf field to a leading
  // side-title column; string[] → synthetic title column, one per record.
  const sideField =
    typeof opts.rowTitles === 'string' && tree.some((n) => n.key === opts.rowTitles && !n.children)
      ? opts.rowTitles
      : undefined;
  const titleList = isArr(opts.rowTitles as JsonValue)
    ? (opts.rowTitles as readonly string[])
    : undefined;
  if (sideField)
    tree.unshift(
      tree.splice(
        tree.findIndex((n) => n.key === sideField),
        1,
      )[0],
    );

  const split = opts.splitIndexed !== false;
  const buf: Buf = [tableOpen('', opts)];
  emitCaption(buf, opts, res);
  const leadHeader = titleList ? (opts.labels?.title ?? '') : undefined;
  emitThead(buf, tree, treeDepth(tree, split), res, opts.labels, leadHeader, split);

  const aggKeys = opts.aggregate ?? [];
  const recs = buildRecords(records, tree, aggKeys);
  if (aggKeys.length) aggregate(recs, aggKeys);

  buf.push('<tbody>');
  recs.forEach((r, recIdx) => {
    r.grid.forEach((row, i) => {
      buf.push(i === 0 ? '<tr class="jt-rec">' : '<tr>');
      if (titleList && i === 0)
        buf.push(
          `<th${styleAttrs('jt-key', res.key())}${r.rows > 1 ? ` rowspan="${r.rows}"` : ''}>`,
          escapeHtml(titleList[recIdx] ?? ''),
          '</th>',
        );
      for (const c of row)
        if (!c.skip) {
          if (sideField && c.path === sideField) {
            const style = res.data(c.path, c.raw, recIdx);
            buf.push(
              '<th',
              styleAttrs('jt-key', mergeStyles(res.key(c.path), style)),
              span(c),
              '>',
              escapeHtml(c.text ?? ''),
              '</th>',
            );
          } else emitCell(buf, c, res, recIdx);
        }
      buf.push('</tr>');
    });
  });
  buf.push('</tbody>');

  if (opts.totals) emitTotals(buf, records, tree, Boolean(titleList));

  buf.push('</table>');
  return buf.join('');
}

/** Σ footer over top-level columns whose value is numeric on every record. */
function emitTotals(
  buf: Buf,
  records: readonly JsonValue[],
  tree: readonly HeaderNode[],
  lead = false,
): void {
  buf.push('<tfoot><tr>');
  let labelled = false;
  if (lead) {
    buf.push('<td>Σ</td>');
    labelled = true;
  }
  for (const n of tree) {
    const numeric = !n.children && records.every((r) => isObj(r) && typeof r[n.key] === 'number');
    if (numeric) {
      const sum = records.reduce((s: number, r) => s + ((r as JsonObject)[n.key] as number), 0);
      buf.push(`<td class="jt-num">${sum}</td>`);
    } else {
      buf.push(
        '<td',
        n.leaves > 1 ? ` colspan="${n.leaves}"` : '',
        '>',
        labelled ? '' : 'Σ',
        '</td>',
      );
      labelled = true;
    }
  }
  buf.push('</tr></tfoot>');
}

/* ------------------------------------------------------------------ */
/* key/value table: plain object                                       */
/* ------------------------------------------------------------------ */

const keyDepth = (v: JsonValue): number =>
  isObj(v) && Object.keys(v).length ? 1 + Math.max(...Object.values(v).map(keyDepth)) : 0;

const rowsOf = (v: JsonValue): number =>
  isObj(v) && Object.keys(v).length
    ? Object.values(v).reduce((s: number, x) => s + rowsOf(x), 0)
    : 1;

function kvTable(obj: JsonObject, opts: RenderOptions): string {
  const depth = Math.max(1, keyDepth(obj));
  const res = createResolver(opts.styles);
  const buf: Buf = [tableOpen(' jt-kv', opts)];
  emitCaption(buf, opts, res);
  buf.push(
    `<thead><tr><th colspan="${depth}"${styleAttrs('', res.header('field', 0))}>${escapeHtml(labelFor('field', opts.labels))}</th>` +
      `<th${styleAttrs('', res.header('value', 0))}>${escapeHtml(labelFor('value', opts.labels))}</th></tr></thead><tbody>`,
  );

  // Rows are assembled as arrays of pre-rendered cell strings so that a
  // parent key <th rowspan=…> can be prepended to its first child row.
  // `leafRow` counts leaf rows top-to-bottom and doubles as the style ctx row.
  let leafRow = 0;
  const walk = (o: JsonObject, d: number, parent: string): string[][] => {
    const rows: string[][] = [];
    for (const [k, v] of Object.entries(o)) {
      const path = parent ? `${parent}.${k}` : k;
      if (isObj(v) && Object.keys(v).length) {
        const th = `<th${styleAttrs('jt-key', res.key(path))} rowspan="${rowsOf(v)}">${escapeHtml(labelFor(path, opts.labels))}</th>`;
        const sub = walk(v, d + 1, path);
        sub[0].unshift(th);
        rows.push(...sub);
      } else {
        const cs = depth - d;
        const th = `<th${styleAttrs('jt-key', res.key(path))}${cs > 1 ? ` colspan="${cs}"` : ''}>${escapeHtml(labelFor(path, opts.labels))}</th>`;
        const cellBuf: Buf = [];
        emitCell(
          cellBuf,
          isObj(v) ? valueCell('{ }', 1, path) : valueCell(v, 1, path),
          res,
          leafRow++,
        );
        rows.push([th, cellBuf.join('')]);
      }
    }
    return rows;
  };

  for (const row of walk(obj, 0, '')) buf.push('<tr>', ...row, '</tr>');
  buf.push('</tbody></table>');
  return buf.join('');
}

/* ------------------------------------------------------------------ */
/* list table: array of primitives                                     */
/* ------------------------------------------------------------------ */

function listTable(arr: readonly JsonValue[], opts: RenderOptions): string {
  const res = createResolver(opts.styles);
  const buf: Buf = [tableOpen(' jt-list', opts)];
  emitCaption(buf, opts, res);
  buf.push(
    `<thead><tr><th${styleAttrs('', res.header('#', 0))}>${escapeHtml(labelFor('#', opts.labels))}</th>` +
      `<th${styleAttrs('', res.header('value', 0))}>${escapeHtml(labelFor('value', opts.labels))}</th></tr></thead><tbody>`,
  );
  arr.forEach((v, i) => {
    buf.push(`<tr><th${styleAttrs('jt-idx', res.key())}>${i}</th>`);
    emitCell(buf, valueCell(v), res, i);
    buf.push('</tr>');
  });
  buf.push('</tbody></table>');
  return buf.join('');
}

/* ------------------------------------------------------------------ */
/* dispatcher                                                          */
/* ------------------------------------------------------------------ */

/**
 * Render **any** JSON value to an HTML string.
 *
 * Dispatch: array containing objects → matrix table (colspan headers,
 * rowspan sub-rows, optional aggregation/totals); array of primitives →
 * indexed list; object → key/value table with rowspan'd key groups;
 * primitive → single typed cell. Rules apply recursively for mixed shapes.
 *
 * Styling: pass {@link RenderOptions.styles} to target headers, subheaders,
 * side titles (`key`), all data cells, specific fields by dotted path, or
 * individual cells via conditional `when` predicates.
 *
 * @param data - Any valid JSON value.
 * @param opts - See {@link RenderOptions}.
 * @returns Self-contained HTML (style the defaults via the `.jt` class family).
 */
export function render(data: JsonValue, opts: RenderOptions = {}): string {
  if (isArr(data)) {
    if (data.length === 0) return '<div class="jt-empty">[ ] empty array</div>';
    return hasObj(data) ? matrixTable(data, opts) : listTable(data, opts);
  }
  if (isObj(data)) {
    if (Object.keys(data).length === 0) return '<div class="jt-empty">{ } empty object</div>';
    return kvTable(data, opts);
  }
  const buf: Buf = ['<div class="jt-scalar">'];
  emitCell(buf, valueCell(data), createResolver(opts.styles), 0, 'span');
  buf.push('</div>');
  return buf.join('');
}
