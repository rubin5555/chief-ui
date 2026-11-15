import { useEffect, useRef } from 'react';
import * as Y from 'yjs';
import { applyTextDiff } from '@/collab/yjsUtils';
import { useCollabContext } from '@/context/CollabContext';
import { useContentEditorContext } from '@/context/ContentEditorContext';

// ponytail: deterministic clientID=1 seed makes initial HTML idempotent across peers
const seedYDoc = (ydoc: Y.Doc, text: string) => {
  if (!text || ydoc.getText('content').length > 0) return;
  const seed = new Y.Doc();
  seed.clientID = 1;
  seed.getText('content').insert(0, text);
  Y.applyUpdate(ydoc, Y.encodeStateAsUpdate(seed), 'seed');
};

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
    seedYDoc(ydocRef.current, initialValue);
  }

  const isApplyingRemoteRef = useRef(false);
  const serverHasStateRef = useRef(false);

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
        const incomingDoc = new Y.Doc();
        Y.applyUpdate(incomingDoc, update);
        if (incomingDoc.getText('content').length === 0) {
          seedYDoc(ydoc, initialValueRef.current);
          return;
        }
        serverHasStateRef.current = true;
        Y.applyUpdate(ydoc, update, 'remote');
        const mergedHtml = ydoc.getText('content').toString();
        onChangeRef.current(mergedHtml);
      } finally {
        isApplyingRemoteRef.current = false;
      }
    });

    return unsubscribe;
  }, [collab, id, onChangeRef]);

  const broadcastChange = (newValue: string) => {
    if (!collab) return;
    if (isApplyingRemoteRef.current) return;
    const ydoc = ydocRef.current;
    if (!ydoc) return;
    seedYDoc(ydoc, initialValueRef.current);
    const ytext = ydoc.getText('content');
    const oldStr = ytext.toString();
    if (oldStr === newValue) return;

    if (!serverHasStateRef.current) {
      applyTextDiff(ytext, oldStr, newValue);
      serverHasStateRef.current = true;
      collab.sendYjsUpdate(id, Array.from(Y.encodeStateAsUpdate(ydoc)));
      return;
    }

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
