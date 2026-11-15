import type { DragEvent } from 'react';
import { useEffect, useState } from 'react';

// How long a node keeps its "just landed here" highlight after the drop.
const SETTLE_MS = 420;

// A drop target is named by the id of the node it stands for, but the tail of a
// list has no node to name it — so the "add another one here" row stands in for
// it under a target id of its own.
const APPEND_PREFIX = 'append-to-';

export const appendTargetId = (parentId: string) => `${APPEND_PREFIX}${parentId}`;

export const parseAppendTarget = (targetId: string) =>
  targetId.startsWith(APPEND_PREFIX) ? targetId.slice(APPEND_PREFIX.length) : null;

export const useDragReorder = (onReorder: (draggedId: string, targetId: string) => void) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [settledId, setSettledId] = useState<string | null>(null);

  useEffect(() => {
    if (!settledId) return;
    const timer = window.setTimeout(() => setSettledId(null), SETTLE_MS);
    return () => window.clearTimeout(timer);
  }, [settledId]);

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  const getDragHandleProps = (id: string) => ({
    draggable: true,
    onDragStart: (e: DragEvent<HTMLElement>) => {
      e.dataTransfer.effectAllowed = 'move';
      // Firefox refuses to start a drag until the transfer carries something.
      e.dataTransfer.setData('text/plain', id);
      setDraggedId(id);
    },
    onDragEnd: handleDragEnd,
  });

  // Drop zones nest — a section row sits inside the topic it belongs to — so a
  // zone only claims the event once it knows the drag is one of its own, and
  // lets every other drag bubble to the zone that can take it.
  const getDropTargetProps = (id: string) => ({
    onDragOver: (e: DragEvent<HTMLElement>) => {
      if (!draggedId || draggedId === id) return;
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = 'move';
      setDragOverId(id);
    },
    onDragLeave: () => setDragOverId((prev) => (prev === id ? null : prev)),
    onDrop: (e: DragEvent<HTMLElement>) => {
      if (!draggedId || draggedId === id) return;
      e.preventDefault();
      e.stopPropagation();
      onReorder(draggedId, id);
      setSettledId(draggedId);
      handleDragEnd();
    },
  });

  return { draggedId, dragOverId, settledId, getDragHandleProps, getDropTargetProps } as const;
};
