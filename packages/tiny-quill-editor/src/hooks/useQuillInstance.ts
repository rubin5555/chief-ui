'use client';

import Quill from 'quill';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TextDirection } from '../i18n';
import {
  registerTableClipboardMatcher,
  registerTinyTableBlot,
} from '../TinyTableBlot';

interface UseQuillInstanceParams {
  quillInstanceRef: React.MutableRefObject<any>;
  quillClassRef: React.MutableRefObject<any>;
  initialValue: string;
  placeholder: string;
  direction: TextDirection;
  loadHTMLIntoEditor: (html: string, notify?: boolean) => void;
  pushHistorySnapshot: (immediate?: boolean, notify?: boolean) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onReady?: (root: HTMLElement, quill: any) => void;
}

export function useQuillInstance({
  quillInstanceRef,
  quillClassRef,
  initialValue,
  placeholder,
  direction,
  loadHTMLIntoEditor,
  pushHistorySnapshot,
  onUndo,
  onRedo,
  onReady,
}: UseQuillInstanceParams) {
  const quillMountRef = useRef<HTMLDivElement | null>(null);
  const [activeFormats, setActiveFormats] = useState<Record<string, any>>({});
  const onUndoRef = useRef(onUndo);
  onUndoRef.current = onUndo;
  const onRedoRef = useRef(onRedo);
  onRedoRef.current = onRedo;
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  const refreshActiveFormats = useCallback(() => {
    const quill = quillInstanceRef.current;
    if (!quill) return;
    try {
      const range = quill.getSelection();
      if (!range) return;
      const fmt = quill.getFormat(range) || {};
      setActiveFormats((prev) => {
        const keys = new Set([...Object.keys(prev), ...Object.keys(fmt)]);
        for (const k of keys) {
          if (prev[k] !== fmt[k]) return { ...fmt };
        }
        return prev;
      });
    } catch {}
  }, [quillInstanceRef]);

  // Initialize Quill 2.x synchronously on Mount
  useEffect(() => {
    if (!quillMountRef.current || quillInstanceRef.current) return;

    quillClassRef.current = Quill;
    registerTinyTableBlot(Quill);

    const quill = new Quill(quillMountRef.current, {
      placeholder,
      modules: {
        toolbar: false,
        keyboard: {
          bindings: {
            undo: {
              key: 'z',
              shortKey: true,
              handler: () => {
                onUndoRef.current?.();
                return false;
              },
            },
            redo: {
              key: 'y',
              shortKey: true,
              handler: () => {
                onRedoRef.current?.();
                return false;
              },
            },
            redoShift: {
              key: 'z',
              shortKey: true,
              shiftKey: true,
              handler: () => {
                onRedoRef.current?.();
                return false;
              },
            },
          },
        },
        history: {
          delay: 400,
          maxStack: 100,
          userOnly: true,
        },
      },
    });

    if (quill.root) {
      quill.root.setAttribute('dir', direction);
    }

    registerTableClipboardMatcher(quill, Quill);
    quillInstanceRef.current = quill;

    if (initialValue) {
      loadHTMLIntoEditor(initialValue, false);
    } else {
      pushHistorySnapshot(true, false);
    }

    quill.on('text-change', () => {
      pushHistorySnapshot(false);
      refreshActiveFormats();
    });

    quill.on('selection-change', (range: unknown) => {
      if (range) refreshActiveFormats();
    });

    if (quill.root) {
      onReadyRef.current?.(quill.root as HTMLElement, quill);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync document direction (`ltr` / `rtl`) whenever locale or direction changes
  useEffect(() => {
    const quill = quillInstanceRef.current;
    if (quill && quill.root) {
      quill.root.setAttribute('dir', direction);
    }
  }, [direction]);

  const handleInsertCallout = useCallback(() => {
    const quill = quillInstanceRef.current;
    if (quill) {
      const range = quill.getSelection(true) || { index: quill.getLength() - 1 };
      quill.insertEmbed(range.index, 'callout', {
        type: 'info',
        html: '<p><strong>Key Insight:</strong> Rich text callout box.</p>',
      });
      pushHistorySnapshot(true);
    }
  }, [pushHistorySnapshot]);

  const handleInsertDivider = useCallback(() => {
    const quill = quillInstanceRef.current;
    if (quill) {
      const range = quill.getSelection(true) || { index: quill.getLength() - 1 };
      quill.insertEmbed(range.index, 'divider', true);
      pushHistorySnapshot(true);
    }
  }, [pushHistorySnapshot]);

  return {
    quillMountRef,
    quillInstanceRef,
    quillClassRef,
    activeFormats,
    refreshActiveFormats,
    handleInsertCallout,
    handleInsertDivider,
  };
}
