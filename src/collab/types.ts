// Hand-duplicated from server/src/types.ts (a sibling worktree — see the plan
// at C:/Users/Chief/.claude/plans/vast-juggling-hummingbird.md §1: no shared
// package exists yet). Keep the two definitions in sync by hand.

// A structural DOM position, serialized the same way ContentEditor's
// nodePath.ts already does for chip-drop caret resolution — an array of
// child-sibling indices from the field's root, plus a text offset.
export interface CursorPath {
  startPath: number[];
  startOffset: number;
  endPath: number[];
  endOffset: number;
}

export type CollabMessage =
  | { type: 'join' | 'leave'; fieldId: string }
  | { type: 'content'; fieldId: string; html: string }
  | { type: 'cursor'; fieldId: string; path: CursorPath }
  | { type: 'lock:acquire' | 'lock:release' | 'lock:heartbeat'; fieldId: string }
  | { type: 'lock:granted' | 'lock:released'; fieldId: string; holderId: string }
  | { type: 'lock:denied'; fieldId: string; holderId: string; reason: 'held' | 'unauthorized' }
  // Reserved for the future CRDT swap (plan §4) — unused by the locking
  // implementation on either side.
  | { type: 'yjs:update'; fieldId: string; update: Uint8Array }
  | { type: 'yjs:sync'; fieldId: string; stateVector: Uint8Array };
