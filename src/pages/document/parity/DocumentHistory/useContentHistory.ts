import { useState } from 'react';

interface HistoryEntry {
  stack: string[];
  index: number;
}

export interface HistoryState {
  canUndo: boolean;
  canRedo: boolean;
  /** True while the shown content is behind the newest entry. */
  isInPast: boolean;
}

const EMPTY_STATE: HistoryState = { canUndo: false, canRedo: false, isInPast: false };

// main's per-node undo/redo stacks (Edit.tsx:3208, 3337-3391) — five handlers and
// a `Record` living among the page's other seventy-odd state variables, and never
// rendered by anything: `handleUndo`, `handleRedo`, `getHistoryState` and
// `confirmSaveVersion` have no call sites at all.
//
// Two things change here. The store is a hook rather than page state, so it can
// be used without inheriting a monolith; and undo/redo *return* the content to
// restore instead of calling a setter from inside a `setState` updater, which is
// a side effect in a function React may run twice.
export const useContentHistory = () => {
  const [entries, setEntries] = useState<Record<string, HistoryEntry>>({});

  // A new edit truncates whatever was redoable: once you type over a branch, the
  // future you abandoned isn't reachable any more.
  const push = (id: string, content: string) => {
    setEntries((previous) => {
      const entry = previous[id] ?? { stack: [], index: -1 };
      if (entry.stack[entry.index] === content) return previous;
      const stack = [...entry.stack.slice(0, entry.index + 1), content];
      return { ...previous, [id]: { stack, index: stack.length - 1 } };
    });
  };

  const step = (id: string, delta: number): string | null => {
    const entry = entries[id];
    if (!entry) return null;
    const index = entry.index + delta;
    if (index < 0 || index > entry.stack.length - 1) return null;
    setEntries((previous) => ({ ...previous, [id]: { ...previous[id], index } }));
    return entry.stack[index];
  };

  const undo = (id: string) => step(id, -1);
  const redo = (id: string) => step(id, 1);

  /** Drops the redo tail, making the current entry the newest one. */
  const saveVersion = (id: string) => {
    setEntries((previous) => {
      const entry = previous[id];
      if (!entry) return previous;
      return {
        ...previous,
        [id]: { stack: entry.stack.slice(0, entry.index + 1), index: entry.index },
      };
    });
  };

  const getState = (id: string): HistoryState => {
    const entry = entries[id];
    if (!entry || entry.stack.length === 0) return EMPTY_STATE;
    return {
      canUndo: entry.index > 0,
      canRedo: entry.index < entry.stack.length - 1,
      isInPast: entry.index < entry.stack.length - 1,
    };
  };

  return { push, undo, redo, saveVersion, getState } as const;
};
