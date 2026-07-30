import type { DragEvent } from 'react';
import { useState } from 'react';

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
