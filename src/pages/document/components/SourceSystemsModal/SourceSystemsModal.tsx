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
  scope: 'doc' | 'node';
  onClose: () => void;
}

const INTRO = {
  doc: 'המסמך מכיל מידע שנוצר ממערכות המקור הבאות:',
  node: 'סעיף זה מכיל מידע שנוצר ממערכת המקור הבאה:',
};

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
