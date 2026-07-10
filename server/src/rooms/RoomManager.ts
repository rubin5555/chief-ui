import { writeAuditLog } from '../audit.js';
import { store } from '../store/memoryStore.js';
import type { CollabMessage } from '../types.js';
import { LockManager } from './LockManager.js';
import { type RoomSocket, SOCKET_OPEN } from './RoomSocket.js';

const DEFAULT_CONTENT_DEBOUNCE_MS = 500;

export interface RoomManagerOptions {
  contentDebounceMs?: number;
  lockManager?: LockManager;
}

interface ClientInfo {
  userId: string;
  fields: Set<string>;
}

interface PendingContent {
  html: string;
  senderUserId: string;
}

// Wires sockets to per-field state. One RoomManager per process; "room" = one
// Section/SubSection/Appendix id (plan §3), never a whole document. Depends
// only on RoomSocket's minimal interface, not any real transport, so it's
// unit-testable with plain fake sockets.
export class RoomManager {
  private readonly clients = new Map<RoomSocket, ClientInfo>();
  private readonly fieldMembers = new Map<string, Set<RoomSocket>>();
  private readonly lockManager: LockManager;
  private readonly contentDebounceMs: number;
  private readonly pendingContent = new Map<string, PendingContent>();
  private readonly pendingContentTimers = new Map<string, NodeJS.Timeout>();
  private sweepInterval: NodeJS.Timeout | null = null;

  constructor(options: RoomManagerOptions = {}) {
    this.lockManager = options.lockManager ?? new LockManager();
    this.contentDebounceMs = options.contentDebounceMs ?? DEFAULT_CONTENT_DEBOUNCE_MS;
  }

  registerClient(socket: RoomSocket, userId: string): void {
    this.clients.set(socket, { userId, fields: new Set() });
  }

  removeClient(socket: RoomSocket): void {
    const client = this.clients.get(socket);
    if (!client) return;

    for (const fieldId of [...client.fields]) {
      this.leaveField(socket, fieldId);
    }

    // A dropped connection releases every lock it held, same as an explicit
    // release — otherwise a crashed tab would leave a field locked forever
    // until the heartbeat-timeout sweep catches up to it.
    const releasedFields = this.lockManager.releaseAllHeldBy(client.userId);
    for (const fieldId of releasedFields) {
      this.broadcastToField(fieldId, { type: 'lock:released', fieldId, holderId: client.userId }, null);
    }

    this.clients.delete(socket);
  }

  handleMessage(socket: RoomSocket, message: CollabMessage): void {
    const client = this.clients.get(socket);
    if (!client) return;

    switch (message.type) {
      case 'join':
        this.joinField(socket, client, message.fieldId);
        return;
      case 'leave':
        this.leaveField(socket, message.fieldId);
        return;
      case 'lock:acquire':
        this.handleAcquire(socket, client, message.fieldId);
        return;
      case 'lock:release':
        this.handleRelease(client, message.fieldId);
        return;
      case 'lock:heartbeat':
        this.lockManager.heartbeat(message.fieldId, client.userId);
        return;
      case 'content':
        this.handleContent(socket, client, message.fieldId, message.html);
        return;
      case 'cursor':
        // Cursor broadcasts don't touch lock/content state — just relay to
        // everyone else currently in the room.
        this.broadcastToField(message.fieldId, message, socket);
        return;
      default:
        // yjs:update / yjs:sync are reserved for the future CRDT swap (plan §4)
        // and unused by the locking implementation.
        return;
    }
  }

  private joinField(socket: RoomSocket, client: ClientInfo, fieldId: string): void {
    client.fields.add(fieldId);
    let members = this.fieldMembers.get(fieldId);
    if (!members) {
      members = new Set();
      this.fieldMembers.set(fieldId, members);
    }
    members.add(socket);

    // Bring the joining client up to date on the field's current lock, if any.
    const holderId = this.lockManager.getHolder(fieldId);
    if (holderId) {
      this.send(socket, { type: 'lock:granted', fieldId, holderId });
    }
  }

  private leaveField(socket: RoomSocket, fieldId: string): void {
    const client = this.clients.get(socket);
    client?.fields.delete(fieldId);
    this.fieldMembers.get(fieldId)?.delete(socket);
  }

  private handleAcquire(socket: RoomSocket, client: ClientInfo, fieldId: string): void {
    const result = this.lockManager.acquire(fieldId, client.userId);
    if (result.granted) {
      // Broadcast to the whole room (including the requester) so everyone's
      // "X is editing" badge updates from one code path.
      this.broadcastToField(fieldId, { type: 'lock:granted', fieldId, holderId: client.userId }, null);
      writeAuditLog({ fieldId, actorId: client.userId, action: 'lock_acquire' });
    } else {
      this.send(socket, { type: 'lock:denied', fieldId, holderId: result.holderId });
    }
  }

  private handleRelease(client: ClientInfo, fieldId: string): void {
    const released = this.lockManager.release(fieldId, client.userId);
    if (!released) return;
    this.broadcastToField(fieldId, { type: 'lock:released', fieldId, holderId: client.userId }, null);
    writeAuditLog({ fieldId, actorId: client.userId, action: 'lock_release' });
  }

  private handleContent(socket: RoomSocket, client: ClientInfo, fieldId: string, html: string): void {
    // Only the lock holder's content is authoritative — silently drop pushes
    // from anyone else (e.g. a client that hasn't yet heard its lock was lost).
    if (this.lockManager.getHolder(fieldId) !== client.userId) return;

    this.pendingContent.set(fieldId, { html, senderUserId: client.userId });
    if (this.pendingContentTimers.has(fieldId)) return;

    const timer = setTimeout(() => {
      this.pendingContentTimers.delete(fieldId);
      const pending = this.pendingContent.get(fieldId);
      if (!pending) return;
      this.pendingContent.delete(fieldId);
      store.updateFieldContent(fieldId, pending.html, Date.now());
      this.broadcastToField(fieldId, { type: 'content', fieldId, html: pending.html }, socket);
    }, this.contentDebounceMs);
    this.pendingContentTimers.set(fieldId, timer);
  }

  private broadcastToField(fieldId: string, message: CollabMessage, exclude: RoomSocket | null): void {
    const members = this.fieldMembers.get(fieldId);
    if (!members) return;
    for (const member of members) {
      if (member === exclude) continue;
      this.send(member, message);
    }
  }

  private send(socket: RoomSocket, message: CollabMessage): void {
    if (socket.readyState !== SOCKET_OPEN) return;
    socket.send(JSON.stringify(message));
  }

  /** Periodically release locks whose holder stopped heartbeating (crashed tab, dropped network). */
  startExpirySweep(intervalMs = 5000): void {
    this.sweepInterval = setInterval(() => {
      const expired = this.lockManager.sweepExpired();
      for (const { fieldId, holderId } of expired) {
        this.broadcastToField(fieldId, { type: 'lock:released', fieldId, holderId }, null);
      }
    }, intervalMs);
  }

  stopExpirySweep(): void {
    if (this.sweepInterval) clearInterval(this.sweepInterval);
    this.sweepInterval = null;
  }
}
