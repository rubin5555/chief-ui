import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { CollabClient } from '@/collab/CollabClient';
import { COLLAB_WS_URL } from '@/collab/collabConfig';
import type { CollabMessage, CursorPath } from '@/collab/types';

export interface LockInfo {
  holderId: string;
}

interface RemoteContentUpdate {
  html: string;
  receivedAt: number;
}

export interface CollabContextValue {
  userId: string;
  connected: boolean;
  // All three keyed by field id (Section/SubSection/Appendix id, plan §3) —
  // never by the field's local editor-instance id.
  lockState: Map<string, LockInfo | null>;
  remoteCursors: Map<string, CursorPath | null>;
  remoteContent: Map<string, RemoteContentUpdate>;
  joinField: (fieldId: string) => void;
  leaveField: (fieldId: string) => void;
  acquireLock: (fieldId: string) => Promise<boolean>;
  releaseLock: (fieldId: string) => void;
  sendHeartbeat: (fieldId: string) => void;
  sendContent: (fieldId: string, html: string) => void;
  sendCursor: (fieldId: string, path: CursorPath) => void;
}

const CollabContext = createContext<CollabContextValue | null>(null);

// A lock request that never hears back (dropped connection, server hiccup)
// resolves false rather than hanging the caller's optimistic-activation UI
// forever.
const ACQUIRE_TIMEOUT_MS = 5000;

const EMPTY_LOCK_STATE = new Map<string, LockInfo | null>();
const EMPTY_CURSORS = new Map<string, CursorPath | null>();
const EMPTY_CONTENT = new Map<string, RemoteContentUpdate>();

interface CollabProviderProps {
  userId: string;
  children: ReactNode;
}

export const CollabProvider = ({ userId, children }: CollabProviderProps) => {
  const clientRef = useRef<CollabClient | null>(null);
  const pendingAcquiresRef = useRef(new Map<string, (granted: boolean) => void>());
  const [connected, setConnected] = useState(false);
  const [lockState, setLockState] = useState<Map<string, LockInfo | null>>(EMPTY_LOCK_STATE);
  const [remoteCursors, setRemoteCursors] = useState<Map<string, CursorPath | null>>(EMPTY_CURSORS);
  const [remoteContent, setRemoteContent] =
    useState<Map<string, RemoteContentUpdate>>(EMPTY_CONTENT);

  useEffect(() => {
    const client = new CollabClient({
      url: COLLAB_WS_URL,
      token: userId,
      onOpen: () => setConnected(true),
      onClose: () => setConnected(false),
    });
    clientRef.current = client;

    const settleAcquire = (fieldId: string, granted: boolean) => {
      const resolve = pendingAcquiresRef.current.get(fieldId);
      if (!resolve) return;
      pendingAcquiresRef.current.delete(fieldId);
      resolve(granted);
    };

    const unsubscribe = client.onMessage((message: CollabMessage) => {
      switch (message.type) {
        case 'lock:granted':
          setLockState((prev) =>
            new Map(prev).set(message.fieldId, { holderId: message.holderId }),
          );
          settleAcquire(message.fieldId, message.holderId === userId);
          return;
        case 'lock:denied':
          settleAcquire(message.fieldId, false);
          return;
        case 'lock:released':
          setLockState((prev) => new Map(prev).set(message.fieldId, null));
          setRemoteCursors((prev) => new Map(prev).set(message.fieldId, null));
          return;
        case 'content':
          setRemoteContent((prev) =>
            new Map(prev).set(message.fieldId, { html: message.html, receivedAt: Date.now() }),
          );
          return;
        case 'cursor':
          setRemoteCursors((prev) => new Map(prev).set(message.fieldId, message.path));
          return;
        default:
          // yjs:update / yjs:sync are reserved for the future CRDT swap (plan
          // §4) and unused by the locking implementation.
          return;
      }
    });

    return () => {
      unsubscribe();
      client.close();
      clientRef.current = null;
    };
  }, [userId]);

  const joinField = (fieldId: string) => clientRef.current?.send({ type: 'join', fieldId });
  const leaveField = (fieldId: string) => clientRef.current?.send({ type: 'leave', fieldId });

  const acquireLock = (fieldId: string): Promise<boolean> =>
    new Promise((resolve) => {
      const settle = (granted: boolean) => {
        pendingAcquiresRef.current.delete(fieldId);
        resolve(granted);
      };
      pendingAcquiresRef.current.set(fieldId, settle);
      clientRef.current?.send({ type: 'lock:acquire', fieldId });
      setTimeout(() => {
        if (pendingAcquiresRef.current.get(fieldId) === settle) settle(false);
      }, ACQUIRE_TIMEOUT_MS);
    });

  // Not optimistically cleared locally — the server broadcasts lock:released
  // back to the releaser too (it doesn't exclude the sender), so the message
  // handler above is the single source of truth for when this actually takes
  // effect.
  const releaseLock = (fieldId: string) =>
    clientRef.current?.send({ type: 'lock:release', fieldId });

  const sendHeartbeat = (fieldId: string) =>
    clientRef.current?.send({ type: 'lock:heartbeat', fieldId });

  const sendContent = (fieldId: string, html: string) =>
    clientRef.current?.send({ type: 'content', fieldId, html });

  const sendCursor = (fieldId: string, path: CursorPath) =>
    clientRef.current?.send({ type: 'cursor', fieldId, path });

  // The send/join/etc. functions close over clientRef (a ref, stable identity) rather than
  // any state, so they don't need to be listed as dependencies themselves.
  // biome-ignore lint/correctness/useExhaustiveDependencies: see comment above
  const value = useMemo<CollabContextValue>(
    () => ({
      userId,
      connected,
      lockState,
      remoteCursors,
      remoteContent,
      joinField,
      leaveField,
      acquireLock,
      releaseLock,
      sendHeartbeat,
      sendContent,
      sendCursor,
    }),
    [userId, connected, lockState, remoteCursors, remoteContent],
  );

  return <CollabContext.Provider value={value}>{children}</CollabContext.Provider>;
};

export const useCollabContext = () => useContext(CollabContext);
