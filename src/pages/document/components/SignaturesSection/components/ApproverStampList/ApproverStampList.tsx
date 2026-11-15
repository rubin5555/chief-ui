import type { ApproverSignature } from '../../SignatureGateContext';
import { StampRow } from './ApproverStampList.styles';
import { APPROVER_STAMP_LIST_IDS } from './ApproverStampList.testids';
import { ApproverStamp } from './components/ApproverStamp';

export interface ApproverStampListProps {
  signatures: ApproverSignature[];
}

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
