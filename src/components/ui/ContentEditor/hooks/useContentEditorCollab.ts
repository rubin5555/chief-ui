import { useEffect, useRef } from 'react';
import * as Y from 'yjs';
import { applyTextDiff } from '@/collab/yjsUtils';
import { useCollabContext } from '@/context/CollabContext';
import { useContentEditorContext } from '@/context/ContentEditorContext';

export const useContentEditorCollab = (
  id: string,
  onChangeRef: React.RefObject<(v: string) => void>,
  initialValue = '',
) => {
  const ctx = useContentEditorContext();
  const collab = useCollabContext();

  const remoteCursor = ctx?.remoteCursors.get(id) ?? null;
  const remoteCursorPath = remoteCursor?.path ?? null;

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
    collabRef.current.sendYjsSync(id);
    return () => collabRef.current?.leaveField(id);
  }, [id]);

  // Handle Yjs remote updates
  useEffect(() => {
    if (!collab) return;

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
  }, [collab, id, onChangeRef]);

  // Fallback: If no server update arrives after 400ms on initial mount, seed initialValue
  useEffect(() => {
    if (!collab) return;
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
  }, [collab, id]);

  const broadcastChange = (newValue: string) => {
    if (!collab) return;
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
  };

  return {
    ctx,
    collab,
    remoteCursor,
    remoteCursorPath,
    broadcastChange,
  };
};
