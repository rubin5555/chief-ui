import type { ChangeEvent } from 'react';
import { useState } from 'react';
import {
  APPROVAL_RANKS_FALLBACK,
  APPROVER_USERS_FALLBACK,
  HML_GROUPS_FALLBACK,
  useApprovalRanks,
  useApproverUsers,
  useHmlGroups,
} from '@/api/approvals';
import { Modal } from '@/components/ui/Modal';
import { SearchableMultiSelect } from '@/components/ui/SearchableMultiSelect';
import {
  Body,
  CancelBtn,
  Field,
  FieldLabel,
  Notes,
  RankBlock,
  RankBlockTitle,
  SubmitBtn,
} from './ApprovalDetailsModal.styles';
import { APPROVAL_DETAILS_MODAL_IDS } from './ApprovalDetailsModal.testids';

export interface ApprovalRoundStageConfig {
  rank: string;
  users: string[];
}

export interface ApprovalRoundConfig {
  stages: ApprovalRoundStageConfig[];
  hmlGroupIds: string[];
  notes: string;
}

export interface ApprovalDetailsModalProps {
  onClose: () => void;
  onSubmit: (config: ApprovalRoundConfig) => void;
}

// Configures who approves (which ranks, which named users per rank) and
// which HML groups need receipt confirmation, before ApprovalRotation opens
// with this configuration. Simplified from main's cascading single-rank +
// inline-search-popover UI to a plain multi-select per concern (reusing
// SearchableMultiSelect throughout) — same configuration surface, less
// bespoke chrome.
export const ApprovalDetailsModal = ({ onClose, onSubmit }: ApprovalDetailsModalProps) => {
  const { data: ranksData } = useApprovalRanks();
  const { data: usersData } = useApproverUsers();
  const { data: hmlData } = useHmlGroups();

  const ranks = ranksData ?? APPROVAL_RANKS_FALLBACK.approvalRanks;
  const approverUsers = usersData ?? APPROVER_USERS_FALLBACK.approverUsers;
  const hmlGroups = hmlData ?? HML_GROUPS_FALLBACK.hmlGroups;

  const [selectedRanks, setSelectedRanks] = useState<string[]>([]);
  const [stageUsers, setStageUsers] = useState<Record<string, string[]>>({});
  const [selectedHmlNames, setSelectedHmlNames] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const handleRankUsersChange = (rank: string) => (users: string[]) =>
    setStageUsers((prev) => ({ ...prev, [rank]: users }));

  const handleNotesChange = (e: ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value);

  const handleSubmit = () => {
    const hmlGroupIds = hmlGroups
      .filter((group) => selectedHmlNames.includes(group.name))
      .map((group) => group.id);

    onSubmit({
      stages: selectedRanks.map((rank) => ({ rank, users: stageUsers[rank] ?? [] })),
      hmlGroupIds,
      notes,
    });
  };

  return (
    <Modal
      title="אישור המסמך"
      onClose={onClose}
      width={520}
      data-testid={APPROVAL_DETAILS_MODAL_IDS.root}
      footer={
        <>
          <CancelBtn type="button" onClick={onClose}>
            ביטול
          </CancelBtn>
          <SubmitBtn
            type="button"
            onClick={handleSubmit}
            disabled={selectedRanks.length === 0}
            data-testid={APPROVAL_DETAILS_MODAL_IDS.submitBtn}
          >
            שליחה לאישור
          </SubmitBtn>
        </>
      }
    >
      <Body>
        <Field>
          <FieldLabel>גורמים מאשרים</FieldLabel>
          <SearchableMultiSelect
            options={ranks}
            selected={selectedRanks}
            onChange={setSelectedRanks}
            placeholder="בחר גורמים מאשרים..."
            data-testid={APPROVAL_DETAILS_MODAL_IDS.ranksSelect}
          />
        </Field>

        {selectedRanks.map((rank) => (
          <RankBlock key={rank}>
            <RankBlockTitle>{rank}</RankBlockTitle>
            <SearchableMultiSelect
              options={approverUsers}
              selected={stageUsers[rank] ?? []}
              onChange={handleRankUsersChange(rank)}
              placeholder="בחר מאשרים..."
              data-testid={APPROVAL_DETAILS_MODAL_IDS.rankUsersSelect(rank)}
            />
          </RankBlock>
        ))}

        <Field>
          <FieldLabel>חמ״לים שנדרש מולם וידוא קבלה</FieldLabel>
          <SearchableMultiSelect
            options={hmlGroups.map((group) => group.name)}
            selected={selectedHmlNames}
            onChange={setSelectedHmlNames}
            placeholder="בחר חמ״לים..."
            data-testid={APPROVAL_DETAILS_MODAL_IDS.hmlSelect}
          />
        </Field>

        <Field>
          <FieldLabel>הערות</FieldLabel>
          <Notes
            value={notes}
            onChange={handleNotesChange}
            placeholder="הוסף הערות לסבב האישורים..."
            dir="rtl"
            data-testid={APPROVAL_DETAILS_MODAL_IDS.notes}
          />
        </Field>
      </Body>
    </Modal>
  );
};
