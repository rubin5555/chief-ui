import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { CursorPath } from '@/collab/types';
import type { TinyMceEditor } from '@/components/ui/ContentEditor/ContentEditor.types';
import { type LockInfo, useCollabContext } from './CollabContext';

// Cap per-field history so a long editing session on a large list can't grow unbounded.
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
  setActive: (id: string | null) => void;
  /**
   * The open field's TinyMCE instance, which is what the shared ribbon acts on.
   *
   * `activeId` says *which* field is open; this is the object you can send a
   * command to. They are set and cleared together, but kept apart because the id
   * is the editor's identity — used for locking and for history — while this is a
   * handle that only exists between `onInit` and unmount.
   */
  activeEditor: TinyMceEditor | null;
  setActiveEditor: (editor: TinyMceEditor | null) => void;
  // Requests the lock for `fieldId` (the stable domain id — see
  // ContentEditor's `id` prop) then, on grant, activates `instanceId` (the
  // editor's own per-mount id — see ContentEditor's `myId`). The two are
  // different things: locking is keyed by field, local activation by mount.
  // Optimistic — activates immediately, rolls back only if denied (plan §3).
  // With no CollabProvider above this one, degrades to the original
  // always-succeeds setActive(instanceId).
  requestActivate: (fieldId: string, instanceId: string) => void;
  lockState: Map<string, LockInfo | null>;
  remoteCursors: Map<string, CursorPath | null>;
  // Undo/redo history keyed by a stable field id rather than the editor instance,
  // so it survives the field's TinyMCE instance being unmounted and remounted
  // (e.g. scrolling a field out of and back into a virtualised list).
  getHistoryValue: (id: string, initialValue: string) => string;
  pushHistoryLevel: (id: string, value: string) => void;
  undoHistory: (id: string) => string | null;
  redoHistory: (id: string) => string | null;
}

const ContentEditorContext = createContext<ContentEditorContextValue | null>(null);

export const ContentEditorProvider = ({ children }: { children: ReactNode }) => {
  const toolbarId = useRef(`ce-shared-tb-${self.crypto.randomUUID()}`);
  const [activeId, setActiveId] = useState<string | null>(null);
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

  const requestActivate = useCallback(
    (fieldId: string, instanceId: string) => {
      if (!collab) {
        setActiveId(instanceId);
        return;
      }
      setActiveId(instanceId);
      collab.acquireLock(fieldId).then((granted) => {
        if (!granted) {
          setActiveId((current) => (current === instanceId ? null : current));
        }
      });
    },
    [collab],
  );

  const value = useMemo<ContentEditorContextValue>(
    () => ({
      toolbarId: toolbarId.current,
      activeId,
      setActive: setActiveId,
      activeEditor,
      setActiveEditor,
      requestActivate,
      lockState: collab?.lockState ?? EMPTY_LOCK_STATE,
      remoteCursors: collab?.remoteCursors ?? EMPTY_CURSORS,
      getHistoryValue,
      pushHistoryLevel,
      undoHistory,
      redoHistory,
    }),
    [
      activeId,
      activeEditor,
      collab,
      requestActivate,
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
