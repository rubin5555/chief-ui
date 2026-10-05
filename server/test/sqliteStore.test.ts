import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createSqliteStore } from '../src/store/sqliteStore.js';

test('SqliteCollabStore persists fields, snapshots, and audit log', () => {
  const store = createSqliteStore(':memory:');

  try {
    // 1. Initial get is undefined
    assert.equal(store.getField('sec-1'), undefined);

    // 2. Upsert field
    store.upsertField({
      id: 'sec-1',
      documentId: 'doc-100',
      parentFieldId: null,
      kind: 'section',
      title: 'Introduction',
      content: '<p>Initial text</p>',
      permissions: { approvers: ['alice'], editors: ['alice', 'bob'] },
      createdAt: 1000,
      updatedAt: 1000,
    });

    const field = store.getField('sec-1');
    assert.ok(field);
    assert.equal(field.title, 'Introduction');
    assert.equal(field.content, '<p>Initial text</p>');
    assert.deepEqual(field.permissions.editors, ['alice', 'bob']);

    // 3. Update field content
    store.updateFieldContent('sec-1', '<p>Updated text</p>', 2000);
    const updated = store.getField('sec-1');
    assert.equal(updated?.content, '<p>Updated text</p>');
    assert.equal(updated?.updatedAt, 2000);

    // 4. Version snapshots
    store.addVersionSnapshot({
      id: 'snap-1',
      fieldId: 'sec-1',
      content: '<p>Initial text</p>',
      createdBy: 'alice',
      createdAt: 1500,
      label: 'Draft 1',
    });
    store.addVersionSnapshot({
      id: 'snap-2',
      fieldId: 'sec-1',
      content: '<p>Updated text</p>',
      createdBy: 'bob',
      createdAt: 2500,
      label: null,
    });

    const snapshots = store.listVersionSnapshots('sec-1');
    assert.equal(snapshots.length, 2);
    assert.equal(snapshots[0].id, 'snap-1');
    assert.equal(snapshots[0].createdBy, 'alice');
    assert.equal(snapshots[1].id, 'snap-2');

    // 5. Audit log
    store.addAuditEntry({
      id: 'audit-1',
      fieldId: 'sec-1',
      actorId: 'alice',
      action: 'edit',
      occurredAt: 1200,
      diffRef: 'snap-1',
      metadata: { charsChanged: 25 },
    });

    const audit = store.listAuditEntries('sec-1');
    assert.equal(audit.length, 1);
    assert.equal(audit[0].actorId, 'alice');
    assert.equal(audit[0].action, 'edit');
    assert.deepEqual(audit[0].metadata, { charsChanged: 25 });
  } finally {
    store.close();
  }
});
