import type { AuditAction, FieldKind, NodePermissions } from '../types.js';

export interface FieldRecord {
  id: string;
  documentId: string;
  parentFieldId: string | null;
  kind: FieldKind;
  title: string;
  content: string;
  permissions: NodePermissions;
  createdAt: number;
  updatedAt: number;
}

export interface VersionSnapshot {
  id: string;
  fieldId: string;
  content: string;
  createdBy: string;
  createdAt: number;
  label: string | null;
}

export interface AuditEntry {
  id: string;
  fieldId: string;
  actorId: string;
  action: AuditAction;
  occurredAt: number;
  diffRef: string | null;
  metadata: Record<string, unknown> | null;
}

// In-memory stand-in for the plan's Postgres tables (§5) — same shape as the
// eventual `document`/`field`/`version_snapshot`/`audit_log` tables, so a real
// DB-backed implementation of this same interface can replace it later without
// touching RoomManager or anything else that calls it.
export interface CollabStore {
  getField(fieldId: string): FieldRecord | undefined;
  upsertField(field: FieldRecord): void;
  updateFieldContent(fieldId: string, content: string, updatedAt: number): void;
  addVersionSnapshot(snapshot: VersionSnapshot): void;
  listVersionSnapshots(fieldId: string): VersionSnapshot[];
  addAuditEntry(entry: AuditEntry): void;
  listAuditEntries(fieldId: string): AuditEntry[];
}

export const createMemoryStore = (): CollabStore => {
  const fields = new Map<string, FieldRecord>();
  const snapshots = new Map<string, VersionSnapshot[]>();
  const audit = new Map<string, AuditEntry[]>();

  return {
    getField: (fieldId) => fields.get(fieldId),
    upsertField: (field) => {
      fields.set(field.id, field);
    },
    updateFieldContent: (fieldId, content, updatedAt) => {
      const existing = fields.get(fieldId);
      if (existing) {
        fields.set(fieldId, { ...existing, content, updatedAt });
        return;
      }
      // A real backend requires the field to exist first (created via the
      // plan's GraphQL CRUD layer, §2 — not built yet in this repo). Until
      // that layer exists, auto-create a minimal record so RoomManager's
      // content flow — and version snapshots off the back of it — works
      // without an external "create field" step. Metadata beyond content is
      // deliberately blank; a real implementation would reject this instead.
      fields.set(fieldId, {
        id: fieldId,
        documentId: '',
        parentFieldId: null,
        kind: 'section',
        title: '',
        content,
        permissions: { approvers: [], editors: [] },
        createdAt: updatedAt,
        updatedAt,
      });
    },
    addVersionSnapshot: (snapshot) => {
      const list = snapshots.get(snapshot.fieldId) ?? [];
      list.push(snapshot);
      snapshots.set(snapshot.fieldId, list);
    },
    listVersionSnapshots: (fieldId) => snapshots.get(fieldId) ?? [],
    addAuditEntry: (entry) => {
      const list = audit.get(entry.fieldId) ?? [];
      list.push(entry);
      audit.set(entry.fieldId, list);
    },
    listAuditEntries: (fieldId) => audit.get(fieldId) ?? [],
  };
};

// One shared instance for the process — the "database" for this in-memory pass.
export const store = createMemoryStore();
