import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { CollabClient } from '@/collab/CollabClient';
import { COLLAB_WS_URL } from '@/collab/collabConfig';
import type { CollabMessage, CursorPath, RemoteCursorInfo } from '@/collab/types';

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
  locklessMode: boolean;
  lockState: Map<string, LockInfo | null>;
  remoteCursors: Map<string, RemoteCursorInfo | null>;
  remoteContent: Map<string, RemoteContentUpdate>;
  joinField: (fieldId: string) => void;
  leaveField: (fieldId: string) => void;
  acquireLock: (fieldId: string) => Promise<boolean>;
  releaseLock: (fieldId: string) => void;
  sendHeartbeat: (fieldId: string) => void;
  sendContent: (fieldId: string, html: string) => void;
  sendCursor: (fieldId: string, path: CursorPath) => void;
  sendYjsUpdate: (fieldId: string, update: number[]) => void;
  sendYjsSync: (fieldId: string) => void;
  registerYjsListener: (fieldId: string, listener: (update: Uint8Array) => void) => () => void;
}

const CollabContext = createContext<CollabContextValue | null>(null);

const ACQUIRE_TIMEOUT_MS = 5000;

const EMPTY_LOCK_STATE = new Map<string, LockInfo | null>();
const EMPTY_CURSORS = new Map<string, RemoteCursorInfo | null>();
const EMPTY_CONTENT = new Map<string, RemoteContentUpdate>();

export interface CollabEventLogItem {
  id: string;
  direction: 'in' | 'out';
  userId: string;
  timestamp: number;
  message: CollabMessage;
}

export interface CollabProviderProps {
  userId: string;
  locklessMode?: boolean;
  onCollabEvent?: (event: CollabEventLogItem) => void;
  children: ReactNode;
}

export const CollabProvider = ({
  userId,
  locklessMode = false,
  onCollabEvent,
  children,
}: CollabProviderProps) => {
  const clientRef = useRef<CollabClient | null>(null);
  const onCollabEventRef = useRef(onCollabEvent);
  onCollabEventRef.current = onCollabEvent;

  const pendingAcquiresRef = useRef(new Map<string, (granted: boolean) => void>());
  const yjsListenersRef = useRef(new Map<string, Set<(update: Uint8Array) => void>>());
  const [connected, setConnected] = useState(false);
  const [lockState, setLockState] = useState<Map<string, LockInfo | null>>(EMPTY_LOCK_STATE);
  const [remoteCursors, setRemoteCursors] =
    useState<Map<string, RemoteCursorInfo | null>>(EMPTY_CURSORS);
  const [remoteContent, setRemoteContent] =
    useState<Map<string, RemoteContentUpdate>>(EMPTY_CONTENT);

  const emitEvent = useCallback(
    (direction: 'in' | 'out', message: CollabMessage) => {
      onCollabEventRef.current?.({
        id: `${direction}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        direction,
        userId,
        timestamp: Date.now(),
        message,
      });
    },
    [userId],
  );

  const joinedFieldsRef = useRef(new Set<string>());

  const send = useCallback(
    (message: CollabMessage) => {
      emitEvent('out', message);
      clientRef.current?.send(message);
    },
    [emitEvent],
  );

  useEffect(() => {
    const client = new CollabClient({
      url: COLLAB_WS_URL,
      token: userId,
      onOpen: () => {
        setConnected(true);
        for (const fieldId of joinedFieldsRef.current) {
          send({ type: 'join', fieldId });
        }
      },
      onClose: () => setConnected(false),
    });
    clientRef.current = client;

    for (const fieldId of joinedFieldsRef.current) {
      send({ type: 'join', fieldId });
    }

    const settleAcquire = (fieldId: string, granted: boolean) => {
      const resolve = pendingAcquiresRef.current.get(fieldId);
      if (!resolve) return;
      pendingAcquiresRef.current.delete(fieldId);
      resolve(granted);
    };

    const unsubscribe = client.onMessage((message: CollabMessage) => {
      emitEvent('in', message);
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
          if (message.userId && message.userId === userId) return;
          setRemoteCursors((prev) =>
            new Map(prev).set(message.fieldId, {
              path: message.path,
              userId: message.userId ?? 'Remote User',
            }),
          );
          return;
        case 'yjs:update': {
          const listeners = yjsListenersRef.current.get(message.fieldId);
          if (listeners) {
            const bytes =
              message.update instanceof Uint8Array
                ? message.update
                : new Uint8Array(message.update);
            for (const fn of listeners) fn(bytes);
          }
          return;
        }
        default:
          return;
      }
    });

    return () => {
      unsubscribe();
      client.close();
      clientRef.current = null;
    };
  }, [userId, emitEvent, send]);

  const joinField = useCallback(
    (fieldId: string) => {
      joinedFieldsRef.current.add(fieldId);
      send({ type: 'join', fieldId });
    },
    [send],
  );

  const leaveField = useCallback(
    (fieldId: string) => {
      joinedFieldsRef.current.delete(fieldId);
      send({ type: 'leave', fieldId });
    },
    [send],
  );

  const acquireLock = (fieldId: string): Promise<boolean> => {
    if (locklessMode) return Promise.resolve(true);
    return new Promise((resolve) => {
      const settle = (granted: boolean) => {
        pendingAcquiresRef.current.delete(fieldId);
        resolve(granted);
      };
      pendingAcquiresRef.current.set(fieldId, settle);
      send({ type: 'lock:acquire', fieldId });
      setTimeout(() => {
        if (pendingAcquiresRef.current.get(fieldId) === settle) settle(false);
      }, ACQUIRE_TIMEOUT_MS);
    });
  };

  const releaseLock = (fieldId: string) => {
    if (locklessMode) return;
    send({ type: 'lock:release', fieldId });
  };

  const sendHeartbeat = (fieldId: string) => send({ type: 'lock:heartbeat', fieldId });

  const sendContent = (fieldId: string, html: string) => send({ type: 'content', fieldId, html });

  const sendCursor = (fieldId: string, path: CursorPath) =>
    send({ type: 'cursor', fieldId, path, userId });

  const sendYjsUpdate = useCallback(
    (fieldId: string, update: number[]) => {
      send({ type: 'yjs:update', fieldId, update });
    },
    [send],
  );

  const sendYjsSync = useCallback(
    (fieldId: string) => {
      send({ type: 'yjs:sync', fieldId });
    },
    [send],
  );

  const registerYjsListener = useCallback(
    (fieldId: string, listener: (update: Uint8Array) => void) => {
      let set = yjsListenersRef.current.get(fieldId);
      if (!set) {
        set = new Set();
        yjsListenersRef.current.set(fieldId, set);
      }
      set.add(listener);
      return () => {
        set?.delete(listener);
        if (set?.size === 0) yjsListenersRef.current.delete(fieldId);
      };
    },
    [],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional memo deps
  const value = useMemo<CollabContextValue>(
    () => ({
      userId,
      connected,
      locklessMode,
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
      sendYjsUpdate,
      sendYjsSync,
      registerYjsListener,
    }),
    [
      userId,
      connected,
      locklessMode,
      lockState,
      remoteCursors,
      remoteContent,
      joinField,
      leaveField,
      sendYjsUpdate,
      sendYjsSync,
      registerYjsListener,
    ],
  );

  return <CollabContext.Provider value={value}>{children}</CollabContext.Provider>;
};

export const useCollabContext = () => useContext(CollabContext);
