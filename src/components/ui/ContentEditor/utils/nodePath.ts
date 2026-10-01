import type { CursorPath } from '@/collab/types';

const isInsignificantTextNode = (node: Node): boolean =>
  node.nodeType === Node.TEXT_NODE && !(node as Text).data.trim();

const significantChildren = (node: Node): Node[] =>
  Array.prototype.filter.call(node.childNodes, (child: Node) => !isInsignificantTextNode(child));

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
