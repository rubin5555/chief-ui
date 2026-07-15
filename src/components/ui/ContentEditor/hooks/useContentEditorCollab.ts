import { useEffect, useRef } from 'react';
import { useCollabContext } from '@/context/CollabContext';
import { useContentEditorContext } from '@/context/ContentEditorContext';

const HEARTBEAT_INTERVAL_MS = 8000;

// Owns every effect that keeps a single field's collab room membership, lock
// state, and remote-content sync alive. Standalone (no ContentEditorProvider
// above) degrades to ctx/collab both null and every derived value below to
// its non-collaborative default.
export const useContentEditorCollab = (
  id: string,
  onChangeRef: React.RefObject<(v: string) => void>,
) => {
  const ctx = useContentEditorContext();
  const collab = useCollabContext();

  const remoteLock = ctx?.lockState.get(id) ?? null;
  const isLockHolder = !!collab && remoteLock?.holderId === collab.userId;
  const lockedByOther = !!remoteLock && !isLockHolder;
  const remoteCursorPath = ctx?.remoteCursors.get(id) ?? null;

  const isLockHolderRef = useRef(isLockHolder);
  isLockHolderRef.current = isLockHolder;

  // CollabContext's value is a plain object recomputed whenever lockState/remoteCursors/
  // remoteContent change (i.e. on every incoming WS message) — its identity is not stable
  // across renders. Effects below need a `collab` reference but must NOT re-run every time
  // a message arrives (a join/leave effect keyed on the object itself would re-fire on
  // every message its own join triggers a response for, looping forever), so they read it
  // through this ref and key their dependency arrays on collab?.userId instead, which only
  // actually changes when the connection itself is torn down and rebuilt.
  const collabRef = useRef(collab);
  collabRef.current = collab;

  const lastAppliedRemoteAtRef = useRef(0);

  // Every mounted field (active or previewing) joins its own collab room, so
  // remote content/cursor/lock updates reach the preview even when this
  // client never activates the field itself.
  useEffect(() => {
    if (!collabRef.current) return;
    collabRef.current.joinField(id);
    return () => collabRef.current?.leaveField(id);
  }, [id]);

  // A remote content push (only ever sent to non-holders — see RoomManager's
  // authorization check server-side) is applied the same way a local edit
  // is: through onChange, so it flows into the parent's document tree and
  // the preview re-renders from the updated `value` like any other change.
  const remoteUpdate = collab?.remoteContent.get(id);
  useEffect(() => {
    if (!remoteUpdate || remoteUpdate.receivedAt <= lastAppliedRemoteAtRef.current) return;
    lastAppliedRemoteAtRef.current = remoteUpdate.receivedAt;
    onChangeRef.current(remoteUpdate.html);
  }, [remoteUpdate]);

  // Keeps the server from auto-releasing this lock for silence (plan §3's
  // 30s timeout) while we're still the active holder.
  useEffect(() => {
    if (!collabRef.current || !isLockHolder) return;
    const interval = setInterval(() => collabRef.current?.sendHeartbeat(id), HEARTBEAT_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [isLockHolder, id]);

  return {
    ctx,
    collab,
    remoteLock,
    isLockHolder,
    isLockHolderRef,
    lockedByOther,
    remoteCursorPath,
  };
};
