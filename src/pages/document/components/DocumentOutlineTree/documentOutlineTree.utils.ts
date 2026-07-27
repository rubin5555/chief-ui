import type { useDragReorder } from '@/hooks/useDragReorder';
import type { DropEdge } from './DocumentOutlineTree.types';

/**
 * Which edge of `id`'s row should show the drop rule.
 *
 * useDragReorder deals in ids, not positions, so the direction of travel has to be
 * recovered from the list: a node dragged from below lands above the row it's over
 * (rule on top), one dragged from above lands below it.
 */
export const getDropEdge = (
  ids: string[],
  drag: ReturnType<typeof useDragReorder>,
  id: string,
): DropEdge => {
  if (drag.dragOverId !== id || !drag.draggedId) return null;
  const from = ids.indexOf(drag.draggedId);
  const to = ids.indexOf(id);
  // A drag that started in a different parent has no position in this list; it is
  // not a valid drop here (reorder* are membership-scoped and would no-op), so
  // promise nothing.
  if (from === -1 || to === -1) return null;
  return from > to ? 'top' : 'bottom';
};
