export interface CursorPath {
  startPath: number[];
  startOffset: number;
  endPath: number[];
  endOffset: number;
}

export interface RemoteCursorInfo {
  path: CursorPath;
  userId: string;
}

export type CollabMessage =
  | { type: 'join' | 'leave'; fieldId: string }
  | { type: 'content'; fieldId: string; html: string }
  | { type: 'cursor'; fieldId: string; path: CursorPath; userId?: string }
  | { type: 'yjs:update'; fieldId: string; update: number[] | Uint8Array }
  | { type: 'yjs:sync'; fieldId: string; stateVector?: number[] | Uint8Array }
  | { type: 'db:autosave'; fieldId: string; savedAt: number };
