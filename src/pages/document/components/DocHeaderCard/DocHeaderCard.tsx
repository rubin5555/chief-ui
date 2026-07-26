import { Pencil } from 'lucide-react';
import { useState } from 'react';
import type { DocumentHeader } from '../../types';
import { EditDocDetailsModal } from '../EditDocDetailsModal';
import {
  Card,
  Chip,
  ChipLabel,
  ChipRow,
  ClassificationChip,
  EditBtn,
  Title,
  TitleRow,
} from './DocHeaderCard.styles';
import { DOC_HEADER_CARD_IDS } from './DocHeaderCard.testids';

export interface DocHeaderCardProps {
  header: DocumentHeader;
  status: string;
  onHeaderChange: (header: DocumentHeader) => void;
}

const CHIPS: { key: keyof DocumentHeader; label: string }[] = [
  { key: 'organization', label: 'ארגון' },
  { key: 'template', label: 'תבנית' },
  { key: 'orderNum', label: 'מספר פקודה' },
  { key: 'department', label: 'מחלקה' },
  { key: 'effectiveDate', label: 'תאריך תוקף' },
  { key: 'referenceNum', label: 'אסמכתא' },
];

// No existing dev precedent for this metadata pill — styled purely from
// theme.ts tokens per .claude/skills/styling-tokens.md. Owns the edit
// trigger + EditDocDetailsModal itself (mode="edit") per
// .claude/skills/modal-placement.md.
export const DocHeaderCard = ({ header, status, onHeaderChange }: DocHeaderCardProps) => {
  const [showEditModal, setShowEditModal] = useState(false);

  const handleOpenEdit = () => setShowEditModal(true);
  const handleCloseEdit = () => setShowEditModal(false);
  const handleSave = (next: DocumentHeader) => {
    onHeaderChange(next);
    setShowEditModal(false);
  };

  return (
    <Card data-testid={DOC_HEADER_CARD_IDS.root}>
      <TitleRow>
        <Title data-testid={DOC_HEADER_CARD_IDS.title}>{header.name}</Title>
        <ClassificationChip>{header.classification}</ClassificationChip>
        <EditBtn type="button" onClick={handleOpenEdit} aria-label="עריכת פרטי מסמך">
          <Pencil size={14} />
        </EditBtn>
      </TitleRow>
      <ChipRow>
        <Chip data-testid={DOC_HEADER_CARD_IDS.chip('status')}>
          <ChipLabel>סטטוס:</ChipLabel> {status}
        </Chip>
        {CHIPS.map((chip) => (
          <Chip key={chip.key} data-testid={DOC_HEADER_CARD_IDS.chip(chip.key)}>
            <ChipLabel>{chip.label}:</ChipLabel> {header[chip.key]}
          </Chip>
        ))}
      </ChipRow>

      {showEditModal && (
        <EditDocDetailsModal
          mode="edit"
          header={header}
          onClose={handleCloseEdit}
          onSave={handleSave}
        />
      )}
    </Card>
  );
};
