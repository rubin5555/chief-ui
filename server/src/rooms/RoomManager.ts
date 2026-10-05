import * as Y from 'yjs';
import { writeAuditLog } from '../audit.js';
import { restoreVersionSnapshot, writeVersionSnapshot } from '../snapshot.js';
import type { AuditEntry, VersionSnapshot } from '../store/memoryStore.js';
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
  private readonly ydocs = new Map<string, Y.Doc>();
  // Content as of the moment a lock was granted — compared against current
  // content on release to decide whether an edit session actually changed
  // anything (and so whether it's worth a version snapshot at all).
  private readonly editBaselines = new Map<string, string>();
  private sweepInterval: NodeJS.Timeout | null = null;

  constructor(options: RoomManagerOptions = {}) {
    this.lockManager = options.lockManager ?? new LockManager();
    this.contentDebounceMs = options.contentDebounceMs ?? DEFAULT_CONTENT_DEBOUNCE_MS;
  }

  getYDoc(fieldId: string): Y.Doc {
    let doc = this.ydocs.get(fieldId);
    if (!doc) {
      doc = new Y.Doc();
      const existing = store.getField(fieldId);
      if (existing?.content) {
        doc.getText('content').insert(0, existing.content);
      }
      this.ydocs.set(fieldId, doc);
    }
    return doc;
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
      this.finalizeEditSession(fieldId, client.userId);
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
        // everyone else currently in the room with sender userId.
        this.broadcastToField(
          message.fieldId,
          { ...message, userId: message.userId ?? client.userId },
          socket,
        );
        return;
      case 'yjs:sync':
        this.handleYjsSync(socket, message.fieldId);
        return;
      case 'yjs:update':
        this.handleYjsUpdate(socket, client, message.fieldId, message.update);
        return;
      default:
        return;
    }
  }

  private handleYjsSync(socket: RoomSocket, fieldId: string): void {
    const doc = this.getYDoc(fieldId);
    const update = Y.encodeStateAsUpdate(doc);
    this.send(socket, {
      type: 'yjs:update',
      fieldId,
      update: Array.from(update),
    });
  }

  private handleYjsUpdate(
    socket: RoomSocket,
    _client: ClientInfo,
    fieldId: string,
    update: number[] | Uint8Array,
  ): void {
    const doc = this.getYDoc(fieldId);
    const bytes = update instanceof Uint8Array ? update : new Uint8Array(update);
    Y.applyUpdate(doc, bytes);

    // Broadcast CRDT delta to all other peers without requiring lock
    this.broadcastToField(
      fieldId,
      {
        type: 'yjs:update',
        fieldId,
        update: Array.from(bytes),
      },
      socket,
    );

    this.scheduleYjsAutosave(fieldId);
  }

  private scheduleYjsAutosave(fieldId: string): void {
    const existing = this.pendingContentTimers.get(fieldId);
    if (existing) clearTimeout(existing);

    const timer = setTimeout(() => {
      this.pendingContentTimers.delete(fieldId);
      const doc = this.ydocs.get(fieldId);
      if (!doc) return;
      const html = doc.getText('content').toString();
      const now = Date.now();
      store.updateFieldContent(fieldId, html, now);
      this.broadcastToField(
        fieldId,
        { type: 'db:autosave', fieldId, savedAt: now } as CollabMessage,
        null,
      );
    }, this.contentDebounceMs);

    this.pendingContentTimers.set(fieldId, timer);
  }


  private joinField(socket: RoomSocket, client: ClientInfo, fieldId: string): void {
    client.fields.add(fieldId);
    let members = this.fieldMembers.get(fieldId);
    if (!members) {
      members = new Set();
      this.fieldMembers.set(fieldId, members);
    }
    members.add(socket);

    // Bring the joining client up to date: current content (if the field has
    // any tracked yet) and the current lock holder (if any). Initial load of
    // a *never-edited* field is still the GraphQL layer's job (plan §6's
    // "prerequisite gap") — this only covers what changed after that load.
    const field = store.getField(fieldId);
    if (field) {
      this.send(socket, { type: 'content', fieldId, html: field.content });
    }
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
    if (!this.isAuthorizedToEdit(fieldId, client.userId)) {
      this.send(socket, { type: 'lock:denied', fieldId, holderId: '', reason: 'unauthorized' });
      return;
    }

    const result = this.lockManager.acquire(fieldId, client.userId);
    if (result.granted) {
      this.editBaselines.set(fieldId, store.getField(fieldId)?.content ?? '');
      // Broadcast to the whole room (including the requester) so everyone's
      // "X is editing" badge updates from one code path.
      this.broadcastToField(fieldId, { type: 'lock:granted', fieldId, holderId: client.userId }, null);
      writeAuditLog({ fieldId, actorId: client.userId, action: 'lock_acquire' });
    } else {
      this.send(socket, { type: 'lock:denied', fieldId, holderId: result.holderId, reason: 'held' });
    }
  }

  // Authorization source is the field's own permissions.editors (plan §3 —
  // already present in the data model, unenforced before this). A field with
  // no record yet, or an empty editors list, is treated as unrestricted: the
  // real document-creation flow (plan §2's GraphQL CRUD layer, not built in
  // this repo) is what would populate editors, so refusing everyone by
  // default here would make every field permanently uneditable in this mock.
  private isAuthorizedToEdit(fieldId: string, userId: string): boolean {
    const field = store.getField(fieldId);
    if (!field) return true;
    const { editors } = field.permissions;
    if (editors.length === 0) return true;
    return editors.includes(userId);
  }

  private handleRelease(client: ClientInfo, fieldId: string): void {
    const released = this.lockManager.release(fieldId, client.userId);
    if (!released) return;
    this.finalizeEditSession(fieldId, client.userId);
    this.broadcastToField(fieldId, { type: 'lock:released', fieldId, holderId: client.userId }, null);
    writeAuditLog({ fieldId, actorId: client.userId, action: 'lock_release' });
  }

  // Called on every path a lock can end (explicit release, disconnect, or
  // heartbeat-timeout expiry): if the field's content actually changed during
  // this holder's session, snapshot it and log an `edit` audit entry pointing
  // at that snapshot. A no-op session (lock taken and released with no edits)
  // produces neither — snapshots are per *session*, not per keystroke.
  private finalizeEditSession(fieldId: string, holderId: string): void {
    const baseline = this.editBaselines.get(fieldId);
    this.editBaselines.delete(fieldId);
    if (baseline === undefined) return;
    const current = store.getField(fieldId)?.content ?? '';
    if (current === baseline) return;
    const snapshotId = writeVersionSnapshot(fieldId, current, holderId);
    writeAuditLog({ fieldId, actorId: holderId, action: 'edit', diffRef: snapshotId });
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
        this.finalizeEditSession(fieldId, holderId);
        this.broadcastToField(fieldId, { type: 'lock:released', fieldId, holderId }, null);
      }
    }, intervalMs);
  }

  stopExpirySweep(): void {
    if (this.sweepInterval) clearInterval(this.sweepInterval);
    this.sweepInterval = null;
  }

  // Read-side pass-throughs — the natural backing for the plan's §2 GraphQL
  // version-history/audit-log queries, once that layer exists. Exposed here
  // now so the logic has one entry point rather than callers reaching into
  // the store directly.
  listVersions(fieldId: string): VersionSnapshot[] {
    return store.listVersionSnapshots(fieldId);
  }

  listAuditLog(fieldId: string): AuditEntry[] {
    return store.listAuditEntries(fieldId);
  }

  // Restore = a new snapshot copying old content forward, never a destructive
  // rewrite (plan §5). If the field currently has an active room, broadcast
  // the restored content live so anyone watching sees it without a refresh.
  // Returns the new snapshot's id, or null if snapshotId doesn't exist.
  restoreVersion(fieldId: string, snapshotId: string, actorId: string): string | null {
    const newSnapshotId = restoreVersionSnapshot(fieldId, snapshotId, actorId);
    if (!newSnapshotId) return null;
    writeAuditLog({ fieldId, actorId, action: 'restore', diffRef: newSnapshotId });
    const field = store.getField(fieldId);
    if (field) {
      this.broadcastToField(fieldId, { type: 'content', fieldId, html: field.content }, null);
    }
    return newSnapshotId;
  }
}
