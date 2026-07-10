// Pure lock-state logic — no WebSocket, no DB, no timers of its own. RoomManager
// wires this to actual clients/broadcasts; keeping it separate is what makes
// the timeout/holder-check logic (the riskiest part of section-level locking)
// unit-testable with an injected clock instead of real sleeps.

export interface LockManagerOptions {
  /** Auto-release a lock if no heartbeat arrives within this window. Default 30s. */
  heartbeatTimeoutMs?: number;
  /** Injectable clock for tests; defaults to Date.now. */
  now?: () => number;
}

interface LockRecord {
  holderId: string;
  acquiredAt: number;
  lastHeartbeatAt: number;
}

export type LockResult = { granted: true } | { granted: false; holderId: string };

const DEFAULT_HEARTBEAT_TIMEOUT_MS = 30_000;

export class LockManager {
  private readonly locks = new Map<string, LockRecord>();
  private readonly heartbeatTimeoutMs: number;
  private readonly now: () => number;

  constructor(options: LockManagerOptions = {}) {
    this.heartbeatTimeoutMs = options.heartbeatTimeoutMs ?? DEFAULT_HEARTBEAT_TIMEOUT_MS;
    this.now = options.now ?? Date.now;
  }

  /** Grants if the field is free or already held by this same holder (idempotent re-acquire). */
  acquire(fieldId: string, holderId: string): LockResult {
    this.expireIfStale(fieldId);
    const existing = this.locks.get(fieldId);
    if (existing && existing.holderId !== holderId) {
      return { granted: false, holderId: existing.holderId };
    }
    const timestamp = this.now();
    this.locks.set(fieldId, {
      holderId,
      acquiredAt: existing?.acquiredAt ?? timestamp,
      lastHeartbeatAt: timestamp,
    });
    return { granted: true };
  }

  /** Returns false (no-op) if the field wasn't locked by this holder. */
  release(fieldId: string, holderId: string): boolean {
    const existing = this.locks.get(fieldId);
    if (!existing || existing.holderId !== holderId) return false;
    this.locks.delete(fieldId);
    return true;
  }

  /** Returns false if the field isn't currently locked by this holder (e.g. it already expired). */
  heartbeat(fieldId: string, holderId: string): boolean {
    const existing = this.locks.get(fieldId);
    if (!existing || existing.holderId !== holderId) return false;
    existing.lastHeartbeatAt = this.now();
    return true;
  }

  /** Called on disconnect — frees every lock the client held. Returns the freed field ids. */
  releaseAllHeldBy(holderId: string): string[] {
    const released: string[] = [];
    for (const [fieldId, record] of this.locks) {
      if (record.holderId === holderId) {
        this.locks.delete(fieldId);
        released.push(fieldId);
      }
    }
    return released;
  }

  getHolder(fieldId: string): string | null {
    this.expireIfStale(fieldId);
    return this.locks.get(fieldId)?.holderId ?? null;
  }

  /** Periodic sweep for locks whose holder stopped heartbeating (crashed tab, dropped network). */
  sweepExpired(): Array<{ fieldId: string; holderId: string }> {
    const expired: Array<{ fieldId: string; holderId: string }> = [];
    for (const [fieldId, record] of this.locks) {
      if (this.now() - record.lastHeartbeatAt > this.heartbeatTimeoutMs) {
        expired.push({ fieldId, holderId: record.holderId });
        this.locks.delete(fieldId);
      }
    }
    return expired;
  }

  private expireIfStale(fieldId: string): boolean {
    const record = this.locks.get(fieldId);
    if (!record) return false;
    if (this.now() - record.lastHeartbeatAt > this.heartbeatTimeoutMs) {
      this.locks.delete(fieldId);
      return true;
    }
    return false;
  }
}
