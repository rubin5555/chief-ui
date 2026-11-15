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

export interface CollabContextValue {
  userId: string;
  userName?: string;
  connected: boolean;
  remoteCursors: Map<string, RemoteCursorInfo | null>;
  joinField: (fieldId: string) => void;
  leaveField: (fieldId: string) => void;
  sendCursor: (fieldId: string, path: CursorPath) => void;
  sendYjsUpdate: (fieldId: string, update: number[]) => void;
  sendYjsSync: (fieldId: string) => void;
  registerYjsListener: (fieldId: string, listener: (update: Uint8Array) => void) => () => void;
}

const CollabContext = createContext<CollabContextValue | null>(null);

const EMPTY_CURSORS = new Map<string, RemoteCursorInfo | null>();

export interface CollabEventLogItem {
  id: string;
  direction: 'in' | 'out';
  userId: string;
  timestamp: number;
  message: CollabMessage;
}

export interface CollabProviderProps {
  userId: string;
  userName?: string;
  onCollabEvent?: (event: CollabEventLogItem) => void;
  children: ReactNode;
}

export const CollabProvider = ({
  userId,
  userName,
  onCollabEvent,
  children,
}: CollabProviderProps) => {
  const clientRef = useRef<CollabClient | null>(null);
  const onCollabEventRef = useRef(onCollabEvent);
  onCollabEventRef.current = onCollabEvent;

  const yjsListenersRef = useRef(new Map<string, Set<(update: Uint8Array) => void>>());
  const [connected, setConnected] = useState(false);
  const [remoteCursors, setRemoteCursors] =
    useState<Map<string, RemoteCursorInfo | null>>(EMPTY_CURSORS);

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
          send({ type: 'yjs:sync', fieldId });
        }
      },
      onClose: () => setConnected(false),
    });
    clientRef.current = client;

    const unsubscribe = client.onMessage((message: CollabMessage) => {
      emitEvent('in', message);
      switch (message.type) {
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

  const sendCursor = (fieldId: string, path: CursorPath) =>
    send({ type: 'cursor', fieldId, path, userId: userName || userId });

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
      userName,
      connected,
      remoteCursors,
      joinField,
      leaveField,
      sendCursor,
      sendYjsUpdate,
      sendYjsSync,
      registerYjsListener,
    }),
    [
      userId,
      userName,
      connected,
      remoteCursors,
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
