import { useEffect, useRef } from 'react';
import { useCollabContext } from '@/context/CollabContext';
import { useContentEditorContext } from '@/context/ContentEditorContext';

const HEARTBEAT_INTERVAL_MS = 8000;

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

  const collabRef = useRef(collab);
  collabRef.current = collab;

  const lastAppliedRemoteAtRef = useRef(0);

  useEffect(() => {
    if (!collabRef.current) return;
    collabRef.current.joinField(id);
    return () => collabRef.current?.leaveField(id);
  }, [id]);

  const remoteUpdate = collab?.remoteContent.get(id);
  useEffect(() => {
    if (!remoteUpdate || remoteUpdate.receivedAt <= lastAppliedRemoteAtRef.current) return;
    lastAppliedRemoteAtRef.current = remoteUpdate.receivedAt;
    onChangeRef.current(remoteUpdate.html);
  }, [remoteUpdate]);

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
