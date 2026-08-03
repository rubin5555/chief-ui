import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { CursorPath } from '@/collab/types';
import type { TinyMceEditor } from '@/components/ui/ContentEditor/ContentEditor.types';
import { type LockInfo, useCollabContext } from './CollabContext';

const MAX_HISTORY_LENGTH = 100;

interface HistoryEntry {
  stack: string[];
  pointer: number;
}

const EMPTY_LOCK_STATE = new Map<string, LockInfo | null>();
const EMPTY_CURSORS = new Map<string, CursorPath | null>();

export interface ContentEditorContextValue {
  toolbarId: string;
  activeId: string | null;
  // The *field* being edited, as opposed to `activeId`'s editor instance. The
  // toolbar acts on the editor for most things, but a footnote belongs to the
  // section rather than to the text inside it.
  activeFieldId: string | null;
  setActive: (id: string | null) => void;
  activeEditor: TinyMceEditor | null;
  setActiveEditor: (editor: TinyMceEditor | null) => void;
  requestActivate: (fieldId: string, instanceId: string) => void;
  lockState: Map<string, LockInfo | null>;
  remoteCursors: Map<string, CursorPath | null>;
  getHistoryValue: (id: string, initialValue: string) => string;
  pushHistoryLevel: (id: string, value: string) => void;
  undoHistory: (id: string) => string | null;
  redoHistory: (id: string) => string | null;
  // Whether this page holds footnotes at all — the document does, the share
  // and template dialogs use the same editor and the same ribbon and do not.
  // That is a different question from whether one can be added *right now*,
  // which is what `addFootnoteToActive` being null answers.
  supportsFootnotes: boolean;
  // Returns the marker the new footnote is numbered with, so the caller can
  // reference it from the text it was added for.
  addFootnoteToActive: (() => string) | null;
}

const ContentEditorContext = createContext<ContentEditorContextValue | null>(null);

export interface ContentEditorProviderProps {
  // How the page adds a footnote to a field, if it can, returning the marker
  // it was numbered with. Left out by a page whose editors have nothing under
  // them to add one to.
  onAddFootnote?: (fieldId: string) => string;
  children: ReactNode;
}

export const ContentEditorProvider = ({ onAddFootnote, children }: ContentEditorProviderProps) => {
  const toolbarId = useRef(`ce-shared-tb-${self.crypto.randomUUID()}`);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);
  const [activeEditor, setActiveEditor] = useState<TinyMceEditor | null>(null);
  const historyRef = useRef(new Map<string, HistoryEntry>());
  const collab = useCollabContext();

  const getEntry = useCallback((id: string, initialValue: string): HistoryEntry => {
    let entry = historyRef.current.get(id);
    if (!entry) {
      entry = { stack: [initialValue], pointer: 0 };
      historyRef.current.set(id, entry);
    }
    return entry;
  }, []);

  const getHistoryValue = useCallback(
    (id: string, initialValue: string) => {
      const entry = getEntry(id, initialValue);
      return entry.stack[entry.pointer];
    },
    [getEntry],
  );

  const pushHistoryLevel = useCallback(
    (id: string, value: string) => {
      const entry = getEntry(id, value);
      if (entry.stack[entry.pointer] === value) return;

      entry.stack = entry.stack.slice(0, entry.pointer + 1);
      entry.stack.push(value);

      if (entry.stack.length > MAX_HISTORY_LENGTH) {
        entry.stack = entry.stack.slice(entry.stack.length - MAX_HISTORY_LENGTH);
      }
      entry.pointer = entry.stack.length - 1;
    },
    [getEntry],
  );

  const undoHistory = useCallback((id: string) => {
    const entry = historyRef.current.get(id);
    if (!entry || entry.pointer <= 0) return null;
    entry.pointer -= 1;
    return entry.stack[entry.pointer];
  }, []);

  const redoHistory = useCallback((id: string) => {
    const entry = historyRef.current.get(id);
    if (!entry || entry.pointer >= entry.stack.length - 1) return null;
    entry.pointer += 1;
    return entry.stack[entry.pointer];
  }, []);

  const setActive = useCallback((id: string | null) => {
    setActiveId(id);
    if (id === null) setActiveFieldId(null);
  }, []);

  const requestActivate = useCallback(
    (fieldId: string, instanceId: string) => {
      setActiveId(instanceId);
      setActiveFieldId(fieldId);
      if (!collab) return;

      collab.acquireLock(fieldId).then((granted) => {
        if (granted) return;
        setActiveId((current) => (current === instanceId ? null : current));
        setActiveFieldId((current) => (current === fieldId ? null : current));
      });
    },
    [collab],
  );

  const addFootnoteToActive = useMemo(
    () => (onAddFootnote && activeFieldId ? () => onAddFootnote(activeFieldId) : null),
    [onAddFootnote, activeFieldId],
  );

  const value = useMemo<ContentEditorContextValue>(
    () => ({
      toolbarId: toolbarId.current,
      activeId,
      activeFieldId,
      setActive,
      activeEditor,
      setActiveEditor,
      requestActivate,
      supportsFootnotes: onAddFootnote !== undefined,
      addFootnoteToActive,
      lockState: collab?.lockState ?? EMPTY_LOCK_STATE,
      remoteCursors: collab?.remoteCursors ?? EMPTY_CURSORS,
      getHistoryValue,
      pushHistoryLevel,
      undoHistory,
      redoHistory,
    }),
    [
      activeId,
      activeFieldId,
      setActive,
      activeEditor,
      collab,
      requestActivate,
      onAddFootnote,
      addFootnoteToActive,
      getHistoryValue,
      pushHistoryLevel,
      undoHistory,
      redoHistory,
    ],
  );

  return <ContentEditorContext.Provider value={value}>{children}</ContentEditorContext.Provider>;
};

export const useContentEditorContext = () => {
  return useContext(ContentEditorContext);
};
