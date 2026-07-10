import type { ReactNode } from 'react';
import { createContext, useContext, useRef, useState } from 'react';

// Cap per-field history so a long editing session on a large list can't grow unbounded.
const MAX_HISTORY_LENGTH = 100;

interface HistoryEntry {
  stack: string[];
  pointer: number;
}

interface ContentEditorContextValue {
  toolbarId: string;
  activeId: string | null;
  setActive: (id: string | null) => void;
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
  const historyRef = useRef(new Map<string, HistoryEntry>());

  const getEntry = (id: string, initialValue: string): HistoryEntry => {
    let entry = historyRef.current.get(id);
    if (!entry) {
      entry = { stack: [initialValue], pointer: 0 };
      historyRef.current.set(id, entry);
    }
    return entry;
  };

  const getHistoryValue = (id: string, initialValue: string) => {
    const entry = getEntry(id, initialValue);
    return entry.stack[entry.pointer];
  };

  const pushHistoryLevel = (id: string, value: string) => {
    const entry = getEntry(id, value);
    if (entry.stack[entry.pointer] === value) return;

    entry.stack = entry.stack.slice(0, entry.pointer + 1);
    entry.stack.push(value);

    if (entry.stack.length > MAX_HISTORY_LENGTH) {
      entry.stack = entry.stack.slice(entry.stack.length - MAX_HISTORY_LENGTH);
    }
    entry.pointer = entry.stack.length - 1;
  };

  const undoHistory = (id: string) => {
    const entry = historyRef.current.get(id);
    if (!entry || entry.pointer <= 0) return null;
    entry.pointer -= 1;
    return entry.stack[entry.pointer];
  };

  const redoHistory = (id: string) => {
    const entry = historyRef.current.get(id);
    if (!entry || entry.pointer >= entry.stack.length - 1) return null;
    entry.pointer += 1;
    return entry.stack[entry.pointer];
  };

  return (
    <ContentEditorContext.Provider
      value={{
        toolbarId: toolbarId.current,
        activeId,
        setActive: setActiveId,
        getHistoryValue,
        pushHistoryLevel,
        undoHistory,
        redoHistory,
      }}
    >
      {children}
    </ContentEditorContext.Provider>
  );
};

export const useContentEditorContext = () => {
  return useContext(ContentEditorContext);
};
