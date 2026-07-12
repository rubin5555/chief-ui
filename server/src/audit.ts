import { store } from './store/memoryStore.js';
import type { AuditAction } from './types.js';

interface AuditEntryInput {
  fieldId: string;
  actorId: string;
  action: AuditAction;
  diffRef?: string;
  metadata?: Record<string, unknown>;
}

let nextAuditId = 1;

export const writeAuditLog = (entry: AuditEntryInput): void => {
  store.addAuditEntry({
    id: `audit-${nextAuditId++}`,
    fieldId: entry.fieldId,
    actorId: entry.actorId,
    action: entry.action,
    occurredAt: Date.now(),
    diffRef: entry.diffRef ?? null,
    metadata: entry.metadata ?? null,
  });
};
