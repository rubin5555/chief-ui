'use client';

import { useCallback, useRef, useState } from 'react';
import { EditorTranslations } from '../i18n';

export interface FormatPainterData {
  active: boolean;
  persistent: boolean;
  format: {
    isCell: boolean;
    quillFormats: Record<string, any>;
    cellStyles: {
      backgroundColor?: string;
      color?: string;
      verticalAlign?: string;
      textAlign?: string;
      border?: string;
      borderColor?: string;
      padding?: string;
    };
  };
}

interface UseFormatPainterParams {
  quillInstanceRef: React.MutableRefObject<any>;
  resolveTargetCell: () => HTMLTableCellElement | null;
  pushHistorySnapshot: (immediate?: boolean) => void;
  showToast: (msg: string) => void;
  translations: EditorTranslations;
}

export function useFormatPainter({
  quillInstanceRef,
  resolveTargetCell,
  pushHistorySnapshot,
  showToast,
  translations: t,
}: UseFormatPainterParams) {
  const [formatPainterState, setFormatPainterState] = useState<FormatPainterData | null>(null);
  const formatPainterRef = useRef<FormatPainterData | null>(null);

  const setPainter = useCallback((next: FormatPainterData | null) => {
    formatPainterRef.current = next;
    setFormatPainterState(next);
  }, []);

  const handleTriggerFormatPainter = useCallback(
    (persistent = false) => {
      if (formatPainterRef.current?.active) {
        setPainter(null);
        showToast(t.toasts.formatCancelled);
        return;
      }

      const quill = quillInstanceRef.current;
      const cell = resolveTargetCell();

      let cellStyles: FormatPainterData['format']['cellStyles'] = {};
      let quillFormats: Record<string, any> = {};

      if (cell) {
        cellStyles = {
          backgroundColor: cell.style.backgroundColor || '',
          color: cell.style.color || '',
          verticalAlign: cell.style.verticalAlign || '',
          textAlign: cell.style.textAlign || '',
          border: cell.style.border || '',
          borderColor: cell.style.borderColor || '',
          padding: cell.style.padding || '',
        };
      }

      if (quill) {
        const range = quill.getSelection();
        quillFormats = range ? quill.getFormat(range) : quill.getFormat() || {};
      }

      setPainter({
        active: true,
        persistent,
        format: {
          isCell: Boolean(cell),
          cellStyles,
          quillFormats,
        },
      });

      showToast(persistent ? t.toasts.formatLocked : t.toasts.formatCopied);
    },
    [quillInstanceRef, resolveTargetCell, setPainter, showToast, t.toasts]
  );

  const applyFormatPainterOnMouseUp = useCallback(
    (e: MouseEvent) => {
      const painter = formatPainterRef.current;
      if (!painter?.active) return;

      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (
        target.closest('[data-tiny-table-ui="true"]') ||
        target.closest('[data-modal-container="true"]') ||
        target.closest('[data-editor-chrome="true"]')
      ) {
        return;
      }

      const targetCell = target.closest('td, th') as HTMLTableCellElement | null;
      const quill = quillInstanceRef.current;
      let applied = false;

      if (targetCell) {
        const { cellStyles, quillFormats } = painter.format;
        if (cellStyles) {
          if (cellStyles.backgroundColor !== undefined)
            targetCell.style.backgroundColor = cellStyles.backgroundColor;
          if (cellStyles.color !== undefined) targetCell.style.color = cellStyles.color;
          if (cellStyles.verticalAlign !== undefined)
            targetCell.style.verticalAlign = cellStyles.verticalAlign;
          if (cellStyles.textAlign !== undefined)
            targetCell.style.textAlign = cellStyles.textAlign;
          if (cellStyles.border !== undefined) targetCell.style.border = cellStyles.border;
          if (cellStyles.borderColor !== undefined)
            targetCell.style.borderColor = cellStyles.borderColor;
          if (cellStyles.padding !== undefined)
            targetCell.style.padding = cellStyles.padding;
          applied = true;
        }

        const sel = window.getSelection();
        if (sel && sel.toString().length > 0 && targetCell.contains(sel.anchorNode)) {
          Object.entries(quillFormats || {}).forEach(([fmt, val]) => {
            document.execCommand(fmt, false, val);
          });
          applied = true;
        }
      } else if (quill && quill.root && quill.root.contains(target)) {
        const range = quill.getSelection();
        if (range && range.length > 0) {
          const { quillFormats } = painter.format;
          if (quillFormats) {
            Object.entries(quillFormats).forEach(([fmt, val]) => {
              quill.formatText(range.index, range.length, fmt, val, 'user');
            });
            applied = true;
          }
        }
      }

      if (applied) {
        pushHistorySnapshot(true);
        if (!painter.persistent) {
          setPainter(null);
          showToast(t.toasts.formatApplied);
        } else {
          showToast(t.toasts.formatAppliedLocked);
        }
      }
    },
    [pushHistorySnapshot, quillInstanceRef, setPainter, showToast, t.toasts]
  );

  const cancelFormatPainter = useCallback(() => {
    if (formatPainterRef.current?.active) {
      setPainter(null);
      showToast(t.toasts.formatCancelled);
    }
  }, [setPainter, showToast, t.toasts]);

  return {
    formatPainterState,
    formatPainterRef,
    handleTriggerFormatPainter,
    applyFormatPainterOnMouseUp,
    cancelFormatPainter,
  };
}
