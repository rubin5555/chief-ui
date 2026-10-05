import { DatabaseSync } from 'node:sqlite';
import type { AuditAction, FieldKind, NodePermissions } from '../types.js';
import type { AuditEntry, CollabStore, FieldRecord, VersionSnapshot } from './memoryStore.js';

interface FieldRow {
  id: string;
  document_id: string;
  parent_field_id: string | null;
  kind: FieldKind;
  title: string;
  content: string;
  permissions: string;
  created_at: number;
  updated_at: number;
}

interface SnapshotRow {
  id: string;
  field_id: string;
  content: string;
  created_by: string;
  created_at: number;
  label: string | null;
}

interface AuditRow {
  id: string;
  field_id: string;
  actor_id: string;
  action: AuditAction;
  occurred_at: number;
  diff_ref: string | null;
  metadata: string | null;
}

export const createSqliteStore = (dbPath = ':memory:'): CollabStore & { close: () => void; db: DatabaseSync } => {
  const db = new DatabaseSync(dbPath);

  // Initialize schema matching PostgreSQL production design
  db.exec(`
    CREATE TABLE IF NOT EXISTS document_fields (
      id TEXT PRIMARY KEY,
      document_id TEXT NOT NULL,
      parent_field_id TEXT,
      kind TEXT NOT NULL DEFAULT 'section',
      title TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      permissions TEXT NOT NULL DEFAULT '{"approvers":[],"editors":[]}',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS version_snapshots (
      id TEXT PRIMARY KEY,
      field_id TEXT NOT NULL,
      content TEXT NOT NULL,
      created_by TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      label TEXT
    );

    CREATE TABLE IF NOT EXISTS collab_audit_log (
      id TEXT PRIMARY KEY,
      field_id TEXT NOT NULL,
      actor_id TEXT NOT NULL,
      action TEXT NOT NULL,
      occurred_at INTEGER NOT NULL,
      diff_ref TEXT,
      metadata TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_snapshots_field ON version_snapshots(field_id, created_at ASC);
    CREATE INDEX IF NOT EXISTS idx_audit_field ON collab_audit_log(field_id, occurred_at ASC);
  `);

  const getFieldStmt = db.prepare('SELECT * FROM document_fields WHERE id = ?');
  const upsertFieldStmt = db.prepare(`
    INSERT INTO document_fields (id, document_id, parent_field_id, kind, title, content, permissions, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      document_id = excluded.document_id,
      parent_field_id = excluded.parent_field_id,
      kind = excluded.kind,
      title = excluded.title,
      content = excluded.content,
      permissions = excluded.permissions,
      updated_at = excluded.updated_at
  `);
  const updateContentStmt = db.prepare('UPDATE document_fields SET content = ?, updated_at = ? WHERE id = ?');

  const insertSnapshotStmt = db.prepare(`
    INSERT INTO version_snapshots (id, field_id, content, created_by, created_at, label)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      content = excluded.content,
      created_by = excluded.created_by,
      created_at = excluded.created_at,
      label = excluded.label
  `);
  const listSnapshotsStmt = db.prepare('SELECT * FROM version_snapshots WHERE field_id = ? ORDER BY created_at ASC');

  const insertAuditStmt = db.prepare(`
    INSERT INTO collab_audit_log (id, field_id, actor_id, action, occurred_at, diff_ref, metadata)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      field_id = excluded.field_id,
      actor_id = excluded.actor_id,
      action = excluded.action,
      occurred_at = excluded.occurred_at,
      diff_ref = excluded.diff_ref,
      metadata = excluded.metadata
  `);
  const listAuditStmt = db.prepare('SELECT * FROM collab_audit_log WHERE field_id = ? ORDER BY occurred_at ASC');


  const getField = (fieldId: string): FieldRecord | undefined => {
    const row = getFieldStmt.get(fieldId) as unknown as FieldRow | undefined;
    if (!row) return undefined;
    let permissions: NodePermissions = { approvers: [], editors: [] };
    try {
      permissions = JSON.parse(row.permissions);
    } catch {
      // fallback
    }
    return {
      id: row.id,
      documentId: row.document_id,
      parentFieldId: row.parent_field_id,
      kind: row.kind,
      title: row.title,
      content: row.content,
      permissions,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  };

  const upsertField = (field: FieldRecord): void => {
    upsertFieldStmt.run(
      field.id,
      field.documentId,
      field.parentFieldId,
      field.kind,
      field.title,
      field.content,
      JSON.stringify(field.permissions),
      field.createdAt,
      field.updatedAt,
    );
  };

  const updateFieldContent = (fieldId: string, content: string, updatedAt: number): void => {
    const existing = getField(fieldId);
    if (existing) {
      updateContentStmt.run(content, updatedAt, fieldId);
      return;
    }
    upsertField({
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
  };

  const addVersionSnapshot = (snapshot: VersionSnapshot): void => {
    insertSnapshotStmt.run(
      snapshot.id,
      snapshot.fieldId,
      snapshot.content,
      snapshot.createdBy,
      snapshot.createdAt,
      snapshot.label,
    );
  };

  const listVersionSnapshots = (fieldId: string): VersionSnapshot[] => {
    const rows = listSnapshotsStmt.all(fieldId) as unknown as SnapshotRow[];
    return rows.map((r) => ({
      id: r.id,
      fieldId: r.field_id,
      content: r.content,
      createdBy: r.created_by,
      createdAt: r.created_at,
      label: r.label,
    }));
  };

  const addAuditEntry = (entry: AuditEntry): void => {
    insertAuditStmt.run(
      entry.id,
      entry.fieldId,
      entry.actorId,
      entry.action,
      entry.occurredAt,
      entry.diffRef,
      entry.metadata ? JSON.stringify(entry.metadata) : null,
    );
  };

  const listAuditEntries = (fieldId: string): AuditEntry[] => {
    const rows = listAuditStmt.all(fieldId) as unknown as AuditRow[];
    return rows.map((r) => {
      let metadata: Record<string, unknown> | null = null;
      if (r.metadata) {
        try {
          metadata = JSON.parse(r.metadata);
        } catch {
          // ignore
        }
      }
      return {
        id: r.id,
        fieldId: r.field_id,
        actorId: r.actor_id,
        action: r.action,
        occurredAt: r.occurred_at,
        diffRef: r.diff_ref,
        metadata,
      };
    });
  };

  return {
    getField,
    upsertField,
    updateFieldContent,
    addVersionSnapshot,
    listVersionSnapshots,
    addAuditEntry,
    listAuditEntries,
    close: () => db.close(),
    db,
  };
};
