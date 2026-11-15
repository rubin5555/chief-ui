import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import {
  APPROVAL_RANKS_FALLBACK,
  APPROVER_USERS_FALLBACK,
  HML_GROUPS_FALLBACK,
  useApprovalRanks,
  useApproverUsers,
  useHmlGroups,
} from '@/api/approvals';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { useApprovalDetailsModalAnalytics } from './ApprovalDetailsModal.analytics';
import { Body, Field, FieldLabel, Notes } from './ApprovalDetailsModal.styles';
import { APPROVAL_DETAILS_MODAL_IDS } from './ApprovalDetailsModal.testids';
import { ApproverTimeline } from './components/ApproverTimeline';
import { HmlSelect } from './components/HmlSelect';

const FORM_ID = 'approval-details-form';

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

export const ApprovalDetailsModal = ({
  onClose,
  onSubmit: onSubmitConfig,
}: ApprovalDetailsModalProps) => {
  const { data: ranksData } = useApprovalRanks();
  const { data: usersData } = useApproverUsers();
  const { data: hmlData } = useHmlGroups();

  const ranks = ranksData ?? APPROVAL_RANKS_FALLBACK.approvalRanks;
  const approverUsers = usersData ?? APPROVER_USERS_FALLBACK.approverUsers;
  const hmlGroups = hmlData ?? HML_GROUPS_FALLBACK.hmlGroups;

  const [topRank, setTopRank] = useState('');
  const [usersByRank, setUsersByRank] = useState<Record<string, string[]>>({});
  const [selectedHmlIds, setSelectedHmlIds] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const { trackRoundConfigured } = useApprovalDetailsModalAnalytics();

  const topRankIndex = ranks.indexOf(topRank);
  const activeRanks = topRankIndex >= 0 ? ranks.slice(0, topRankIndex + 1) : [];

  const handleAddUser = (rank: string, user: string) =>
    setUsersByRank((prev) => ({ ...prev, [rank]: [...(prev[rank] ?? []), user] }));

  const handleRemoveUser = (rank: string, user: string) =>
    setUsersByRank((prev) => ({
      ...prev,
      [rank]: (prev[rank] ?? []).filter((candidate) => candidate !== user),
    }));

  const handleNotesChange = (e: ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    trackRoundConfigured(activeRanks.length, selectedHmlIds.length);
    onSubmitConfig({
      stages: activeRanks.map((rank) => ({ rank, users: usersByRank[rank] ?? [] })),
      hmlGroupIds: selectedHmlIds,
      notes,
    });
  };

  return (
    <Modal
      title="אישור המסמך"
      onClose={onClose}
      width={580}
      data-testid={APPROVAL_DETAILS_MODAL_IDS.root}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            ביטול
          </Button>
          <Button
            type="submit"
            form={FORM_ID}
            disabled={activeRanks.length === 0}
            data-testid={APPROVAL_DETAILS_MODAL_IDS.submitBtn}
          >
            שליחה לאישור
          </Button>
        </>
      }
    >
      <Body id={FORM_ID} onSubmit={onSubmit}>
        <Field>
          <FieldLabel htmlFor="approval-rank">גורם מאשר</FieldLabel>
          <Select
            id="approval-rank"
            options={ranks}
            value={topRank}
            onChange={setTopRank}
            placeholder="בחר גורם מאשר"
            data-testid={APPROVAL_DETAILS_MODAL_IDS.rankSelect}
          />
        </Field>

        {activeRanks.length > 0 && (
          <ApproverTimeline
            ranks={activeRanks}
            usersByRank={usersByRank}
            approverUsers={approverUsers}
            onAddUser={handleAddUser}
            onRemoveUser={handleRemoveUser}
          />
        )}

        <Field>
          <FieldLabel>חמ״לים שנדרש מולם וידוא קבלה</FieldLabel>
          <HmlSelect groups={hmlGroups} selectedIds={selectedHmlIds} onChange={setSelectedHmlIds} />
        </Field>

        <Field>
          <FieldLabel htmlFor="approval-notes">הערות</FieldLabel>
          <Notes
            id="approval-notes"
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
