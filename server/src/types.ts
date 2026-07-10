// Hand-duplicated from src/hooks/useDocumentTree/useDocumentTree.ts — this repo
// has no workspace to share a types package through yet (see the plan's §1).
// Keep these two definitions in sync by hand until the surface grows enough
// to justify a shared package.
export type FieldKind = 'section' | 'subsection' | 'appendix';

export interface NodePermissions {
  approvers: string[];
  editors: string[];
}

// A structural DOM position, serialized the same way ContentEditor.tsx's
// getNodePath/resolveNodePath already do for chip-drop caret resolution —
// an array of child-sibling indices from the field's root, plus a text offset.
export interface CursorPath {
  startPath: number[];
  startOffset: number;
  endPath: number[];
  endOffset: number;
}

// The WS message envelope (plan §2). Generic and versioned so the future Yjs
// swap only activates the two reserved `yjs:*` variants instead of changing
// the transport. `lock:released` is a small addition beyond the plan's sketch —
// necessary so clients other than the (ex-)holder know to clear the "X is
// editing" badge when a lock frees up, whether by explicit release or timeout.
export type CollabMessage =
  | { type: 'join' | 'leave'; fieldId: string }
  | { type: 'content'; fieldId: string; html: string }
  | { type: 'cursor'; fieldId: string; path: CursorPath }
  | { type: 'lock:acquire' | 'lock:release' | 'lock:heartbeat'; fieldId: string }
  | { type: 'lock:granted' | 'lock:denied' | 'lock:released'; fieldId: string; holderId: string }
  // Reserved for the future CRDT swap (plan §4) — unused by the locking
  // implementation, defined now so the envelope doesn't need to change later.
  | { type: 'yjs:update'; fieldId: string; update: Uint8Array }
  | { type: 'yjs:sync'; fieldId: string; stateVector: Uint8Array };

export type AuditAction = 'edit' | 'lock_acquire' | 'lock_release' | 'restore' | 'create';
