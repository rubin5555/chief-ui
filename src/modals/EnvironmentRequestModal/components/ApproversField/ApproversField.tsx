import { memo } from 'react';
import type { ApproverRank } from '../../EnvironmentRequestModal.constants';
import { ENV_PEOPLE_OPTIONS } from '../../EnvironmentRequestModal.constants';
import { FieldGroup, FieldLabel } from '../../EnvironmentRequestModal.styles';
import { ApproversByRankField } from '../ApproversByRankField';

interface ApproversFieldProps {
  value: Record<ApproverRank, string[]>;
  onChange: (rank: ApproverRank, selected: string[]) => void;
}

const ApproversFieldComponent = ({ value, onChange }: ApproversFieldProps) => (
  <FieldGroup>
    <FieldLabel>מאשרי המסמכים לפי סוג אישור</FieldLabel>
    <ApproversByRankField value={value} onChange={onChange} options={ENV_PEOPLE_OPTIONS} />
  </FieldGroup>
);

export const ApproversField = memo(ApproversFieldComponent);
