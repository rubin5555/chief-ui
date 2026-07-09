import type { DragEvent } from 'react';
import { useState } from 'react';

// Native HTML5 drag-and-drop reordering for a flat list of ids. `onReorder` receives
// the dragged id and the id it was dropped on — callers resolve which array (and
// which parent, for nested lists) those ids belong to, so a single hook instance can
// back reordering scoped to any sub-list without needing that scope as an argument here.
export const useDragReorder = (onReorder: (draggedId: string, targetId: string) => void) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  const getDragHandleProps = (id: string) => ({
    draggable: true,
    onDragStart: (e: DragEvent<HTMLElement>) => {
      e.dataTransfer.effectAllowed = 'move';
      setDraggedId(id);
    },
    onDragEnd: handleDragEnd,
  });

  const getDropTargetProps = (id: string) => ({
    onDragOver: (e: DragEvent<HTMLElement>) => {
      if (!draggedId || draggedId === id) return;
      e.preventDefault();
      setDragOverId(id);
    },
    onDragLeave: () => setDragOverId((prev) => (prev === id ? null : prev)),
    onDrop: (e: DragEvent<HTMLElement>) => {
      e.preventDefault();
      if (draggedId && draggedId !== id) onReorder(draggedId, id);
      handleDragEnd();
    },
  });

  return { draggedId, dragOverId, getDragHandleProps, getDropTargetProps } as const;
};
