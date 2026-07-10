import { store } from './store/memoryStore.js';

let nextSnapshotId = 1;

// Restorable checkpoints (plan §5) — periodic/manual, never per-keystroke.
// RoomManager calls this once per edit *session* (on lock release), not on
// every debounced content push, which is what keeps this from degenerating
// into a snapshot-per-keystroke log.
export const writeVersionSnapshot = (
  fieldId: string,
  content: string,
  createdBy: string,
  label: string | null = null,
): string => {
  const id = `snap-${nextSnapshotId++}`;
  store.addVersionSnapshot({ id, fieldId, content, createdBy, createdAt: Date.now(), label });
  return id;
};

// Restore = insert a new snapshot copying the target content forward, then
// fast-forward the field's live content to match — never a destructive
// rewrite of history, so the restore itself stays visible in the snapshot
// list and the audit log (plan §5).
export const restoreVersionSnapshot = (
  fieldId: string,
  snapshotId: string,
  actorId: string,
): string | null => {
  const target = store.listVersionSnapshots(fieldId).find((snapshot) => snapshot.id === snapshotId);
  if (!target) return null;
  store.updateFieldContent(fieldId, target.content, Date.now());
  return writeVersionSnapshot(fieldId, target.content, actorId, `restored from ${snapshotId}`);
};
