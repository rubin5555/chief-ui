import type { ApproverSignature } from '../../SignatureGateContext';
import { StampRow } from './ApproverStampList.styles';
import { APPROVER_STAMP_LIST_IDS } from './ApproverStampList.testids';
import { ApproverStamp } from './components/ApproverStamp';

export interface ApproverStampListProps {
  signatures: ApproverSignature[];
}

// The stamps collected as a document moves through its approval round (main,
// Edit.tsx:4330). Below the text signatures, as main orders them (commit a88946f).
//
// Keyed by rank and name together: two approvers of the same rank are ordinary,
// and the same person approving twice at different ranks is not impossible.
export const ApproverStampList = ({ signatures }: ApproverStampListProps) => {
  if (signatures.length === 0) return null;

  return (
    <StampRow data-testid={APPROVER_STAMP_LIST_IDS.root}>
      {signatures.map((signature) => (
        <ApproverStamp key={`${signature.rank}-${signature.name}`} signature={signature} />
      ))}
    </StampRow>
  );
};
