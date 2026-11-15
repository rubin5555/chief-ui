'use client';

import { useCallback, useRef } from 'react';
import { exportCleanHTML, normalizeTableElement } from '../tableEngine';
import { attachTableWrapperListeners } from '../TinyTableBlot';

interface UseEditorHistoryParams {
  quillInstanceRef: React.MutableRefObject<any>;
  quillClassRef: React.MutableRefObject<any>;
  initialValue?: string;
  onChange?: (cleanHTML: string) => void;
  showToast: (msg: string) => void;
  onClearSelection: () => void;
}

export function useEditorHistory({
  quillInstanceRef,
  quillClassRef,
  initialValue = '',
  onChange,
  showToast,
  onClearSelection,
}: UseEditorHistoryParams) {
  const historyStackRef = useRef<string[]>([]);
  const historyIndexRef = useRef<number>(-1);
  const isRestoringHistoryRef = useRef(false);
  const snapshotTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastEmittedHtmlRef = useRef<string | null>(initialValue);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const updateStatsAndNotify = useCallback(() => {
    const quill = quillInstanceRef.current;
    if (!quill || !quill.root) return;

    const root = quill.root as HTMLElement;
    if (onChangeRef.current) {
      const clean = exportCleanHTML(root);
      if (clean === lastEmittedHtmlRef.current) return;
      lastEmittedHtmlRef.current = clean;
      onChangeRef.current(clean);
    }
  }, [quillInstanceRef]);

  const pushHistorySnapshot = useCallback(
    (immediate = false, notify = true) => {
      if (isRestoringHistoryRef.current) return;
      if (notify && !immediate) {
        updateStatsAndNotify();
      }
      const record = () => {
        const quill = quillInstanceRef.current;
        if (!quill || !quill.root) return;
        const currentHTML = (quill.root as HTMLElement).innerHTML;
        const stack = historyStackRef.current;
        const idx = historyIndexRef.current;
        if (idx >= 0 && stack[idx] === currentHTML) return;

        const nextStack = stack.slice(0, idx + 1);
        nextStack.push(currentHTML);
        if (nextStack.length > 60) {
          nextStack.shift();
        }
        historyStackRef.current = nextStack;
        historyIndexRef.current = nextStack.length - 1;
        if (notify) {
          updateStatsAndNotify();
        }
      };

      if (snapshotTimerRef.current) clearTimeout(snapshotTimerRef.current);
      if (immediate) {
        record();
      } else {
        snapshotTimerRef.current = setTimeout(record, 250);
      }
    },
    [quillInstanceRef, updateStatsAndNotify]
  );

  const rebindAllTables = useCallback((root: HTMLElement) => {
    const wrappers = Array.from(root.querySelectorAll('.ql-tiny-table-wrapper')) as HTMLElement[];
    wrappers.forEach((w) => {
      w.setAttribute('tabindex', '-1');
      delete w.dataset.listenersAttached;
      attachTableWrapperListeners(w);
      const tbl = w.querySelector('table');
      if (tbl) normalizeTableElement(tbl as HTMLTableElement);
    });
  }, []);

  const loadHTMLIntoEditor = useCallback(
    (html: string, notify = true) => {
      const quill = quillInstanceRef.current;
      const Quill = quillClassRef.current;
      if (!quill || !Quill) return;

      const root = quill.root as HTMLElement;
      const parser = new DOMParser();
      const doc = parser.parseFromString(html || '<p><br></p>', 'text/html');

      Array.from(doc.body.querySelectorAll('table')).forEach((tbl) => {
        if (tbl.closest('.ql-tiny-table-wrapper')) return;
        const wrapper = doc.createElement('div');
        wrapper.className = 'ql-tiny-table-wrapper';
        wrapper.setAttribute('contenteditable', 'false');
        wrapper.setAttribute('tabindex', '-1');
        normalizeTableElement(tbl as HTMLTableElement);
        tbl.parentNode?.replaceChild(wrapper, tbl);
        wrapper.appendChild(tbl);
      });

      root.innerHTML = doc.body.innerHTML || '<p><br></p>';
      rebindAllTables(root);
      if (typeof quill.update === 'function') {
        quill.update('silent');
      }
      lastEmittedHtmlRef.current = html;
      pushHistorySnapshot(true, notify);
    },
    [pushHistorySnapshot, quillClassRef, quillInstanceRef, rebindAllTables]
  );

  const handleUndo = useCallback(() => {
    const quill = quillInstanceRef.current;
    if (!quill || !quill.root) return;
    if (historyIndexRef.current <= 0) {
      showToast('Nothing to undo');
      return;
    }
    isRestoringHistoryRef.current = true;
    historyIndexRef.current -= 1;
    const prevHTML = historyStackRef.current[historyIndexRef.current];
    (quill.root as HTMLElement).innerHTML = prevHTML;
    rebindAllTables(quill.root as HTMLElement);
    if (typeof quill.update === 'function') {
      quill.update('silent');
    }
    onClearSelection();
    updateStatsAndNotify();
    setTimeout(() => {
      isRestoringHistoryRef.current = false;
    }, 50);
  }, [onClearSelection, quillInstanceRef, rebindAllTables, showToast, updateStatsAndNotify]);

  const handleRedo = useCallback(() => {
    const quill = quillInstanceRef.current;
    if (!quill || !quill.root) return;
    if (historyIndexRef.current >= historyStackRef.current.length - 1) {
      showToast('Nothing to redo');
      return;
    }
    isRestoringHistoryRef.current = true;
    historyIndexRef.current += 1;
    const nextHTML = historyStackRef.current[historyIndexRef.current];
    (quill.root as HTMLElement).innerHTML = nextHTML;
    rebindAllTables(quill.root as HTMLElement);
    if (typeof quill.update === 'function') {
      quill.update('silent');
    }
    onClearSelection();
    updateStatsAndNotify();
    setTimeout(() => {
      isRestoringHistoryRef.current = false;
    }, 50);
  }, [onClearSelection, quillInstanceRef, rebindAllTables, showToast, updateStatsAndNotify]);

  return {
    lastEmittedHtmlRef,
    pushHistorySnapshot,
    rebindAllTables,
    loadHTMLIntoEditor,
    handleUndo,
    handleRedo,
  };
}
