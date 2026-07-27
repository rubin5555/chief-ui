import { gql } from '@apollo/client';
import { useApiQuery } from './hooks';
import { registerStub } from './stubLink';

// One query per concern (ranks / approver users / hml groups) rather than one
// giant GetApprovalConfig query, so panels can fetch only what they render —
// see .claude/skills/router-state-splitting.md's "data query moves with the
// component" rule.

export const GET_APPROVAL_RANKS_QUERY = gql`
  query GetApprovalRanks {
    approvalRanks
  }
`;

export interface GetApprovalRanksResult {
  approvalRanks: string[];
}

export const useApprovalRanks = () =>
  useApiQuery(GET_APPROVAL_RANKS_QUERY, (result: GetApprovalRanksResult) => result.approvalRanks);

export const APPROVAL_RANKS_FALLBACK: GetApprovalRanksResult = {
  approvalRanks: ['סא״ל', 'אל״ם', 'תא״ל', 'אלוף', 'רא״ל'],
};

registerStub('GetApprovalRanks', (): GetApprovalRanksResult => APPROVAL_RANKS_FALLBACK);

export const GET_APPROVER_USERS_QUERY = gql`
  query GetApproverUsers {
    approverUsers
  }
`;

export interface GetApproverUsersResult {
  approverUsers: string[];
}

export const useApproverUsers = () =>
  useApiQuery(GET_APPROVER_USERS_QUERY, (result: GetApproverUsersResult) => result.approverUsers);

export const APPROVER_USERS_FALLBACK: GetApproverUsersResult = {
  approverUsers: [
    'כהן א.',
    'לוי מ.',
    'גולן ד.',
    'פרץ י.',
    'ישראלי ש.',
    'רוזן ה.',
    'מלמד ר.',
    'דוד נ.',
  ],
};

registerStub('GetApproverUsers', (): GetApproverUsersResult => APPROVER_USERS_FALLBACK);

export interface HmlGroupDto {
  id: string;
  name: string;
  users: string[];
}

export const GET_HML_GROUPS_QUERY = gql`
  query GetHmlGroups {
    hmlGroups {
      id
      name
      users
    }
  }
`;

export interface GetHmlGroupsResult {
  hmlGroups: HmlGroupDto[];
}

export const useHmlGroups = () =>
  useApiQuery(GET_HML_GROUPS_QUERY, (result: GetHmlGroupsResult) => result.hmlGroups);

// ponytail: no backend/resolver yet — registered on stubLink, seeded from the
// same mock lists main's Edit.tsx ApprovalDetailsModal used (APPROVAL_RANKS/
// MOCK_APPROVER_USERS/MOCK_HML_LIST). Delete these registrations once real
// resolvers exist; call sites don't change.
export const HML_GROUPS_FALLBACK: GetHmlGroupsResult = {
  hmlGroups: [
    { id: 'north', name: 'חמ״ל צפון', users: ['רנ"ג כהן א.', 'סמ"ר לוי מ.'] },
    { id: 'south', name: 'חמ״ל דרום', users: ['סמ"ר גולן ד.', 'רנ"ג פרץ י.'] },
    { id: 'center', name: 'חמ״ל מרכז', users: ['רנ"ג ישראלי ש.', 'סמ"ר רוזן ה.'] },
  ],
};

registerStub('GetHmlGroups', (): GetHmlGroupsResult => HML_GROUPS_FALLBACK);

// --- Approval round stages (the carousel's seed) ---

export interface ApprovalStageDto {
  rank: string;
  users: string[];
  status: 'pending' | 'waiting' | 'approved';
  type: 'approver' | 'hml';
}

export const GET_APPROVAL_ROUND_STAGES_QUERY = gql`
  query GetApprovalRoundStages($docId: ID!) {
    approvalRoundStages(docId: $docId) {
      rank
      users
      status
      type
    }
  }
`;

export interface GetApprovalRoundStagesResult {
  approvalRoundStages: ApprovalStageDto[];
}

export interface GetApprovalRoundStagesVariables {
  docId: string;
}

export const useApprovalRoundStages = (docId: string) =>
  useApiQuery<GetApprovalRoundStagesResult, ApprovalStageDto[], GetApprovalRoundStagesVariables>(
    GET_APPROVAL_ROUND_STAGES_QUERY,
    (result) => result.approvalRoundStages,
    { docId },
    !docId,
  );

// main's MOCK_ROUND_STAGES (Edit.tsx:2535-2540), verbatim — two approver ranks
// followed by two חמ״ל stages, so the carousel opens on a populated round
// rather than an empty one. A round the user configures through
// ApprovalDetailsModal replaces this.
export const APPROVAL_ROUND_STAGES_FALLBACK: GetApprovalRoundStagesResult = {
  approvalRoundStages: [
    { rank: 'סא״ל', users: ['כהן א.', 'לוי מ.'], status: 'pending', type: 'approver' },
    { rank: 'אל״ם', users: ['גולן ד.'], status: 'waiting', type: 'approver' },
    { rank: 'חמ״ל צפון', users: ['רנ"ג כהן א.', 'סמ"ר לוי מ.'], status: 'waiting', type: 'hml' },
    { rank: 'חמ״ל דרום', users: ['סמ"ר גולן ד.', 'רנ"ג פרץ י.'], status: 'waiting', type: 'hml' },
  ],
};

registerStub(
  'GetApprovalRoundStages',
  (): GetApprovalRoundStagesResult => APPROVAL_ROUND_STAGES_FALLBACK,
);
