'use client';

import { useCallback, useEffect, useState } from 'react';
import { ActiveModalType } from '../types';
import { MenubarKey } from '../components/EditorMenubar';

export function useEditorViewport(initialHeight = 320) {
  const [showTablePicker, setShowTablePicker] = useState(false);
  const [activeMenubar, setActiveMenubar] = useState<MenubarKey>(null);
  const [showTextColorPopover, setShowTextColorPopover] = useState(false);
  const [showBgColorPopover, setShowBgColorPopover] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [activeModal, setActiveModal] = useState<ActiveModalType>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showVisualAids, setShowVisualAids] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [editorHeight, setEditorHeight] = useState<number>(initialHeight);
  const [draggingEditorHeight, setDraggingEditorHeight] = useState<{
    startY: number;
    initialHeight: number;
  } | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2600);
  }, []);

  const closeAllPopovers = useCallback(() => {
    setActiveMenubar(null);
    setShowTablePicker(false);
    setShowTextColorPopover(false);
    setShowBgColorPopover(false);
  }, []);

  // Editor Height Drag Resizing
  useEffect(() => {
    if (!draggingEditorHeight) return;
    const handleMove = (e: MouseEvent) => {
      const deltaY = e.clientY - draggingEditorHeight.startY;
      setEditorHeight(
        Math.max(160, Math.min(1600, Math.round(draggingEditorHeight.initialHeight + deltaY)))
      );
    };
    const handleUp = () => setDraggingEditorHeight(null);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [draggingEditorHeight]);

  return {
    showTablePicker,
    setShowTablePicker,
    activeMenubar,
    setActiveMenubar,
    showTextColorPopover,
    setShowTextColorPopover,
    showBgColorPopover,
    setShowBgColorPopover,
    contextMenuPos,
    setContextMenuPos,
    activeModal,
    setActiveModal,
    isFullscreen,
    setIsFullscreen,
    showVisualAids,
    setShowVisualAids,
    toastMessage,
    showToast,
    editorHeight,
    draggingEditorHeight,
    setDraggingEditorHeight,
    closeAllPopovers,
  };
}
