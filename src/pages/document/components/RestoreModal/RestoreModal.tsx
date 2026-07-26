import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import type { Section } from '../../types';
import { CancelBtn, EmptyState, List, RestoreBtn, Row } from './RestoreModal.styles';
import { RESTORE_MODAL_IDS } from './RestoreModal.testids';

export interface DeletedSectionEntry {
  subjectId: string;
  section: Section;
}

export interface RestoreModalProps {
  deletedSections: DeletedSectionEntry[];
  onClose: () => void;
  onRestore: (entries: DeletedSectionEntry[]) => void;
}

// Unlike main's RestoreModal (a disconnected DELETED_SECTIONS mock),
// `deletedSections` here is the real trash DocumentCanvas accumulates from
// actual delete actions this session (see DocumentCanvas's `handleRemoveSection`)
// -- restoring genuinely reinserts the section into its original subject via
// useDocumentTree's `reset`. Sub-section deletes aren't trashed (a scoped
// simplification; only top-level section deletes are restorable today).
export const RestoreModal = ({ deletedSections, onClose, onRestore }: RestoreModalProps) => {
  const [checkedIds, setCheckedIds] = useState<string[]>([]);

  const handleToggle = (sectionId: string) => () =>
    setCheckedIds((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
    );

  const handleRestore = () => {
    onRestore(deletedSections.filter((entry) => checkedIds.includes(entry.section.id)));
  };

  return (
    <Modal
      title="שחזור סעיפים שנמחקו"
      onClose={onClose}
      width={420}
      data-testid={RESTORE_MODAL_IDS.root}
      footer={
        <>
          <CancelBtn type="button" onClick={onClose}>
            ביטול
          </CancelBtn>
          <RestoreBtn
            type="button"
            onClick={handleRestore}
            disabled={checkedIds.length === 0}
            data-testid={RESTORE_MODAL_IDS.restoreBtn}
          >
            שחזור ({checkedIds.length})
          </RestoreBtn>
        </>
      }
    >
      {deletedSections.length === 0 ? (
        <EmptyState data-testid={RESTORE_MODAL_IDS.emptyState}>אין סעיפים מחוקים</EmptyState>
      ) : (
        <List>
          {deletedSections.map((entry) => (
            <Row key={entry.section.id} data-testid={RESTORE_MODAL_IDS.row(entry.section.id)}>
              <input
                type="checkbox"
                checked={checkedIds.includes(entry.section.id)}
                onChange={handleToggle(entry.section.id)}
                data-testid={RESTORE_MODAL_IDS.checkbox(entry.section.id)}
              />
              {entry.section.title || 'סעיף ללא שם'}
            </Row>
          ))}
        </List>
      )}
    </Modal>
  );
};
