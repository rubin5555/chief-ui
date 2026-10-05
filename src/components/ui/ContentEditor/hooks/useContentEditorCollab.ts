import { useEffect, useRef } from 'react';
import * as Y from 'yjs';
import { applyTextDiff } from '@/collab/yjsUtils';
import { useCollabContext } from '@/context/CollabContext';
import { useContentEditorContext } from '@/context/ContentEditorContext';

const HEARTBEAT_INTERVAL_MS = 8000;

export const useContentEditorCollab = (
  id: string,
  onChangeRef: React.RefObject<(v: string) => void>,
  initialValue = '',
) => {
  const ctx = useContentEditorContext();
  const collab = useCollabContext();

  const isLockless = collab?.locklessMode ?? false;
  const remoteLock = ctx?.lockState.get(id) ?? null;
  const isLockHolder = isLockless || (!!collab && remoteLock?.holderId === collab.userId);
  const lockedByOther = !isLockless && !!remoteLock && !isLockHolder;
  const remoteCursor = ctx?.remoteCursors.get(id) ?? null;
  const remoteCursorPath = remoteCursor?.path ?? null;

  const isLockHolderRef = useRef(isLockHolder);
  isLockHolderRef.current = isLockHolder;

  const collabRef = useRef(collab);
  collabRef.current = collab;

  const initialValueRef = useRef(initialValue);
  initialValueRef.current = initialValue;

  const ydocRef = useRef<Y.Doc | null>(null);
  if (!ydocRef.current) {
    ydocRef.current = new Y.Doc();
  }

  const isApplyingRemoteRef = useRef(false);
  const hasSyncedRef = useRef(false);

  useEffect(() => {
    if (!collabRef.current) return;
    collabRef.current.joinField(id);
    if (isLockless) {
      collabRef.current.sendYjsSync(id);
    }
    return () => collabRef.current?.leaveField(id);
  }, [id, isLockless]);

  // Handle Yjs remote updates
  useEffect(() => {
    if (!collab || !isLockless) return;

    const unsubscribe = collab.registerYjsListener(id, (update) => {
      const ydoc = ydocRef.current;
      if (!ydoc) return;

      isApplyingRemoteRef.current = true;
      try {
        Y.applyUpdate(ydoc, update, 'remote');
        hasSyncedRef.current = true;
        const currentLen = ydoc.getText('content').length;

        // If doc is still empty after first server sync and we have initial content, seed it
        if (currentLen === 0 && initialValueRef.current) {
          ydoc.getText('content').insert(0, initialValueRef.current);
          const seedUpdate = Y.encodeStateAsUpdate(ydoc);
          collab.sendYjsUpdate(id, Array.from(seedUpdate));
        } else if (currentLen > 0) {
          const mergedHtml = ydoc.getText('content').toString();
          onChangeRef.current(mergedHtml);
        }
      } finally {
        isApplyingRemoteRef.current = false;
      }
    });

    return unsubscribe;
  }, [collab, id, isLockless, onChangeRef]);

  // Fallback: If no server update arrives after 400ms on initial mount, seed initialValue
  useEffect(() => {
    if (!collab || !isLockless) return;
    const timer = setTimeout(() => {
      if (!hasSyncedRef.current) {
        const ydoc = ydocRef.current;
        if (ydoc && ydoc.getText('content').length === 0 && initialValueRef.current) {
          ydoc.getText('content').insert(0, initialValueRef.current);
          const seedUpdate = Y.encodeStateAsUpdate(ydoc);
          collab.sendYjsUpdate(id, Array.from(seedUpdate));
        }
        hasSyncedRef.current = true;
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [collab, id, isLockless]);

  // Handle legacy content updates
  const lastAppliedRemoteAtRef = useRef(0);
  const remoteUpdate = collab?.remoteContent.get(id);
  useEffect(() => {
    if (isLockless || !remoteUpdate || remoteUpdate.receivedAt <= lastAppliedRemoteAtRef.current)
      return;
    lastAppliedRemoteAtRef.current = remoteUpdate.receivedAt;
    onChangeRef.current(remoteUpdate.html);
  }, [remoteUpdate, onChangeRef, isLockless]);

  // Heartbeats for lock-based mode
  useEffect(() => {
    if (!collabRef.current || isLockless || !isLockHolder) return;
    const interval = setInterval(() => collabRef.current?.sendHeartbeat(id), HEARTBEAT_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [isLockHolder, id, isLockless]);

  const broadcastChange = (newValue: string) => {
    if (!collab) return;

    if (isLockless) {
      if (isApplyingRemoteRef.current) return;
      const ydoc = ydocRef.current;
      if (!ydoc) return;
      const ytext = ydoc.getText('content');
      const oldStr = ytext.toString();
      if (oldStr === newValue) return;

      ydoc.once('update', (update: Uint8Array, origin: unknown) => {
        if (origin === 'local') {
          collab.sendYjsUpdate(id, Array.from(update));
        }
      });

      applyTextDiff(ytext, oldStr, newValue);
    } else if (isLockHolderRef.current) {
      collab.sendContent(id, newValue);
    }
  };

  return {
    ctx,
    collab,
    remoteLock,
    isLockHolder,
    isLockHolderRef,
    lockedByOther,
    remoteCursor,
    remoteCursorPath,
    broadcastChange,
  };
};
