/**
 * @module slots
 * Registry-driven placeholder slots for one or many HTML documents.
 *
 * Markup declares typed slots by id:
 * ```html
 * <jt-slot id="revenue"></jt-slot>          <!-- filled from the registry -->
 * <jt-slot id="regions" type="list"/>       <!-- attr type overrides the spec -->
 * <jt-slot id="note">fallback shown only if never injected</jt-slot>
 * ```
 *
 * Code owns a single record of tags — the registry — mapping each id to its
 * data and how it should render:
 * ```ts
 * const tags: TagRegistry = {
 *   revenue: { type: 'table', data: sales, options: { aggregate: ['region'] } },
 *   regions: { type: 'list',  data: ['us-east-1', 'eu-west-1'] },
 *   note:    { type: 'text',  data: 'Generated nightly.' },
 * };
 * const page = injectTags(template, tags);
 * ```
 */

import { isArr, isObj } from './grid';
import { escapeHtml, render } from './render';
import type { JsonValue, RenderOptions } from './types';

/** How a slot renders its data. */
export type SlotType = 'table' | 'list' | 'text';

/** One entry in the tag registry. */
export interface TagSpec {
  /** Payload for this slot. */
  data: JsonValue;
  /** Placeholder type: `'table'` (default), `'list'`, or `'text'`. */
  type?: SlotType;
  /** Render options — applied when the slot renders as a table. */
  options?: RenderOptions;
}

/** The record of tags: slot id → spec. */
export type TagRegistry = Readonly<Record<string, TagSpec>>;

/** Fill report for a batch of documents. */
export interface InjectReport {
  /** Per document: slot ids filled, and ids with no registry entry. */
  perDoc: Record<string, { filled: string[]; unknown: string[] }>;
  /** Registry ids that no document referenced. */
  unusedTags: string[];
}

/* ------------------------------------------------------------------ */
/* type renderers                                                      */
/* ------------------------------------------------------------------ */

const PRIM_CLASS: Record<string, string> = {
  number: 'jt-num',
  boolean: '',
  string: '',
};

const primSpan = (v: JsonValue | null): string => {
  if (v === null || v === undefined) return '<span class="jt-null">∅</span>';
  if (typeof v === 'boolean') return `<span class="${v ? 'jt-true' : 'jt-false'}">${v}</span>`;
  const cls = PRIM_CLASS[typeof v];
  const text = escapeHtml(String(v));
  return cls ? `<span class="${cls}">${text}</span>` : text;
};

/**
 * Render any JSON value as a semantic HTML list (`<ul class="jt-ul">`).
 * Arrays become items, objects become `key: value` items, nesting recurses,
 * and a bare primitive becomes a one-item list.
 */
export function renderListHtml(data: JsonValue): string {
  if (isArr(data)) {
    if (data.length === 0) return '<ul class="jt-ul jt-empty"><li>∅ empty</li></ul>';
    return `<ul class="jt-ul">${data.map((v) => `<li>${listItem(v)}</li>`).join('')}</ul>`;
  }
  if (isObj(data)) {
    const entries = Object.entries(data);
    if (entries.length === 0) return '<ul class="jt-ul jt-empty"><li>∅ empty</li></ul>';
    return `<ul class="jt-ul">${entries
      .map(([k, v]) => `<li><span class="jt-li-key">${escapeHtml(k)}</span>: ${listItem(v)}</li>`)
      .join('')}</ul>`;
  }
  return `<ul class="jt-ul"><li>${primSpan(data)}</li></ul>`;
}

const listItem = (v: JsonValue): string => (isArr(v) || isObj(v) ? renderListHtml(v) : primSpan(v));

/**
 * Render any JSON value as escaped plain text (no wrapper element).
 * Strings pass through verbatim (escaped); everything else is
 * `JSON.stringify`'d so structures stay readable inline.
 */
export function renderTextHtml(data: JsonValue): string {
  return escapeHtml(typeof data === 'string' ? data : JSON.stringify(data));
}

/**
 * Render one registry entry according to its type.
 * @throws {RangeError} on an unknown slot type.
 */
export function renderTag(spec: TagSpec): string {
  const type = spec.type ?? 'table';
  switch (type) {
    case 'table':
      return render(spec.data, spec.options ?? {});
    case 'list':
      return renderListHtml(spec.data);
    case 'text':
      return renderTextHtml(spec.data);
    default:
      throw new RangeError(`unknown slot type "${String(type)}" (use table | list | text)`);
  }
}
