import { useRef } from 'react';
import { Button } from '@/components/ui/Button';
import type { ModalHandle } from '@/components/ui/Modal';
import { Modal } from '@/components/ui/Modal';
import type { SourceOrigin } from '../../types';
import {
  Intro,
  SystemCard,
  SystemField,
  SystemList,
  SystemName,
} from './SourceSystemsModal.styles';
import { SOURCE_SYSTEMS_MODAL_IDS } from './SourceSystemsModal.testids';

export interface SourceSystemsModalProps {
  systems: SourceOrigin[];
  /**
   * Whether the whole document or a single node was asked about. Only the opening
   * sentence differs, but it differs in number — "the systems below" against "the
   * system below" — so it can't be one string.
   */
  scope: 'doc' | 'node';
  onClose: () => void;
}

const INTRO = {
  doc: 'המסמך מכיל מידע שנוצר ממערכות המקור הבאות:',
  node: 'סעיף זה מכיל מידע שנוצר ממערכת המקור הבאה:',
};

// Where a document's — or a section's — imported content came from (main,
// Edit.tsx:4987).
//
// main keeps this list in a lookup table declared inside the render, keyed by
// node id with a `doc` entry alongside. Here the list arrives as a prop: the
// document carries its own `sourceSystems` and each node its `sourceOrigin`, so
// whoever opens the modal already holds the answer.
export const SourceSystemsModal = ({ systems, scope, onClose }: SourceSystemsModalProps) => {
  const modalRef = useRef<ModalHandle>(null);

  const handleClose = () => modalRef.current?.requestClose();

  return (
    <Modal
      ref={modalRef}
      title="מערכות מקור"
      width={440}
      onClose={onClose}
      footer={
        <Button type="button" onClick={handleClose} data-testid={SOURCE_SYSTEMS_MODAL_IDS.closeBtn}>
          סגור
        </Button>
      }
      data-testid={SOURCE_SYSTEMS_MODAL_IDS.root}
    >
      <Intro data-testid={SOURCE_SYSTEMS_MODAL_IDS.intro}>{INTRO[scope]}</Intro>

      <SystemList>
        {systems.map((system) => (
          <SystemCard
            key={`${system.name}-${system.field}`}
            data-testid={SOURCE_SYSTEMS_MODAL_IDS.system(system.name)}
          >
            <SystemName>{system.name}</SystemName>
            <SystemField>{system.field}</SystemField>
          </SystemCard>
        ))}
      </SystemList>
    </Modal>
  );
};
