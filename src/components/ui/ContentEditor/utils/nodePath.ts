import type { CursorPath } from '@/collab/types';

// Two call sites for this structural-position translation: local
// click-to-activate (preserving the browser's real Selection when swapping
// a static preview for a live TinyMCE instance) and, since the collab layer,
// resolving a remote user's cursor position into a live Range on whichever
// DOM currently represents that field (extracted here for that reason).

// Whitespace-only text nodes (e.g. the newline TinyMCE's serializer pretty-prints
// between block elements on save) aren't guaranteed to exist in both trees a path is
// resolved against, so they're excluded from sibling indices on both ends.
const isInsignificantTextNode = (node: Node): boolean =>
  node.nodeType === Node.TEXT_NODE && !(node as Text).data.trim();

const significantChildren = (node: Node): Node[] =>
  Array.prototype.filter.call(node.childNodes, (child: Node) => !isInsignificantTextNode(child));

// Path of child indices from `root` down to `node`, so the same position can be
// re-located inside a *different* DOM tree that mirrors root's structure (e.g. the
// TinyMCE body mounted from the same HTML string as this preview).
export const getNodePath = (root: Node, node: Node): number[] | null => {
  const path: number[] = [];
  let current: Node | null = node;
  while (current && current !== root) {
    const parent: Node | null = current.parentNode;
    if (!parent) return null;
    path.unshift(significantChildren(parent).indexOf(current));
    current = parent;
  }
  return current === root ? path : null;
};

export const resolveNodePath = (root: Node, path: number[]): Node | null => {
  let current: Node = root;
  for (const index of path) {
    const child = significantChildren(current)[index];
    if (!child) return null;
    current = child;
  }
  return current;
};

export const clampOffset = (node: Node, offset: number): number => {
  const max =
    node.nodeType === Node.TEXT_NODE ? (node as Text).data.length : node.childNodes.length;
  return Math.min(offset, max);
};

// Serializes the browser's real Selection (if fully contained in `root`)
// into a CursorPath, the shape both the chip-drop caret-preservation flow
// and remote cursor broadcasting use.
export const serializeSelection = (
  root: Node | null,
  selection: Selection | null,
): CursorPath | null => {
  if (!root || !selection || selection.rangeCount === 0) return null;
  const range = selection.getRangeAt(0);
  if (!root.contains(range.startContainer) || !root.contains(range.endContainer)) return null;
  const startPath = getNodePath(root, range.startContainer);
  const endPath = getNodePath(root, range.endContainer);
  if (!startPath || !endPath) return null;
  return {
    startPath,
    startOffset: range.startOffset,
    endPath,
    endOffset: range.endOffset,
  };
};

// Resolves a CursorPath back into a live Range within `root`, or null if the
// structure doesn't line up (e.g. the two trees have diverged).
export const resolveCursorPath = (root: Node, path: CursorPath): Range | null => {
  const startNode = resolveNodePath(root, path.startPath);
  const endNode = resolveNodePath(root, path.endPath);
  if (!startNode || !endNode) return null;
  try {
    const range = document.createRange();
    range.setStart(startNode, clampOffset(startNode, path.startOffset));
    range.setEnd(endNode, clampOffset(endNode, path.endOffset));
    return range;
  } catch {
    return null;
  }
};
