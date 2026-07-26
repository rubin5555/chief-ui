import type { DocumentHeader } from '../../types';
import {
  Card,
  Chip,
  ChipLabel,
  ChipRow,
  ClassificationChip,
  Title,
  TitleRow,
} from './DocHeaderCard.styles';
import { DOC_HEADER_CARD_IDS } from './DocHeaderCard.testids';

export interface DocHeaderCardProps {
  header: DocumentHeader;
  status: string;
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
// theme.ts tokens per .claude/skills/styling-tokens.md.
export const DocHeaderCard = ({ header, status }: DocHeaderCardProps) => (
  <Card data-testid={DOC_HEADER_CARD_IDS.root}>
    <TitleRow>
      <Title data-testid={DOC_HEADER_CARD_IDS.title}>{header.name}</Title>
      <ClassificationChip>{header.classification}</ClassificationChip>
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
  </Card>
);
