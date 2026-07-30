import { useRef, useState } from 'react';
import type { ModalHandle } from '@/components/ui/Modal';
import { Modal } from '@/components/ui/Modal';
import { DeletedSectionList } from './components/DeletedSectionList';
import { DeletedSectionPreview } from './components/DeletedSectionPreview';
import { useRestoreModalAnalytics } from './RestoreModal.analytics';
import { RestoreBody } from './RestoreModal.styles';
import { RESTORE_MODAL_IDS } from './RestoreModal.testids';
import type { DeletedSectionEntry } from './RestoreModal.types';

export type { DeletedSectionEntry };

export interface RestoreModalProps {
  deletedSections: DeletedSectionEntry[];
  onClose: () => void;
  onRestore: (entries: DeletedSectionEntry[]) => void;
}

const WIDTH = 1200;

export const RestoreModal = ({ deletedSections, onClose, onRestore }: RestoreModalProps) => {
  const modalRef = useRef<ModalHandle>(null);
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const { trackRestoreSubmitted } = useRestoreModalAnalytics();

  const onToggle = (sectionId: string) =>
    setCheckedIds((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
    );

  const handleRestore = () => {
    const restored = deletedSections.filter((entry) => checkedIds.includes(entry.section.id));
    trackRestoreSubmitted(restored.length);
    onRestore(restored);
  };

  return (
    <Modal
      ref={modalRef}
      title="שחזור סעיפים"
      onClose={onClose}
      width={WIDTH}
      maxWidth="88vw"
      height="82vh"
      noBodyPadding
      data-testid={RESTORE_MODAL_IDS.root}
    >
      <RestoreBody>
        <DeletedSectionList
          entries={deletedSections}
          checkedIds={checkedIds}
          onToggle={onToggle}
          onRestore={handleRestore}
        />
        <DeletedSectionPreview
          entries={deletedSections}
          checkedIds={checkedIds}
          onToggle={onToggle}
        />
      </RestoreBody>
    </Modal>
  );
};
